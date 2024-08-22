<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  /** @type {import('./$types').PageData} */
  export let data;

  let players = {};
  let player = {};
  let socket;
  let answer = null;

  const path = "/";

  onMount(() => {
    const player_section_element = document.getElementById("player");
    const chat_section_element = document.getElementById("chat");
    const quiz_question_element = document.querySelector(".quiz_question");
    const timer_element = document.querySelector(".timer");

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true, // 쿠키를 함께 전송
    });

    socket.on("set player", (data) => {
      players = data;
      player = players[socket.id];

      player_section_element.innerHTML = "";
      for (let key in players) {
        const player = players[key];
        const player_a_element = document.createElement("a");
        player_a_element.id = key;
        player_a_element.textContent = `${player.profile.nickname}: ${player.score.math}`;
        player_a_element.href = `/user/profile/${player.profile.provider}_${player.profile.provideraccountid}`;

        player_section_element.appendChild(player_a_element);
      }
    });

    socket.on("chat message", (data) => {
      const newChatElement = document.createElement("div");
      newChatElement.textContent = data;
      chat_section_element.appendChild(newChatElement);
    });

    socket.on("new question", (data) => {
      quiz_question_element.innerHTML = data;
    });

    socket.on("update player", (data) => {
      player.score = data.score;
      player.priofile = data.profile;
      const player_a_element = document.getElementById(socket.id);
      player_a_element.textContent = `${player.profile.nickname}: ${player.score.math}`;
    });

    socket.on("time count", (timer) => {
      timer_element.innerHTML = timer;
      if (!timer) initAnswer();
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });

  function handleAnswerSubmit(e) {
    const answer_input_element = e.currentTarget.answer;
    answer = answer ? null : answer_input_element.value;
    if (!answer) answer_input_element.value = null;
  }

  function handleChatSubmit(e) {
    const chat_message = e.currentTarget.chat_message.value;
    emit("chat message", chat_message);
  }

  function initAnswer() {
    emit("answer", answer);
    answer = null;
  }

  function emit(emit, data) {
    socket.emit(emit, data);
  }
</script>

<section id="player"></section>
<section id="quiz">
  <div class="quiz_question"></div>
  <div class="quiz_answer">
    <form on:submit|preventDefault={handleAnswerSubmit}>
      <label for="">정답:</label>
      <input
        type="text"
        name="answer"
        value={answer}
        disabled={answer || !data.isLogin}
      />
      <button disabled={!data.isLogin}
        >{!answer ? "정답입력" : "정답수정"}</button
      >
    </form>
  </div>
  <div class="quiz_timer">
    <p>남은시간: <span class="timer"></span></p>
  </div>
</section>
<section id="chat"></section>
<section id="input">
  <form on:submit|preventDefault={handleChatSubmit}>
    <input type="text" name="chat_message" disabled={!data.isLogin} />
    <button disabled={!data.isLogin}>Submit</button>
  </form>
</section>

<style>
  #quiz {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid black;
  }

  #player {
    width: 100%;
    padding: 10px;
    margin-top: 10px;
    border: 1px solid black;
  }
</style>
