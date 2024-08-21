import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export function GET(event) {
  console.log("/auth/logout/");

  event.cookies.delete("avatar", { path: "/" });
  event.cookies.delete("token", { path: "/" });
  event.cookies.delete("user_info", { path: "/" });

  return redirect(302, "/");
}
