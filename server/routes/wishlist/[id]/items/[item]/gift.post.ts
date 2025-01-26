import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const itemIdSchema = z.object({
    item: z
        .string()
        .nonempty("Item ID is required."),
    id: z
        .string()
        .nonempty("Wishlist ID is required."),
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

            const { item: itemId, id: wishlistId } = params.data;

            // Check login status and get the authenticated user
            const { loggedIn, id: userId } = await checkLoginStatus(event);

            if (!loggedIn || !userId) {
                // Store the original URL in a cookie
                const redirectUrl = `/wishlist/${wishlistId}`;
                setHeader(
                    event,
                    "Set-Cookie",
                    `redirect=${
                        encodeURIComponent(
                            redirectUrl,
                        )
                    }; Path=/; HttpOnly; Secure`,
                );

                // Redirect to login page
                setHeader(event, "HX-Redirect", "/login");
                return;
            }
            // Fetch the item from the database
            const item = await prisma.item.findUnique({
                where: {
                    id: +itemId, // Convert itemId to number
                },
            });

            if (!item) {
                throw createError({
                    statusCode: 404,
                    message: "Item not found.",
                });
            }

            // If the item is already gifted, only the user who gifted it can remove themselves
            if (item.giftedById !== null && item.giftedById !== userId) {
                throw createError({
                    statusCode: 403,
                    message: "You are not authorized to modify this item.",
                });
            }
            const giftedById = item.giftedById === userId ? null : userId;

            // Update the item in the database
            const updatedItem = await prisma.item.update({
                where: {
                    id: +itemId,
                },
                data: {
                    giftedById,
                },
            });

            // Fetch the wishlist based on the slug
            const wishlist = await prisma.wishlist.findUnique({
                where: { id: wishlistId },
            });

            const wishlistsTemplate = loadTemplate("wishlist-items");

            const wishlists = await prisma.item.findMany({
                where: { wishlistId: wishlistId },
            });

            const isWishlistOwner = wishlist.userId === userId;

            return wishlistsTemplate({
                items: wishlists,
                isWishlistOwner,
                userId,
            });
        } catch (error) {
            console.error("Error updating gifted status:", error);
            return {
                success: false,
                message: "Failed to update gifted status.",
                error: error.message,
            };
        }
    },
});
