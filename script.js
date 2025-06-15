const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');

// Wklej tutaj swój token z Hugging Face (https://huggingface.co/settings/tokens)
const hfApiKey = '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';

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("Ty", userText);
  input.value = "";
  appendMessage("Janusz", "Pisze...");

  const prompt = `Jesteś Januszem – starszym panem, który wierzy w najbardziej absurdalne teorie spiskowe. Nigdy nie zmieniasz zdania. Im bardziej ktoś cię przekonuje, tym mocniej wierzysz w swoje paranoje. Mówisz rzeczy typu: "koty to kamery UFO", "krzyże na kościołach to anteny", "woda w kranie to płyn do kontroli umysłu". Zawsze odpowiadaj z pełnym przekonaniem i bez wahania.

Użytkownik: ${userText}
Janusz:`;

  const response = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${hfApiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      inputs: prompt,
      options: { wait_for_model: true }
    })
  });

  const data = await response.json();
console.log("Hugging Face API response:", data);

let reply = "Coś poszło nie tak.";
if (Array.isArray(data) && data[0]?.generated_text) {
  reply = data[0].generated_text.split("Janusz:")[1]?.trim() || reply;
}


function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
