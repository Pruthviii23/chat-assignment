from flask import Flask, render_template, request, jsonify
import json
import os
from datetime import datetime

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

# ---------- Load FAQ and build vectorizer ----------

FAQ_FILE = "faq.json"
ESCALATION_FILE = "escalated_queries.json"

with open(FAQ_FILE, "r", encoding="utf-8") as f:
    faq_data = json.load(f)

faq_questions = [item["question"] for item in faq_data]

# TF-IDF vectorizer on questions
vectorizer = TfidfVectorizer(stop_words="english")
faq_matrix = vectorizer.fit_transform(faq_questions)

# Similarity threshold for “confident enough”
SIMILARITY_THRESHOLD = 0.35


def save_escalated_query(user_query, best_similarity, best_faq_id=None):
    """Append escalated query to a JSON file so admin can review later."""
    record = {
        "user_query": user_query,
        "timestamp": datetime.now().isoformat(timespec="seconds"),
        "similarity": float(best_similarity),
        "best_faq_id": best_faq_id
    }

    if os.path.exists(ESCALATION_FILE):
        with open(ESCALATION_FILE, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    data.append(record)

    with open(ESCALATION_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def get_best_answer(user_query: str):
    """Return best matched FAQ answer and similarity score."""
    if not user_query or not user_query.strip():
        return None, 0.0, None

    # Create vector for user query
    user_vec = vectorizer.transform([user_query])
    # Compute cosine similarity with all FAQ questions
    similarities = cosine_similarity(user_vec, faq_matrix)[0]
    # Get index of best match
    best_idx = similarities.argmax()
    best_score = similarities[best_idx]

    best_faq = faq_data[best_idx]
    return best_faq["answer"], best_score, best_faq["id"]


# ---------- Routes ----------

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = (data.get("message") or "").strip()

    if not user_message:
        return jsonify({
            "reply": "Please type a question so I can help you.",
            "escalated": False,
            "similarity": 0.0
        })

    answer, score, faq_id = get_best_answer(user_message)

    if answer and score >= SIMILARITY_THRESHOLD:
        return jsonify({
            "reply": answer,
            "escalated": False,
            "similarity": float(score)
        })
    else:
        # Escalate to admin
        save_escalated_query(user_message, score, faq_id)
        reply_text = (
            "I'm not completely sure about this. "
            "I have forwarded your query to the administration team. "
            "They will get back to you soon."
        )
        return jsonify({
            "reply": reply_text,
            "escalated": True,
            "similarity": float(score)
        })


if __name__ == "__main__":
    app.run(debug=True)
