/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
  return { isLogin: event.cookies.get("access_token") ? true : false };
}
