import { defineEventHandler, send } from "h3";
import { resolve } from "path";
import { promises as fs } from "fs";

export default defineEventHandler(async (event) => {
    const url = event.node.req.url || "/";
    console.log("Incoming request:", { method: event.node.req.method, url });

    // Handle `.js` files explicitly
    if (url.endsWith(".js")) {
        console.log(`JavaScript file requested: ${url}`);

        const jsFilePath = resolve("public" + url); // Resolve file path based on the public directory
        try {
            const jsContent = await fs.readFile(jsFilePath, "utf-8"); // Read the JavaScript file content
            console.log("Serving JavaScript file:", jsFilePath);

            // Set the Content-Type header explicitly for JavaScript
            event.node.res.setHeader("Content-Type", "application/javascript");
            return jsContent;
        } catch (error) {
            console.error("Error reading JavaScript file:", error);

            // Return 404 if the file cannot be found
            event.node.res.statusCode = 404;
            return "404 Not Found: JavaScript file not found.";
        }
    }

    // Handle `.css` files explicitly
    if (url.endsWith(".css")) {
        console.log(`CSS file requested: ${url}`);

        const cssFilePath = resolve("public" + url); // Resolve file path based on the public directory
        try {
            const cssContent = await fs.readFile(cssFilePath, "utf-8"); // Read the CSS file content
            console.log("Serving CSS file:", cssFilePath);

            // Set the Content-Type header explicitly for CSS
            event.node.res.setHeader("Content-Type", "text/css");
            return cssContent;
        } catch (error) {
            console.error("Error reading CSS file:", error);

            // Return 404 if the file cannot be found
            event.node.res.statusCode = 404;
            return "404 Not Found: CSS file not found.";
        }
    }

    // Skip other static asset requests
    const isStaticAsset = url.match(
        /\.(svg|png|jpg|jpeg|gif|ico|woff|woff2|ttf|eot|otf|json|txt|map)$/i,
    );
    if (isStaticAsset) {
        console.log(`Static asset request for: ${url}. Let Nitro handle it.`);
        return; // Do not handle these assets here
    }

    // Serve `index.html` for all other requests
    const indexPath = resolve("public/index.html");
    console.log("Resolved index.html path:", indexPath);

    try {
        const htmlContent = await fs.readFile(indexPath, "utf-8");
        console.log(
            "index.html file exists. Sending its content as the response.",
        );

        // Set the Content-Type header to HTML
        event.node.res.setHeader("Content-Type", "text/html");

        return htmlContent;
    } catch (error) {
        console.error("Error reading index.html file:", error);

        // Return 404 if `index.html` is not found
        event.node.res.statusCode = 404;
        return "404 Not Found: index.html not found on the server.";
    }
});
