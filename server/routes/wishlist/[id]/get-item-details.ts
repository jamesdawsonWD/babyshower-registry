import { z } from "zod";
import { fetchOGMetadata } from "~/utils/item-data";

// Define the Zod schema for validation
const getItemDetailsBodySchema = z.object({
    url: z.string().url().nonempty("Url is required."),
});

// Define Zod schema for slug validation
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

    const body = await readBody(event);

    console.log(body);
    const parsedData = getItemDetailsBodySchema.safeParse(body);
    if (!parsedData.success) {
        const errors = parsedData.error.flatten().fieldErrors;

        console.log(errors);
        // Get the first error message
        const firstError = Object.values(errors).flat()[0];

        const login = loadView("get-item-details-modal")({
            errorMessage: firstError,
        });

        return login;
    }

    const { url } = parsedData.data;

    const metadata = await fetchOGMetadata(url);


    const modal = await loadTemplate("modal");

    const addItem = loadView("add-item-modal")({
        id,
        url,
        ...metadata,
    });

    return addItem;
});
