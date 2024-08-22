import { selectAvatar, selectProfile } from "$lib/db/queries.js";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  const access = event.params.slug.split("_");
  const avatar = await selectAvatar(access);
  const profile = await selectProfile(access);
  return { avatar, profile };
}
