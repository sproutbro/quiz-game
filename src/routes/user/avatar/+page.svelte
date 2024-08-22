<script>
  import { enhance } from "$app/forms";

  /** @type {import('./$types').PageData} */
  export let data;

  /** @type {import('./$types').ActionData} */
  export let form;

  function handleShopClick(e) {
    if (e.target.tagName === "IMG") {
      const urlObj = new URL(e.target.src);
      data.avatar[e.target.alt] = urlObj.pathname;

      console.log(data.avatar);
    }
  }
</script>

<section id="avatar">
  <div class="avatar_container">
    <div class="avatar">
      <img src={data.avatar.skin} alt="skin" />
      <img src={data.avatar.hair} alt="hair" />
      <img src={data.avatar.clothing} alt="clothing" />
      <img src={data.avatar.accessories} alt="accessories" />
    </div>
  </div>
</section>
<section id="shop">
  <button class="shop_button" on:click={handleShopClick}>
    <div class="shop_item">
      <img src="/img/hair01.png" alt="hair" height="100%" />
      <img src="/img/hair02.png" alt="hair" height="100%" />
      <img src="/img/hair03.png" alt="hair" height="100%" />
      <img src="/img/hair04.png" alt="hair" height="100%" />
    </div>
    <div class="shop_item">
      <img src="/img/clothing01.png" alt="clothing" height="100%" />
      <img src="/img/clothing02.png" alt="clothing" height="100%" />
      <img src="/img/clothing03.png" alt="clothing" height="100%" />
    </div>
    <div class="shop_item">
      <img src="/img/accessories01.png" alt="accessories" height="100%" />
      <img src="/img/accessories02.png" alt="accessories" height="100%" />
    </div>
    <div class="shop_item">
      <img src="/img/skin01.png" alt="skin" height="100%" />
      <img src="/img/skin02.png" alt="skin" height="100%" />
      <img src="/img/skin03.png" alt="skin" height="100%" />
    </div>
  </button>
  <form method="POST" use:enhance>
    <input name="skin" type="hidden" value={data.avatar.skin} />
    <input name="hair" type="hidden" value={data.avatar.hair} />
    <input name="clothing" type="hidden" value={data.avatar.clothing} />
    <input name="accessories" type="hidden" value={data.avatar.accessories} />
    <button>저장하기</button>
  </form>
  {#if form?.success}
    <p>Successfully</p>
  {/if}
</section>

<style>
  .shop_button {
    border: none;
    outline: none;
    background-color: inherit;
  }

  .avatar_container {
    border: 1px solid black;
    height: 128px;
    width: 128px;
  }
</style>
