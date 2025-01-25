export default defineEventHandler((event) => {
    const req = event.node.req;
    const res = event.node.res;

    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Frontend origin
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS",
    ); // Allow methods
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, HX-Request, HX-Trigger, HX-Trigger-Name, HX-Target, HX-Current-URL", // Add missing header
    );
    res.setHeader(
        "Access-Control-Expose-Headers",
        "HX-Push, HX-Redirect, HX-Refresh",
    ); // Expose HTMX response headers

    // Handle OPTIONS requests (preflight)
    if (req.method === "OPTIONS") {
        res.statusCode = 204; // No Content
        res.end(); // End the response
        return;
    }
});
