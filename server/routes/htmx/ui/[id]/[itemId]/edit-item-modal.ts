import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const slugSchema = z.object({
    id: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
    itemId: z
        .string()
        .nonempty("Slug is required.")
        .regex(/^[a-zA-Z0-9_-]+$/, "Invalid slug format."),
});

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    const params = slugSchema.safeParse(event.context.params);

    if (!params.success) {
        throw createError({
            statusCode: 400,
            message: "Invalid parameters.",
            data: params.error.flatten(),
        });
    }

    const { id, itemId } = params.data;

    const modal = await loadTemplate("modal");

    const item = await prisma.item.findUnique({
        where: { id: +itemId }, // Use the item ID to find the unique item
        select: {
            name: true,
            description: true,
            url: true,
            image: true,
        },
    });

    const editItem = loadView("edit-item-modal")({
        id,
        itemId,
        ...item,
    });

    return modal({
        title: "Edit item details",
        content: editItem,
    });
});
