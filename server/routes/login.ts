import jwt from "jsonwebtoken";

import { checkLoginStatus } from "~/utils/auth";

export default defineEventHandler(async (event) => {
    try {
        const { loggedIn, username } = await checkLoginStatus(event);

        // Render the header with the loggedIn parameter
        const headerHtml = await loadTemplate("header")({
            loggedIn,
            username,
        });

        const login = loadView("login")({});

        // Render the layout template with dynamic content
        const fullHtml = await loadTemplate("layout");

        return fullHtml({
            title: "My App",
            header: headerHtml,
            content: login,
        });

    } catch (error) {
        console.error("Error serving templates:", error);
        throw createError({
            statusCode: 500,
            message: "Failed to load templates.",
        });
    }
});
