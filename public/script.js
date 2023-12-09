// scripts.js
    // Here's a basic JavaScript file to handle voice input, ChatGPT interaction, and 
    // voice output. This example assumes you have already set up a server-side script 
    // to handle the ChatGPT API requests.

// Set up SpeechRecognition
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';

// Set up SpeechSynthesis
const synth = window.speechSynthesis;

// Reference the conversation container
const conversationContainer = document.getElementById('conversation');

// Function to add messages to the conversation container
function addMessage(text, className) {
  const message = document.createElement('div');
  message.classList.add(className);
  message.innerText = text;
  conversationContainer.appendChild(message);
  conversationContainer.scrollTop = conversationContainer.scrollHeight;
}

// Function to send user input to server and receive ChatGPT response
async function getChatGPTResponse(userInput) {
  const response = await fetch('/api/chatgpt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input: userInput }),
  });

  const data = await response.json();
  return data.output;
}

// Function to start voice input
function startVoiceInput() {
  recognition.start();
  document.getElementById("voice_status").innerText = "Listening..";
}

// Function to stop voice input
function stopVoiceInput() {
  document.getElementById("voice_status").innerText = "";
  recognition.stop();
}

// SpeechRecognition event handlers
    // This JavaScript code sets up the necessary event handlers for the 
    // SpeechRecognition and SpeechSynthesis APIs. The startVoiceInput and 
    // stopVoiceInput functions control voice input, while the 
    // getChatGPTResponse function handles ChatGPT interaction. The 
    // addMessage function updates the conversation container with user 
    // input and ChatGPT responses.
recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    if (event.results[event.results.length - 1].isFinal) {
      stopVoiceInput();
      if (!transcript) {
        document.getElementById("voice_status").innerText = "Speech not recognized";
        return;
      }
      addMessage(transcript, 'user');
  
      const chatGPTResponse = await getChatGPTResponse(transcript);
      addMessage(chatGPTResponse, 'chatgpt');
  
      const utterance = new SpeechSynthesisUtterance(chatGPTResponse);
      synth.speak(utterance);
    }
  };
  
recognition.onerror = (event) => {
  console.error('SpeechRecognition error:', event.error);
};


// Start voice input automatically when the web app is loaded
// startVoiceInput();