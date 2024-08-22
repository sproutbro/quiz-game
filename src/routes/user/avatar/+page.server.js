import { redirect } from "@sveltejs/kit";
import { decrypt, encrypt } from "$lib/util.js";
import { selectAvatar, updateAvatar } from "$lib/db/queries.js";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  console.log("/user/avatar");

  let token = event.cookies.get("token");
  if (!token) return redirect(302, "/auth/login");
  token = JSON.parse(decrypt(token));
  let access = [token.provider, token.providerId];

  const avatar = await selectAvatar(access);
  return { avatar };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    console.log("아바타 저장하기");

    let token = event.cookies.get("token");
    if (!token) return redirect(302, "/auth/login");
    token = JSON.parse(decrypt(token));

    const formData = await event.request.formData();
    const avatar = Object.fromEntries(formData);

    const params = [
      avatar.hair,
      avatar.clothing,
      avatar.accessories,
      avatar.skin,
      token.provider,
      token.providerId,
    ];

    return { success: await updateAvatar(params) };
  },
};
