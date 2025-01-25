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

        return loadView("wishlists")({
            wishlists,
        });
    } catch (error) {
        console.error("Error serving wishlists:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load wishlists.",
        });
    }
});
