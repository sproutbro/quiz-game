<script>
  /** @type {import('./$types').PageData} */
  export let data;
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
<section id="profile"></section>
<section id="score"></section>

<style>
  .avatar_container {
    border: 1px solid black;
    height: 128px;
    width: 128px;
  }
</style>
