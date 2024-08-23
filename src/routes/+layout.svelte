<script>
  /** @type {import('./$types').PageData} */
  export let data;

  let overlay_element;
  let nav_sub_element;

  import HamburgerIcon from "$lib/component/HamburgerIcon.svelte";
  import { hamburgerActive } from "$lib/store.js";
  import { onMount } from "svelte";

  onMount(() => {
    overlay_element.addEventListener("click", toggleHamburger);
    nav_sub_element.addEventListener("click", toggleHamburger);
  });

  function toggleHamburger() {
    hamburgerActive.update((value) => !value);
  }
</script>

<header class="header">
  <div class="nav_container">
    <nav class="nav_main">
      <ul>
        <li><a href="/">처음</a></li>
        <li><a href="/resume">이력서</a></li>
        {#if data.isLogin}
          <li>
            <HamburgerIcon />
          </li>
        {:else}
          <li><a href="/auth/login">로그인</a></li>
        {/if}
      </ul>
    </nav>
    <div
      class="overlay"
      class:active={$hamburgerActive}
      bind:this={overlay_element}
    ></div>
    <nav
      class="nav_sub"
      class:active={$hamburgerActive}
      bind:this={nav_sub_element}
    >
      <ul>
        <li><a href="/user/avatar">아바타</a></li>
        <li><a href="/user/edit">내정보</a></li>
        <li><a href="/auth/logout">로그아웃</a></li>
      </ul>
    </nav>
  </div>
</header>
<main>
  <slot {data} />
</main>

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(55, 55, 55, 0.4);
    width: 100vw;
    height: 100vh;
    display: none;
  }

  .header {
    background-color: #333;
    height: 41px;
  }

  .nav_container {
    max-width: 800px;
    margin: auto;
    position: relative;
  }

  .nav_main ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav_main a {
    color: white; /* 링크 텍스트 색상 */
    font-size: 16px; /* 텍스트 크기 */
    display: block; /* 링크를 블록으로 만들어 클릭 영역 확대 */
    padding: 10px 15px; /* 패딩 추가 */
  }

  .nav_main a:hover {
    background-color: #555; /* 호버 시 배경 색상 변경 */
  }

  .nav_sub {
    background-color: beige;
    border: 1px solid black;
    position: absolute;
    right: 0;
    display: none;
  }

  .nav_sub a {
    display: block;
    padding: 10px 20px;
  }

  .nav_sub a:hover {
    background-color: #555; /* 호버 시 배경 색상 변경 */
  }

  main {
    height: calc(100vh - 36px);
    /* header 36px */
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    margin: auto;
  }

  .active {
    display: block;
  }
</style>
