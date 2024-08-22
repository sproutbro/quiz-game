<script>
  import { enhance } from "$app/forms";

  /** @type {import('./$types').PageData} */
  export let data;
</script>

<section id="profile">
  <form method="post" use:enhance>
    <div>
      <label for="nickname">닉네임</label>
      <input
        type="text"
        name="nickname"
        id="nickname"
        value={data.profile.nickname}
      />
    </div>
    <button>저장</button>
  </form>
</section>
