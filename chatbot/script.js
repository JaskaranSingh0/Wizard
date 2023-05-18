// Chatbot functionality
const chatLog = document.getElementById("chat-log");
const userInput = document.getElementById("user-message");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage !== "") {
    displayMessage(userMessage, "user");
    
    try {
      const response = await sendToChatGPT(userMessage);
      displayMessage(response, "bot");
    } catch (error) {
      displayMessage("Oops! Something went wrong.", "bot");
      console.error(error);
    }
    
    userInput.value = "";
  }
}

async function sendToChatGPT(message) {
  const apiKey = "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"; // Replace with your ChatGPT-4 API key
  const url = "https://api.openai.com/v1/chat/completions";
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "text-davinci-003", // Replace with the appropriate ChatGPT-4 model
      messages: [{ role: "system", content: "You are a chatbot" }, { role: "user", content: message }]
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    return data.choices[0].message.content;
  } else {
    throw new Error(data.error.message || "Failed to get a response from the API.");
  }
}

function displayMessage(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.textContent = message;
  chatLog.appendChild(messageElement);
  chatLog.scrollTop = chatLog.scrollHeight;
}
