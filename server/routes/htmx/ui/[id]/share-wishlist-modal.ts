import { z } from "zod";

const slugSchema = z.object({
    id: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
});

export default defineEventHandler(async (event) => {
    const params = slugSchema.safeParse(event.context.params);

    if (!params.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid parameters.",
            data: params.error.flatten(),
        });
    }

    const { id } = params.data;

    const modal = await loadTemplate("modal");

    // Get the domain from the request headers
    const domain = event.node.req.headers.host;

    // Construct the full wishlist link
    const wishlistLink = `https://${domain}/wishlist/${id}`;
    const addItem = loadView("share-wishlist-modal")({
        id,
        wishlistLink,
    });

    return modal({
        title: "Share wishlist",
        content: addItem,
    });
});
