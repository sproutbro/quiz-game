import { redirect } from "@sveltejs/kit";
import { decrypt, encrypt } from "$lib/util.js";
import { updateAvatar } from "$lib/db/queries.js";

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
  if (!event.cookies.get("access_token")) {
    redirect(302, "/auth/login");
  }

  const access_token = JSON.parse(decrypt(event.cookies.get("access_token")));
  return { avatar: access_token.avatar };
}

/** @type {import('./$types').Actions} */
export const actions = {
  default: async (event) => {
    const data = await event.request.formData();
    const avatar = Object.fromEntries(data);

    const access_token = JSON.parse(decrypt(event.cookies.get("access_token")));
    access_token.avatar = avatar;
    event.cookies.set("access_token", encrypt(JSON.stringify(access_token)), {
      path: "/",
      secure: true,
      expires: new Date(access_token.expires),
    });

    const params = [
      avatar.hair,
      avatar.clothing,
      avatar.accessories,
      avatar.skin,
      access_token.provider,
      access_token.user_info.id,
    ];

    console.log("아바타 변경");
    return { success: await updateAvatar(params) };
  },
};
