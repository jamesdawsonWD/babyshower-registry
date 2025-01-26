import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { checkLoginStatus } from "~/utils/auth";

const prisma = new PrismaClient();

// Define Zod schema for slug validation
const slugSchema = z.object({
    id: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
});

export default defineEventHandler(async (event) => {
    try {
        // Extract and validate the slug parameter
        const params = slugSchema.safeParse(event.context.params);

        if (!params.success) {
            throw createError({
                statusCode: 400,
                message: "Invalid parameters.",
                data: params.error.flatten(),
            });
        }

        const { id } = params.data;

        // Check the user's login status
        const { loggedIn, username, id: userId } = await checkLoginStatus(
            event,
        );

        // Fetch the wishlist based on the slug
        const wishlist = await prisma.wishlist.findUnique({
            where: { id: id },
            include: { items: true }, // Include related items
        });

        if (!wishlist) {
            throw createError({
                statusCode: 404,
                message: "Wishlist not found.",
            });
        }

        wishlist.items.sort((a, b) => {
            // Items with giftedById as null come first
            if (a.giftedById === null && b.giftedById !== null) return -1;
            if (a.giftedById !== null && b.giftedById === null) return 1;
            return 0; // Keep the order for other cases
        });

        const isWishlistOwner = wishlist.userId === userId;
        // Render the wishlist view
        return loadView("wishlist")({
            wishlist,
            isWishlistOwner,
            userId,
        });
    } catch (error) {
        console.error("Error serving wishlist:", error);
        throw createError({
            statusCode: error.statusCode || 500,
            message: error.message || "An unexpected error occurred.",
        });
    }
});
