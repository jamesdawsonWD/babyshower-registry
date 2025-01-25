import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Define the Zod schema for validation
const addItemBodySchema = z.object({
    name: z.string().nonempty("Name is required."),
    description: z.string().max(500).min(4).nonempty(
        "Description is required.",
    ),
    imageUrl: z.string().optional(),
    url: z.string().url().nonempty("Url is required."),
});

// Define Zod schema for slug validation
const slugSchema = z.object({
    id: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
});

export default defineEventHandler({
    handler: async (event) => {
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

            const { loggedIn, id: userId } = await checkLoginStatus(event);

            if (!loggedIn) {
                setHeader(event, "HX-Redirect", "/login");
                return;
            }

            if (!userId) {
                setHeader(event, "HX-Redirect", "/signup");
                return;
            }

            // Read the request body
            const body = await readBody(event);

            // Validate input with Zod
            const parsedData = addItemBodySchema.safeParse(body);
            if (!parsedData.success) {
                const errors = parsedData.error.flatten().fieldErrors;

                // Get the first error message
                const firstError = Object.values(errors).flat()[0];

                const login = loadView("add-item-modal")({
                    errorMessage: firstError,
                });

                return login;
            }

            const { name, description, url, imageUrl } = parsedData.data;

            // Fetch OG image if no image provided

            // Create the wishlist in the database
            await prisma.item.create({
                data: {
                    name,
                    url,
                    image: imageUrl,
                    description,
                    wishlistId: +id,
                },
            });

            setHeader(event, "HX-Redirect", `/wishlist/${id}`);

            return {
                success: true,
                message: "Wishlist created successfully.",
            };
        } catch (error) {
            console.error("Error creating wishlist:", error);
            return {
                success: false,
                message: "Failed to create wishlist.",
                error: error.message,
            };
        }
    },
});
