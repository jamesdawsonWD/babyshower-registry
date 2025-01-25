export default defineEventHandler(async (event) => {
    try {
        const signup = loadView("signup")({});

        const { loggedIn, username } = await checkLoginStatus(event);

        // Render the header with the loggedIn parameter
        const headerHtml = await loadTemplate("header")({
            loggedIn,
            username,
        });

        // Render the layout template with dynamic content
        const fullHtml = await loadTemplate("layout");

        return fullHtml({
            title: "My App",
            header: headerHtml,
            content: signup,
        });
    } catch (error) {
        console.error("Error serving templates:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load templates.",
        });
    }
});
