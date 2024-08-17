<script>
  import { onMount } from "svelte";
  import io from "socket.io-client";

  export let data;

  let socket;
  let player_section;
  let chat_section;
  let quiz_section;

  // 플레이어 등록
  function setPlayer(players) {
    player_section.innerHTML = "";
    for (let key in players) {
      const value = players[key];

      const newScoreElement = document.createElement("div");
      newScoreElement.id = key;
      newScoreElement.textContent = `${value.nickname}: ${value.score}`;

      // 아바타
      const newAvatarElement = document.createElement("div");
      newAvatarElement.classList.add("avatar");
      newAvatarElement.style.display = "none";
      const avatar = value.avatar;
      for (let key in avatar) {
        const value = avatar[key];
        const newImgElement = document.createElement("img");
        newImgElement.src = value || `/img/${key}01.png`;
        newImgElement.alt = key;

        newAvatarElement.appendChild(newImgElement);
      }
      newScoreElement.appendChild(newAvatarElement);

      player_section.appendChild(newScoreElement);
    }
  }

  // 채팅 메세지 전송
  function handleChatSubmit(event) {
    const chat_message = event.currentTarget.chat_message.value;
    socket.emit("chat message", chat_message);
  }

  // 플레이어 정보창
  function handlePlayerClick(e) {
    let avatartElement;

    if (e.target.tagName === "DIV") {
      avatartElement = e.target.querySelector(".avatar");
    } else if (e.target.tagName === "IMG") {
      avatartElement = e.target.parentNode;
    } else {
      return;
    }

    if (avatartElement.style.display === "block") {
      avatartElement.style.display = "none";
    } else {
      avatartElement.style.display = "block";
    }
  }

  onMount(() => {
    socket = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true, // 쿠키를 함께 전송
    });

    player_section = document.getElementById("player");
    chat_section = document.getElementById("chat");
    quiz_section = document.getElementById("quiz");

    socket.on("setPlayer", (data) => {
      setPlayer(data);
    });

    socket.on("chat message", (data) => {
      const newChatElement = document.createElement("div");
      newChatElement.textContent = data;
      chat_section.appendChild(newChatElement);
    });

    socket.on("question", (data) => {
      quiz_section.textContent = data;
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  });
</script>

<button id="player" on:click={handlePlayerClick}></button>
<section id="quiz">quiz</section>
<section id="chat"></section>
<section id="input">
  <form on:submit|preventDefault={handleChatSubmit}>
    <input type="text" name="chat_message" disabled={!data.isLogin} />
    <button disabled={!data.isLogin}>Submit</button>
  </form>
</section>

<style>
  #player {
    border: none;
    outline: none;
    background-color: inherit;
  }
</style>
