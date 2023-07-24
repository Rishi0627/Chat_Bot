const chatInput = document.querySelector(".chat_input textarea");
const sendChat = document.querySelector(".chat_input span");
const messageSpace = document.querySelector(".chatbot ul");
let userMessage;
const API_KEY = "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";
const chatbotCollapse = document.querySelector(".chatbot_collapse");
const closeBtn = document.querySelector(".close_btn");
const inputHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const newList = document.createElement("li");
  newList.classList.add("chat", className);
  newList.innerHTML = `<p></p>`;
  newList.querySelector("p").textContent = message;
  return newList;
};

const createChatLiboatRespond = (message, className) => {
  const newList = document.createElement("li");
  newList.classList.add("chat", className);
  const spanElement = document.createElement("span");

  // Create a new image element
  const imgElement = document.createElement("img");
  imgElement.src = "./images/chatbot.png"; // Set the image source
  imgElement.classList.add("bot_img");

  // Append the image element to the span element
  spanElement.appendChild(imgElement);

  newList.appendChild(spanElement);
  console.log(newList);
  newList.innerHTML += `<p></p>`;
  newList.querySelector("p").textContent = message;
  return newList;
};

const generateResponse = (incomingChatLI) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = incomingChatLI.querySelector("p");
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content;
    })
    .catch((error) => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops!something went wrong,please try again.";
    })
    .finally(() => messageSpace.scrollTo(0, messageSpace.scrollHeight));
};

const afterSend = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  chatInput.value = "";
  chatInput.style.height = `${inputHeight}px`;

  messageSpace.appendChild(createChatLi(userMessage, "user_responding"));
  //scrool.TO(x,y) scrooling in x coordinates and y coordinates
  messageSpace.scrollTo(0, messageSpace.scrollHeight);

  setTimeout(() => {
    const incomingChatLI = createChatLiboatRespond(
      "Responding....",
      "boat_responding"
    );
    messageSpace.appendChild(incomingChatLI);
    generateResponse(incomingChatLI);
  }, 600);
};

closeBtn.addEventListener("click", function () {
  document.body.classList.remove("show_chatbot");
});

chatbotCollapse.addEventListener("click", function () {
  document.body.classList.toggle("show_chatbot");
});

sendChat.addEventListener("click", afterSend());

chatInput.addEventListener("input", function () {
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    afterSend();
  }
});
