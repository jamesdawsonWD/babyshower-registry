export default defineEventHandler(async (event) => {
    const header = loadTemplate("header");

    return header({});
});
