import { checkLoginStatus } from "~/utils/auth";
import { products, renderWishlist } from "./htmx/wishlists";
import { selectedItems } from "./htmx/wishlists/select";

export default defineEventHandler(async (event) => {
    try {
        const { loggedIn, username, id } = await checkLoginStatus(event);

        // Render the header with the loggedIn parameter
        const headerHtml = await loadTemplate("header")({
            loggedIn,
            username,
        });

        const createWishlist = loadView("wishlist-create")({});

        // Render the layout template with dynamic content
        const fullHtml = await loadTemplate("layout");

        return fullHtml({
            title: "My App",
            content: createWishlist,
            header: headerHtml,
        });
    } catch (error) {
        console.error("Error serving templates:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load templates.",
        });
    }
});
