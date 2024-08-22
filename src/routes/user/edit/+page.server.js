import { redirect } from "@sveltejs/kit";
import { decrypt } from "$lib/util.js";
import { selectProfile, updateProfile } from "$lib/db/queries.js";
import { redirect } from "@sveltejs/kit";

const current_path = "/user/edit";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  console.log({ current_path });

  let token = event.cookies.get("token");
  if (!token) return redirect(302, "/auth/login");
  token = JSON.parse(decrypt(token));

  const profile = await selectProfile([token.provider, token.providerId]);
  return { profile };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    console.log({ current_path, method: "post" });

    let token = event.cookies.get("token");
    if (!token) return redirect(302, "/auth/login");
    token = JSON.parse(decrypt(token));

    const formData = await event.request.formData();
    let profile = Object.fromEntries(formData);

    const params = [profile.nickname, token.provider, token.providerId];
    profile = await updateProfile(params);
    console.log({ profile });
    return redirect(302, "/auth/login");
  },
};
