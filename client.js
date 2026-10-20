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

  //ws.send(message); //서버로 message 날리기
  ws.send(JSON.stringify({ type: "chat", text: message })); // 얘는 객체로 그대로 보내는건데 이러면 JS밖에 이해를 못해서 stringify로 감싼것
  //addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});

// ------------Welcome WebSocket World-----------------
const ws = new WebSocket(`ws://${location.host}`);

ws.onopen = () => {
  console.log("서버 연결");
};
ws.onmessage = (event) =>{
  //string -> json
  const data = event.data;
  const json = JSON.parse(data);

  //type : chat -> 채팅창에 대화로 추가(li)
  switch(json.type){
    case "chat" : 
      console.log(json.text);
      addMessage(json.text);
      break;
  }
}
ws.close = () => {
  console.log("서버 연결 해제");
};
