import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Define Zod schema for the wishlist creation body
const createWishlistSchema = z.object({
    name: z.string().nonempty("Name is required."),
    description: z.string().max(500).optional(),
    lookingForGifts: z.enum(["BOYS", "GIRLS", "GENDER_NEUTRAL"], {
        required_error: "LookingForGifts is required.",
        invalid_type_error: "Invalid gift type.",
    }),
});

export default defineEventHandler(async (event) => {
    try {
        // Check login status
        const { loggedIn, id: userId } = await checkLoginStatus(event);

        if (!loggedIn) {
            setHeader(event, "HX-Redirect", "/login");
            return;
        }

        // Parse the request body
        const body = await readBody(event);

        // Validate the body using Zod
        const parsedData = createWishlistSchema.safeParse(body);

        if (!parsedData.success) {
            const errors = parsedData.error.flatten().fieldErrors;

            // Get the first error message
            const firstError = Object.values(errors).flat()[0];

            // Return the form with the error message
            const formView = loadView("wishlist-form")({
                errorMessage: firstError,
            });

            return formView;
        }

        // Destructure validated data
        const { name, description, lookingForGifts } = parsedData.data;

        // Create the wishlist in the database
        const newWishlist = await prisma.wishlist.create({
            data: {
                name,
                description: description || null,
                lookingForGifts,
                userId,
            },
        });

        // Fetch the updated wishlists for the user
        const updatedWishlists = await prisma.wishlist.findMany({
            where: { userId },
        });

        // Render the updated wishlist view
        return loadTemplate("wishlists-items")({
            items: updatedWishlists,
        });
    } catch (error) {
        console.error("Error creating wishlist:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to create wishlist.",
        });
    }
});
