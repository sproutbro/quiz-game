import providers from "$lib/providers";
import { redirect } from "@sveltejs/kit";
import { encrypt, decrypt } from "$lib/util.js";
import { selectFromAccount, selectFromAvatar } from "$lib/db/queries.js";

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  console.log("/auth/callback/", event.params.slug);

  // state 코드 비교 쿠키에서 삭제
  compareState(event);

  // token 가져오기
  const token = await getToken(event);

  // user_info 가져오기
  const user_info = await getUserInfo(token);

  // 아바타 가져오기
  const avatar = await getAvatar(user_info);

  // 쿠키 저장하기
  saveCookies(event, { token, user_info, avatar });

  return redirect(302, "/");
}

// state 코드 비교 쿠키에서 삭제
function compareState(event) {
  const state = event.url.searchParams.get("state");
  const cookie_state = event.cookies.get("state");
  event.cookies.delete("state", {
    path: "/",
  });

  console.log("state 코드 비교 쿠키에서 삭제 : ", state, cookie_state);
  if (state !== cookie_state) return redirect(302, "/auth/login");
}

// token 가져오기
async function getToken(event) {
  console.log("token 가져오기 : ", event.params.slug);
  try {
    const code = event.url.searchParams.get("code");
    const token = await providers[event.params.slug].callback(code);
    token.provider = event.params.slug;

    return token;
  } catch (error) {
    console.error(error);
  }
}

// user_info 가져오기
async function getUserInfo(token) {
  console.log("user_info 가져오기");
  try {
    const user_info = await providers[token.provider].userInfo(
      token.access_token
    );
    user_info.provider = token.provider;
    // 신규 플레이어 확인
    const { nickname } = await checkNewPlayer(user_info);
    user_info.nickname = nickname;
    return user_info;
  } catch (error) {
    console.error(error);
  }
}

// 신규 플레이어 확인
async function checkNewPlayer(user_info) {
  const provider = user_info.provider;
  const providerId = user_info.id;
  const nickname = user_info.properties.nickname;

  console.log("신규 플레이어 확인 :", provider, providerId, nickname);

  try {
    return await selectFromAccount(provider, providerId, nickname);
  } catch (error) {
    console.error(error);
  }
}

// 아바타 가져오기
async function getAvatar(user_info) {
  const provider = user_info.provider;
  const providerId = user_info.id;

  console.log("아바타 가져오기 :", provider, providerId);

  try {
    const avatar = await selectFromAvatar(provider, providerId);
    return avatar;
  } catch (error) {
    console.error(error);
  }
}

// 쿠키저장하기
function saveCookies(event, cookies) {
  console.log("쿠키저장하기 :", Object.keys(cookies));

  // 쿠키옵션
  const expirationDays = 60;
  const expirationTime = expirationDays * 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + expirationTime);

  const cookie_option = {
    path: "/",
    expires,
  };

  // 쿠키암호화
  for (let key in cookies) {
    const encrypt_cookie = encrypt(JSON.stringify(cookies[key]));
    event.cookies.set(key, "encrypt_cookie", cookie_option);
  }
}
