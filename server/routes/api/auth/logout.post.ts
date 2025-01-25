export default defineEventHandler(async (event) => {
    try {
        // Clear the auth token cookie by setting it with an expired date
        setHeader(
            event,
            "Set-Cookie",
            `auth_token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
        );

        // Add HX-Redirect header to reload the / route
        setHeader(event, "HX-Redirect", "/");

        return {
            success: true,
            message: "Logout successful.",
        };
    } catch (error) {
        console.error("Error during logout:", error);
        return {
            success: false,
            message: "Logout failed.",
            error: error.message,
        };
    }
});
