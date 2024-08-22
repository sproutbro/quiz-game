import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
  console.log("/auth/logout/");

  event.cookies.delete("token", { path: "/" });

  return redirect(302, "/");
}
