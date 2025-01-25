import { PrismaClient } from "@prisma/client";
import { checkLoginStatus } from "~/utils/auth";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    try {
        // Check login status and get the user's ID
        const { loggedIn, username, id: userId } = await checkLoginStatus(
            event,
        );

        if (!loggedIn) {
            // Redirect to login page if not logged in
            setHeader(event, "HX-Redirect", "/login");
            return;
        }

        // Fetch all wishlists for the logged-in user
        const wishlists = await prisma.wishlist.findMany({
            where: { userId },
        });

        // Render the header with logged-in user details
        const headerHtml = await loadTemplate("header")({
            loggedIn,
            username,
        });

        // Render the wishlists view with the user's wishlists
        const wishlistsHtml = loadView("wishlists")({
            wishlists,
        });

        // Render the full layout
        const fullHtml = await loadTemplate("layout");

        return fullHtml({
            title: "Your Wishlists",
            content: wishlistsHtml,
            header: headerHtml,
        });
    } catch (error) {
        console.error("Error serving wishlists:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load wishlists.",
        });
    }
});
