export default defineEventHandler(async (event) => {
    return loadView("landing-page")({});
});