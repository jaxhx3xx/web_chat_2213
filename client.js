const chatForm = document.querySelector("#chat-form");
const chatInput = document.querySelector("#chat-input");
const messages = document.querySelector("#messages");

function addMessage(message) {
  const li = document.createElement("li");
  li.textContent = message;
  messages.appendChild(li);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault(); // 화면 깜빡거리는 기본동작 막기

  const message = chatInput.value.trim(); //앞 뒤 여백자르기
  if (!message) return; //메세지 빈칸이면 return해라

  addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});

// ------------Welcome WebSocket World-----------------
const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
  console.log("서버 연결");
};
ws.close = () => {
  console.log("서버 연결 해제");
};
