import { redirect } from "@sveltejs/kit";
import { decrypt, encrypt } from "$lib/util.js";
import { updateAvatar } from "$lib/db/queries.js";

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
  console.log("/avatar");

  let avatar = event.cookies.get("avatar");
  if (!avatar) return redirect(302, "/auth/login");
  avatar = JSON.parse(decrypt(avatar));

  return { avatar };
}

/** @type {import('./$types').Actions} */
export const actions = {
  // 아바타 저장하기
  default: async (event) => {
    console.log("아바타 저장하기");

    const encrypt_user_info = event.cookies.get("user_info");
    const user_info = JSON.parse(decrypt(encrypt_user_info));

    const formData = await event.request.formData();
    const avatar = Object.fromEntries(formData);

    event.cookies.set("avatar", encrypt(JSON.stringify(avatar)), {
      path: "/",
      // 임시
      expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });

    const params = [
      avatar.hair,
      avatar.clothing,
      avatar.accessories,
      avatar.skin,
      user_info.provider,
      user_info.id,
    ];

    return { success: await updateAvatar(params) };
  },
};
