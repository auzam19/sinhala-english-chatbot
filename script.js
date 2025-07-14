let selectedLanguage = null;

// Voice input
let recognition = null;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
}

function selectLanguage(lang) {
  selectedLanguage = lang;
  document.getElementById('language-select').style.display = 'none';
  document.getElementById('chat-controls').style.display = 'flex';
  addBotMessage(lang === 'english' ? "Hello! How are you?" : "හෙලෝ! ඔබට කොහොමද?");
  if (recognition) {
    recognition.lang = lang === 'english' ? 'en-US' : 'si-LK';
  }
}

function changeLanguage() {
  selectedLanguage = null;
  document.getElementById('language-select').style.display = 'block';
  document.getElementById('chat-controls').style.display = 'none';
}

function clearChat() {
  document.getElementById('chat-window').innerHTML = '';
}

function addBotMessage(text) {
  const chat = document.getElementById('chat-window');
  const div = document.createElement('div');
  div.className = 'message bot';
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  speak(text);
}

function addUserMessage(text) {
  const chat = document.getElementById('chat-window');
  const div = document.createElement('div');
  div.className = 'message user';
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message || !selectedLanguage) return;

  addUserMessage(message);
  input.value = '';

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: selectedLanguage, message })
    });
    const data = await response.json();
    addBotMessage(data.reply);
  } catch (error) {
    addBotMessage("Error connecting to server.");
  }
}

function startListening() {
  if (recognition) {
    recognition.start();
  }
}

if (recognition) {
  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    document.getElementById('user-input').value = transcript;
    sendMessage();
  };
}

// Text-to-speech
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage === 'english' ? 'en-US' : 'si-LK';
    speechSynthesis.speak(utterance);
  }
}
