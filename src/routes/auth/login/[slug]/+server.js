import kakao from "$lib/providers/kakao.js";
import { redirect } from "@sveltejs/kit";
import { DOMAIN } from "$env/static/private";

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
  console.log(event.params.slug);
  if (event.params.slug === "kakao") {
    const { url, state } = kakao.authorization();
    event.cookies.set("state", state, {
      domain: DOMAIN,
      path: "/",
    });
    return redirect(302, url);
  }

  return new Response();
}
