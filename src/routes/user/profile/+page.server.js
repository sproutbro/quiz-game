import { redirect } from "@sveltejs/kit";
import { decrypt, encrypt } from "$lib/util.js";
import { selectProfile } from "$lib/db/queries.js";

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
  console.log("/user/profile");

  let user_info = event.cookies.get("user_info");
  if (!user_info) return redirect(302, "/auth/login");
  user_info = JSON.parse(decrypt(user_info));

  const dd = await selectProfile(["kakao", "3604409264"]);

  console.log(dd);
  return { user_info };
}
