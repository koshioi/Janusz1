
const apiUrl = '/.netlify/functions/janusz';

async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  appendMessage("Ty", text);
  input.value = "";
  appendMessage("Janusz", "pisze...");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text }),
    });
    const data = await res.json();
    const nodes = document.querySelectorAll("#chat-box div");
    if (nodes.length) nodes[nodes.length - 1].remove(); // usuń "pisze..."
    appendMessage("Janusz", data.reply || "Brak odpowiedzi.");
  } catch (err) {
    appendMessage("Janusz", "Błąd sieci: " + err.message);
  }
}

function appendMessage(sender, text) {
  const box = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${text}`;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
}
