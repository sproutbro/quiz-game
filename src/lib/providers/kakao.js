import { AUTH_KAKAO_ID, AUTH_KAKAO_SECRET } from "$env/static/private";
import { PUBLIC_ORIGIN } from "$env/static/public";

const kakao = {
  authorization: function () {
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
  },
  callback: async function (code) {
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
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
  userInfo: async function (access_token) {
    const url = "https://kapi.kakao.com/v2/user/me";
    const option = {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${access_token}`,
      },
    };

    try {
      const response = await fetch(url, option);
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  },
};

export default kakao;
