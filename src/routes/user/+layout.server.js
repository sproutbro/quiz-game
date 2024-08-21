import { redirect } from "@sveltejs/kit";

/** @type {import('./$types').LayoutServerLoad} */
export async function load(event) {
  if (!event.cookies.get("token")) {
    return redirect(302, "/auth/login");
  }
}
