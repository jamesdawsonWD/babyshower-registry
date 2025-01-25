import { z } from "zod";

const slugSchema = z.object({
    id: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
});

export default defineEventHandler(async (event) => {
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

    const modal = await loadTemplate("modal");

    const addItem = loadView("add-item-modal")({
        id,
    });

    return modal({
        title: "Add item",
        content: addItem,
    });
});
