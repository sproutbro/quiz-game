import kakao from "$lib/providers/kakao.js";
import { redirect } from "@sveltejs/kit";
import { encrypt, decrypt } from "$lib/util.js";
import { getPlayerById, getAvatarById } from "$lib/db/queries.js";

/** @type {import('./$types').RequestHandler} */
export async function GET(event) {
  // state 코드 비교 쿠키에서 삭제
  const validState = compareState(event);
  if (!validState) return redirect(302, "/auth/login");

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
    access_token.expires = new Date(
      new Date().getTime() + 60 * 24 * 60 * 60 * 1000
    );

    event.cookies.set("access_token", encrypt(JSON.stringify(access_token)), {
      path: "/",
      secure: true,
      expires: access_token.expires,
    });
  }

  return redirect(302, "/");
}

// state 코드 비교 쿠키에서 삭제
function compareState(event) {
  const state = event.url.searchParams.get("state");
  const cookie_state = event.cookies.get("state");
  event.cookies.delete("state", { path: "/" });

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
    const player = await getPlayerById(provider, providerId, nickname);
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
    const avatar = await getAvatarById(provider, providerId);
    console.log("아바타 가져오기 :", avatar);
    return avatar;
  } catch (error) {
    console.error(error);
  }
}
