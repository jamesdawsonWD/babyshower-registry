import { defineEventHandler, getCookie } from "h3";
import { loadView } from "~/utils/templates";

export default defineEventHandler((event) => {
    // Simulate user authentication status using a cookie
    const userToken = getCookie(event, "userToken");

    // Load appropriate view
    const view = userToken ? "wishlist-create" : "login";
    const template = loadView(view);

    return template({});
});
