import providers from "$lib/providers";
import { redirect } from "@sveltejs/kit";
import { encrypt } from "$lib/util.js";
import {
  selectAccount,
  insertAccount,
  selectProfile,
  insertProfile,
  selectAvatar,
  insertAvatar,
  selectScore,
  insertScore,
} from "$lib/db/queries.js";

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  compareState(event);

  const provider = event.params.slug;

  const code = event.url.searchParams.get("code");

  const token = await providers[provider].callback(code);
  const user_info = await providers[provider].userInfo(token.access_token);

  const access = [provider, user_info.id];

  let account = await selectAccount(access);
  if (!account) {
    await insertAccount(access);
  }

  let profile = await selectProfile(access);
  if (!profile) {
    await insertProfile([...access, user_info.properties.nickname]);
  }

  let avatar = await selectAvatar(access);
  if (!avatar) {
    await insertAvatar(access);
  }

  let score = await selectScore(access);
  if (!score) {
    await insertScore(access);
  }

  token.provider = provider;
  token.providerId = user_info.id;
  token.expires = createExpires();

  const encrypt_token = encrypt(JSON.stringify(token));
  event.cookies.set("token", encrypt_token, {
    path: "/",
    expires: token.expires,
  });

  return redirect(302, "/");
}

// 쿠키 state와 URL state비교 값이 다를경우 로그인페이지로리턴
function compareState(event) {
  console.log("/auth/callback", compareState);

  const state = event.url.searchParams.get("state");
  const cookie_state = event.cookies.get("state");
  event.cookies.delete("state", {
    path: "/",
  });

  console.log({ state });
  console.log({ cookie_state });
  if (state !== cookie_state) return redirect(302, "/auth/login");
}

// 만료일 만들기
function createExpires() {
  const expirationDays = 60;
  const expirationTime = expirationDays * 24 * 60 * 60 * 1000;
  return new Date(Date.now() + expirationTime);
}
