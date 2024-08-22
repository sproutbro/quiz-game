import { parse } from "cookie";
import { decrypt } from "../src/lib/util.js";
import queries from "../src/lib/db/queries.js";

const file = "socket.js";

export default function socketIO(io) {
  let players = {};
  let quiz = { question: 0, answer: 0 };

  let token;
  let access;
  let profile;
  let score;
  let timer = 5;

  io.on("connection", async (socket) => {
    console.log(`a user connected`);

    io.emit("new question", quiz.question);

    token = getToken(socket);
    if (!token) return;

    access = [token.provider, token.providerId];

    if (!profile) profile = await executeTry("selectProfile", access);
    if (!score) score = await executeTry("selectScore", access);

    players[socket.id] = { profile, score };
    emit("set player", players);

    socket.on("chat message", (data) => {
      const nickname = players[socket.id].profile.nickname;
      emit("chat message", `${nickname}: ${data}`);
    });

    socket.on("answer", async (data) => {
      const user_answer = Number(data);
      const answer = quiz.answer;
      const correct = user_answer === answer;
      console.log({ file }, "answer");
      console.log({
        user_answer,
        answer,
        correct,
      });

      if (correct) {
        let score = players[socket.id].score.math;
        let params = [++score, ...access];
        players[socket.id].score = await executeTry("updateScore", params);
        emit("update player", players[socket.id]);
      }

      setQuiz();
      io.emit("new question", quiz.question);
    });

    socket.on("disconnect", () => {
      emit("delete player", socket.id);
      delete players[socket.id];
      console.log("user disconnected");
    });
  });

  function getToken(socket) {
    console.log({ file }, getToken);

    let header_cookie = socket.handshake.headers.cookie;
    let parse_cookies;

    if (!header_cookie) return;
    parse_cookies = parse(header_cookie);

    if (!parse_cookies?.token) return;
    return JSON.parse(decrypt(parse_cookies.token));
  }

  function setQuiz() {
    const num1 = Math.floor(Math.random() * 5) + 1;
    const num2 = Math.floor(Math.random() * 5) + 1;
    const question = `${num1} * ${num2} = `;
    const answer = num1 * num2;
    quiz = { question, answer };
  }

  async function executeTry(name, params) {
    try {
      return await queries[name](params);
    } catch (error) {
      console.error(error);
    }
  }

  function emit(emit, params) {
    console.log({ file }, { emit }, { params: !!params });
    io.emit(emit, params);
  }

  setInterval(() => {
    io.emit("time count", --timer);
    if (!timer) timer = 20;
  }, 1000);
}
