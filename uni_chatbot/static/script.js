const chatWindow = document.getElementById("chat-window");
const chatContainer = document.querySelector(".chat-container"); // <-- scrollable one
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

// minimum time (ms) the bot should "think" before replying
const MIN_BOT_DELAY = 1000;

// ---- helpers ----

function scrollToBottom() {
  // scroll the container that actually has overflow-y: auto
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth"
  });
}

// create a message row
function appendMessage(text, sender = "bot", metaText = "") {
  const row = document.createElement("div");
  row.classList.add("message-row", sender);

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");
  bubble.innerText = text;

  if (metaText) {
    const meta = document.createElement("span");
    meta.classList.add("message-meta");
    meta.innerText = metaText;
    bubble.appendChild(document.createElement("br"));
    bubble.appendChild(meta);
  }

  row.appendChild(bubble);
  chatWindow.appendChild(row);

  scrollToBottom();
}

// typing indicator
function showTypingIndicator() {
  const existing = document.getElementById("typing-indicator-row");
  if (existing) return; // avoid duplicates

  const row = document.createElement("div");
  row.classList.add("message-row", "bot");
  row.id = "typing-indicator-row";

  const bubble = document.createElement("div");
  bubble.classList.add("message-bubble");

  const typing = document.createElement("div");
  typing.classList.add("typing");

  for (let i = 0; i < 3; i++) {
    const dot = document.createElement("div");
    dot.classList.add("dot");
    typing.appendChild(dot);
  }

  bubble.appendChild(typing);
  row.appendChild(bubble);
  chatWindow.appendChild(row);

  scrollToBottom();
}

function removeTypingIndicator() {
  const row = document.getElementById("typing-indicator-row");
  if (row) {
    row.remove();
    scrollToBottom();
  }
}

// ---- initial greeting ----

appendMessage(
  "Hi! I am UniBot 🤖. Ask me anything about admissions, fees, courses, placements or events.",
  "bot"
);

// ---- form submit handler ----

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  // user message
  appendMessage(message, "user");
  userInput.value = "";

  // show typing animation
  showTypingIndicator();
  const startTime = Date.now();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    // enforce a minimum delay to feel more "human"
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, MIN_BOT_DELAY - elapsed);

    setTimeout(() => {
      removeTypingIndicator();

      const metaText = data.escalated ? "⚠️ Escalated to admin" : "";
      appendMessage(data.reply, "bot", metaText);
    }, remaining);
  } catch (err) {
    console.error(err);
    removeTypingIndicator();
    appendMessage(
      "Sorry, something went wrong while processing your request. Please try again.",
      "bot"
    );
  }
});
