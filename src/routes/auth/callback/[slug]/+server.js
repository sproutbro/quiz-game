import kakao from "$lib/providers/kakao.js";
import { redirect } from "@sveltejs/kit";
import { encrypt, decrypt } from "$lib/util.js";
import { selectFromAccount, selectFromAvatar } from "$lib/db/queries.js";
import { DOMAIN, IS_DEV } from "$env/static/private";

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  // state 코드 비교 쿠키에서 삭제
  const validState = compareState(event);

  console.log("validState", validState);
  if (!validState) return redirect(302, "/auth/login");

  console.log("access_token 생성");
  // access_token 생성
  let access_token = {};
  if (event.params.slug === "kakao") {
    const code = event.url.searchParams.get("code");
    access_token = await kakao.callback(code);
    access_token.user_info = await kakao.userInfo(access_token.access_token);
    access_token.provider = "kakao";

    // 신규 플레이어 확인
    access_token.nickname = await checkNewPlayer(access_token);

    // 아바타 가져오기
    access_token.avatar = await getAvatar(access_token);

    // 쿠키 만료일 설정
    const expirationDays = 60;
    const expirationTime = expirationDays * 24 * 60 * 60 * 1000;
    access_token.expires = new Date(Date.now() + expirationTime);

    console.log(access_token.expires);

    event.cookies.set("access_token", encrypt(JSON.stringify(access_token)), {
      path: "/",
      secure: !IS_DEV,
      expires: access_token.expires,
    });
  }

  return redirect(302, "/");
}

// state 코드 비교 쿠키에서 삭제
function compareState(event) {
  const state = event.url.searchParams.get("state");
  const cookie_state = event.cookies.get("state");
  event.cookies.delete("state", {
    domain: DOMAIN,
    path: "/",
  });

  console.log(state, event.cookies.get("state"), DOMAIN);

  const validState = state === cookie_state;
  console.log("state 코드 비교 : ", validState);
  return validState;
}

// 플레이어 닉네임 확인
async function checkNewPlayer(access_token) {
  const provider = access_token.provider;
  const providerId = access_token.user_info.id;
  const nickname = access_token.user_info.properties.nickname;

  try {
    const player = await selectFromAccount(provider, providerId, nickname);
    console.log("플레이어 닉네임 :", player.nickname);
    return player.nickname;
  } catch (error) {
    console.error(error);
  }
}

// 아바타 가져오기
async function getAvatar(access_token) {
  const provider = access_token.provider;
  const providerId = access_token.user_info.id;

  try {
    const avatar = await selectFromAvatar(provider, providerId);
    console.log("아바타 가져오기 :", avatar);
    return avatar;
  } catch (error) {
    console.error(error);
  }
}
