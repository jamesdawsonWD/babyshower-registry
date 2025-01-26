// In-memory store for selected items
export const selectedItems: Record<number, boolean> = {};

export default defineEventHandler(async (event) => {
    const body = await readBody(event); // Parse the POST body
    const productId = body.id;

    if (typeof productId !== "string") {
        return {
            success: false,
            message: "Invalid product ID",
        };
    }

    // Mark the item as selected
    selectedItems[productId] = true;

    return '<div id="modal-container"></div>';
});
