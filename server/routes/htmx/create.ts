export default defineEventHandler(async (event) => {
    const modal = await loadTemplate("modal");

    const wishlistCreateForm = loadTemplate("create-wishlist-form")({});

    return modal({
        title: "Create Wishlist",
        content: wishlistCreateForm,
    });
});
