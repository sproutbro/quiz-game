import providers from "$lib/providers";
import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
  if (event.params.slug === "kakao") {
    const { url, state } = providers[event.params.slug].authorization();
    event.cookies.set("state", state, {
      path: "/",
    });
    return redirect(302, url);
  }
}
