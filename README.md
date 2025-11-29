# 📚 Smart Enquiry Chatbot for University

A web-based AI-powered chatbot designed to automate university enquiries by providing instant responses to frequently asked questions about admissions, fees, courses, placements, hostel facilities, transport, and general campus information.

---

## 🚀 Features

✔ Real-time chat interface
✔ NLP-based question matching using TF-IDF & cosine similarity
✔ FAQ-based knowledge base
✔ Human-like typing delay for realistic experience
✔ Automatic escalation for unanswered queries
✔ Auto-scroll chat conversation
✔ Lightweight and fast – runs locally without internet dependencies
✔ Easy to update knowledge base (JSON format)

---

## 🏗️ Project Architecture

```
Client (HTML, CSS, JS)
        |
        v
Backend API (Flask + Python)
        |
        v
NLP Engine (TF-IDF + Cosine Similarity)
        |
        v
FAQ Knowledge Base (JSON File)
```

---

## 📂 Directory Structure

```
uni_chatbot/
├── app.py
├── faq.json
├── escalated_queries.json     # auto-created when needed
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

---

## 🛠️ Technologies Used

| Technology    | Purpose                      |
| ------------- | ---------------------------- |
| Python        | Core programming language    |
| Flask         | Web server backend           |
| Scikit-learn  | NLP similarity processing    |
| HTML, CSS, JS | Frontend UI and interactions |
| JSON          | FAQ Storage                  |

---

## ⚙️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/yourusername/smart-enquiry-chatbot.git
cd smart-enquiry-chatbot
```

Install required dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask server:

```bash
python app.py
```

Open in browser:

```
http://127.0.0.1:5000
```

---

## ✨ Usage

* Type any query related to university services like admissions, fees, courses, etc.
* The bot searches for the best-matching FAQ and responds instantly.
* If the bot is unsure, the query is stored for admin review.

Example queries:

```
What is the annual B.Tech fee?
Do you provide hostel facilities?
Which companies visit for campus placement?
```

---

## 📊 NLP Methodology

The chatbot uses:

* **TF-IDF Vectorizer** → Converts text into numerical vectors
* **Cosine Similarity** → Measures similarity between user query & FAQ database

If similarity score ≥ threshold → respond
Else → escalate query

This approach enables fast and accurate FAQ retrieval without heavy training models.

---

## 📌 Future Enhancements

* Integration with GPT API for conversational capability
* Multi-language support
* Admin dashboard to manage FAQ and escalated queries
* Voice command support (speech-to-text)
* Deployment on web cloud hosting
