import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Define Zod schema for item ID validation
const itemIdSchema = z.object({
    item: z
        .string()
        .nonempty("Item ID is required.")
        .regex(/^[0-9]+$/, "Invalid item ID format."),
    id: z
        .string()
        .nonempty("Wishlist ID is required.")
        .regex(/^[0-9]+$/, "Invalid wishlist ID format."),
});

export default defineEventHandler({
    handler: async (event) => {
        try {
            // Extract and validate the item ID parameter
            const params = itemIdSchema.safeParse(event.context.params);

            if (!params.success) {
                throw createError({
                    statusCode: 400,
                    message: "Invalid parameters.",
                    data: params.error.flatten(),
                });
            }

            const { id: wishlistId, item: itemId } = params.data;

            // Check login status
            const { loggedIn, id: userId } = await checkLoginStatus(event);

            if (!loggedIn) {
                setHeader(event, "HX-Redirect", "/login");
                return;
            }

            // Delete the item from the database
            const deletedItem = await prisma.item.delete({
                where: {
                    id: +itemId, // Convert itemId to number
                },
            });

            if (!deletedItem) {
                return "Item not found";
            }

            // Fetch the wishlist based on the slug
            const wishlist = await prisma.wishlist.findUnique({
                where: { id: +wishlistId },
            });

            const wishlistsTemplate = loadTemplate("wishlist-items");

            const wishlists = await prisma.item.findMany({
                where: { wishlistId: +wishlistId },
            });

            const isWishlistOwner = wishlist.userId === userId;

            return wishlistsTemplate({ items: wishlists, isWishlistOwner });
        } catch (error) {
            console.error("Error deleting item:", error);
            return {
                success: false,
                message: "Failed to delete item.",
                error: error.message,
            };
        }
    },
});
