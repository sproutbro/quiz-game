import { parse, serialize } from "cookie";
import { encrypt, decrypt } from "../src/lib/util.js";

let players = {};
const intervalTimer = 10000;

//
let question = newQuestion();
setInterval(() => {
  question = newQuestion();
}, intervalTimer);

function newQuestion() {
  let randomNumber = Math.floor(Math.random() * 8) + 2;
  let randomNumber2 = Math.floor(Math.random() * 8) + 2;

  return {
    question: `${randomNumber} * ${randomNumber2} =`,
    answer: randomNumber * randomNumber2,
  };
}

export default function socketIO(io) {
  // 소켓 연결 이벤트 처리
  io.on("connection", (socket) => {
    console.log(`a user connected`);

    // 쿠키 가져오기
    const cookies = getCookie(socket);

    // 플레이어 등록하기
    if (cookies) {
      registerPlayer(socket.id, cookies);
      io.emit("setPlayer", players);
    }

    // 문제 보여주기
    socket.emit("question", question.question);
    showQuestion(socket);

    socket.on("chat message", (data) => {
      if (data == question.answer) {
        players[socket.id].score += 1;
        io.emit("setPlayer", players);
      }

      io.emit("chat message", `${players[socket.id].nickname}: ${data}`);
    });

    socket.on("disconnect", () => {
      delete players[socket.id];
      io.emit("setPlayer", players);
      console.log("user disconnected");
    });
  });
}

// 쿠키 가져오기
function getCookie(socket) {
  let cookies = socket.handshake.headers.cookie;
  if (cookies) cookies = parse(cookies);

  console.log("쿠키 가져오기 : ", cookies ? Object.keys(cookies) : null);
  return cookies;
}

// 플레이어 등록하기
function registerPlayer(id, cookies) {
  console.log("플레이어 등록하기");
  const user_info = JSON.parse(decrypt(cookies.user_info));
  const nickname = user_info.nickname;
  const avatar = JSON.parse(decrypt(cookies.avatar));

  players[id] = { score: 0, nickname, avatar };
}

// 문제 보여주기
function showQuestion(socket) {
  console.log("문제 보여주기");
  setInterval(() => {
    socket.emit("question", question.question);
  }, intervalTimer);
}
