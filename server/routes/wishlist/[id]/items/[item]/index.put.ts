import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Define Zod schema for item ID validation
const itemIdSchema = z.object({
    item: z
        .string()
        .nonempty("Item ID is required."),
    id: z
        .string()
        .nonempty("Wishlist ID is required.")
});

// Define Zod schema for item update validation
const itemUpdateSchema = z.object({
    name: z.string().nonempty("Item name is required.").optional(),
    url: z.string().url("Invalid URL format.").optional(),
    image: z.string().url("Invalid image URL format.").optional(),
    description: z.string().optional(),
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

            // Parse and validate the request body
            const body = await readBody(event);
            const updateData = itemUpdateSchema.safeParse(body);

            if (!updateData.success) {
                throw createError({
                    statusCode: 400,
                    message: "Invalid update data.",
                    data: updateData.error.flatten(),
                });
            }

            // Update the item in the database
            const updatedItem = await prisma.item.update({
                where: {
                    id: +itemId, // Convert itemId to number
                },
                data: updateData.data,
            });

            if (!updatedItem) {
                return "Item not found";
            }

            const wishlistsTemplate = loadTemplate("wishlist-items");

            // Fetch all wishlists for the logged-in user
            const items = await prisma.item.findMany({
                where: { wishlistId: wishlistId },
            });

            const wishlist = await prisma.wishlist.findUnique({
                where: { id: wishlistId },
            });

            const isWishlistOwner = wishlist.userId === userId;

            // Return HTMX response with OOB swaps
            return `
             <div id="wishlist-container" hx-swap-oob="true">
                 ${wishlistsTemplate({ items, isWishlistOwner, wishlistId })}
             </div>
             <div id="modalContainer"  class="w-screen h-screen fixed z-[9999] bg-black/50 top-0 left-0 flex items-center justify-center empty:hidden"></div>
             `;
        } catch (error) {
            console.error("Error updating item:", error);
            return {
                success: false,
                message: "Failed to update item.",
                error: error.message,
            };
        }
    },
});
