import { AUTH_KAKAO_ID, AUTH_KAKAO_SECRET } from "$env/static/private";
import { PUBLIC_ORIGIN } from "$env/static/public";

const current_path = "$lib/providers/kakao";

export function authorization() {
  console.log({ current_path }, authorization);

  const url = new URL("https://kauth.kakao.com/oauth/authorize");
  const state = Math.random().toString();
  const params = new URLSearchParams({
    client_id: AUTH_KAKAO_ID,
    redirect_uri: PUBLIC_ORIGIN + "/auth/callback/kakao",
    response_type: "code",
    prompt: "select_accoun",
    state,
  });
  url.search = params;
  return { url: url.href, state };
}

export async function callback(code) {
  console.log({ current_path }, callback);

  const url = "https://kauth.kakao.com/oauth/token";
  const option = {
    method: "POST",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: AUTH_KAKAO_ID,
      client_secret: AUTH_KAKAO_SECRET,
      redirect_uri: `${PUBLIC_ORIGIN}/auth/callback/kakao`,
      code,
    }),
  };

  try {
    const response = await fetch(url, option);
    const token = await response.json();
    console.log({ return: { token: !!token } });
    return token;
  } catch (error) {
    console.error(error);
  }
}

export async function userInfo(access_token) {
  console.log({ current_path }, userInfo);

  const url = "https://kapi.kakao.com/v2/user/me";
  const option = {
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token}`,
    },
  };

  try {
    const response = await fetch(url, option);
    const user_info = await response.json();
    console.log({ return: { user_info: !!user_info } });
    return user_info;
  } catch (error) {
    console.error(error);
  }
}
