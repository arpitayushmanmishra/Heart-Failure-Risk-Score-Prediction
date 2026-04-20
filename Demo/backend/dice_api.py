from flask import Flask, request, jsonify
from flask_cors import CORS # type: ignore
import pandas as pd
import joblib
import dice_ml
from dice_ml import Dice

app = Flask(__name__)
CORS(app)

# ======================
# LOAD DATA + MODELS
# ======================
df = pd.read_csv("cleaned_train.csv")

TARGET = "target"
X = df.drop(columns=[TARGET])

# Model for counterfactuals
rf = joblib.load("rf_model.pkl")

# Model for risk probability (IMPORTANT)
catboost_model = joblib.load("catboost_model.pkl")

def predict_proba(model, df):
    return model.predict_proba(df)[:, 1]


# ======================
# DICE SETUP
# ======================
data_dice = dice_ml.Data(
    dataframe=df,
    continuous_features=list(X.columns),
    outcome_name=TARGET
)

model_dice = dice_ml.Model(model=rf, backend="sklearn")
dice = Dice(data_dice, model_dice)

# ======================
# SETTINGS
# ======================
features_to_vary_default = ['trestbps', 'oldpeak', 'thalch', 'chol', 'ca']

permitted_range = {
    'trestbps': [80, 200],
    'oldpeak': [0, 6],
    'thalch': [60, 200],
    'chol': [100, 400],
    'ca': [0, 3]
}

# ======================
# MAIN API
# ======================
@app.route("/counterfactual", methods=["POST"])
def generate_cf():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        if data.get("risk") != "High":
            return jsonify({
                "message": "Counterfactuals only for high-risk patients",
                "counterfactuals": []
            })

        # -----------------
        # CLEAN INPUT
        # -----------------
        clean_data = {k: v for k, v in data.items() if k in X.columns}
        query = pd.DataFrame([clean_data])

        # Fix naming mismatch
        if "thalach" in query.columns:
            query.rename(columns={"thalach": "thalch"}, inplace=True)

        # Ensure all columns exist
        for col in X.columns:
            if col not in query.columns:
                query[col] = 0

        query = query[X.columns]

        # -----------------
        # FEATURES TO VARY
        # -----------------
        features_to_vary = data.get("top_features", [])

        if not isinstance(features_to_vary, list):
            features_to_vary = []

        if not features_to_vary:
            features_to_vary = features_to_vary_default

        features_to_vary = [f for f in features_to_vary if f in X.columns]

        # -----------------
        # GENERATE CFs
        # -----------------
        cf = dice.generate_counterfactuals(
            query,
            total_CFs=3,
            desired_class=0,
            features_to_vary=features_to_vary,
            permitted_range=permitted_range
        )

        cf_list = cf.cf_examples_list[0].final_cfs_df

        if cf_list is None or cf_list.empty:
            return jsonify({
                "message": "No counterfactuals found",
                "counterfactuals": []
            })

        # -----------------
        # COMPUTE RISK
        # -----------------
        original_prob = predict_proba(catboost_model, query)[0]

        results = []
        seen_global_changes = set()

        for i in range(len(cf_list)):
            cf_instance = cf_list.iloc[[i]]
            cf_prob = predict_proba(catboost_model, cf_instance)[0]

            risk_reduction = ((original_prob - cf_prob) / original_prob) * 100

            changes = []

            for col in features_to_vary:
                original_val = query.iloc[0][col]
                new_val = cf_instance.iloc[0][col]
                diff = new_val - original_val

                if abs(diff) > 0.1:
                    change_key = (col, round(new_val, 2))

                    # remove repeated global suggestions
                    if change_key in seen_global_changes:
                        continue
                    seen_global_changes.add(change_key)

                    # skip unrealistic suggestions
                    if col == "trestbps" and new_val > original_val:
                        continue

                    changes.append({
                        "feature": col,
                        "change": "increase" if diff > 0 else "decrease",
                        "amount": round(abs(diff), 2)
                    })

            if not changes:
                continue

            # narrative explanation
            changes_text = []
            for c in changes:
                direction = "increase" if c["change"] == "increase" else "decrease"
                changes_text.append(f"{c['feature']} {direction} by {c['amount']}")

            explanation = (
                f"Risk {original_prob:.2f} → {cf_prob:.2f} "
                f"({risk_reduction:.1f}% reduction) if "
                + ", ".join(changes_text)
            )

            results.append({
                "recommendation": i + 1,
                "original_risk": round(original_prob, 2),
                "new_risk": round(cf_prob, 2),
                "risk_reduction": round(risk_reduction, 2),
                "changes": changes,
                "explanation": explanation
            })

        # sort best first
        results.sort(key=lambda x: x["risk_reduction"], reverse=True)

        return jsonify({
            "total_recommendations": len(results),
            "counterfactuals": results
        })

    except Exception as e:
        print("ERROR:", str(e))
        return jsonify({"error": str(e)}), 500


# ======================
# RUN SERVER
# ======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)