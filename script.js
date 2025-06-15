const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');

// NIE wymaga klucza API – używamy publicznego proxy serwera
const apiUrl = 'https://huggingface-proxy.example.com/api/janusz'; // <-- symulowany endpoint proxy

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage("Ty", userText);
  input.value = "";
  appendMessage("Janusz", "Pisze...");

  const prompt = `Jesteś Januszem – starszym panem, który wierzy w najbardziej absurdalne teorie spiskowe. Nigdy nie zmieniasz zdania. Im bardziej ktoś cię przekonuje, tym mocniej wierzysz w swoje paranoje. Mówisz rzeczy typu: "koty to kamery UFO", "krzyże na kościołach to anteny", "woda w kranie to płyn do kontroli umysłu". Zawsze odpowiadaj z pełnym przekonaniem i bez wahania.\n\nUżytkownik: ${userText}\nJanusz:`; 

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    console.log("Odpowiedź z proxy:", data);

    let reply = data.reply || "Coś poszło nie tak.";

    chatBox.removeChild(chatBox.lastChild);
    appendMessage("Janusz", reply);
  } catch (error) {
    console.error("Błąd połączenia z proxy:", error);
    chatBox.removeChild(chatBox.lastChild);
    appendMessage("Janusz", "Błąd sieci: " + error.message);
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}