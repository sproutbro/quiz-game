/** @type {import('./$types').LayoutServerLoad} */
export function load(event) {
  return { isLogin: event.cookies.get("token") ? true : false };
}
