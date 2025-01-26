import { defineEventHandler, send } from "h3";
import { resolve } from "path";
import { promises as fs } from "fs";

export default defineEventHandler(async (event) => {
    const url = event.node.req.url || "/";

    // Handle `.js` files explicitly
    if (url.endsWith(".js")) {
        const jsFilePath = resolve("public" + url);
        try {
            const jsContent = await fs.readFile(jsFilePath, "utf-8");
            event.node.res.setHeader("Content-Type", "application/javascript");
            return jsContent;
        } catch (error) {
            event.node.res.statusCode = 404;
            return "404 Not Found: JavaScript file not found.";
        }
    }

    // Handle `.css` files explicitly
    if (url.endsWith(".css")) {
        const cssFilePath = resolve("public" + url);
        try {
            const cssContent = await fs.readFile(cssFilePath, "utf-8");
            event.node.res.setHeader("Content-Type", "text/css");
            return cssContent;
        } catch (error) {
            event.node.res.statusCode = 404;
            return "404 Not Found: CSS file not found.";
        }
    }

    // Handle `.ttf` font files explicitly
    if (url.endsWith(".ttf")) {
        const ttfFilePath = resolve("public" + url);
        try {
            const ttfContent = await fs.readFile(ttfFilePath);
            event.node.res.setHeader("Content-Type", "font/ttf");
            return send(event, ttfContent);
        } catch (error) {
            event.node.res.statusCode = 404;
            return "404 Not Found: TTF file not found.";
        }
    }

    // Handle `.jpg` and `.jpeg` files explicitly
    if (url.endsWith(".jpg") || url.endsWith(".jpeg")) {
        const jpgFilePath = resolve("public" + url); // Resolve file path for `.jpg` or `.jpeg`
        try {
            const jpgContent = await fs.readFile(jpgFilePath);
            event.node.res.setHeader("Content-Type", "image/jpeg"); // Set correct MIME type
            return send(event, jpgContent); // Send the image to the client
        } catch (error) {
            console.error("Error reading JPG file:", error);
            event.node.res.statusCode = 404;
            return "404 Not Found: JPG file not found.";
        }
    }

    // Handle static assets (e.g., other files) by letting Nitro handle them
    const isStaticAsset = url.match(
        /\.(svg|png|gif|ico|woff|woff2|eot|otf|json|txt|map)$/i,
    );
    if (isStaticAsset) {
        console.log(`Static asset request for: ${url}. Let Nitro handle it.`);
        return undefined;
    }

    // Serve `index.html` for all other requests (default behavior)
    const indexPath = resolve("public/index.html");
    try {
        const htmlContent = await fs.readFile(indexPath, "utf-8");
        event.node.res.setHeader("Content-Type", "text/html");
        return htmlContent;
    } catch (error) {
        console.error("Error reading index.html file:", error);
        event.node.res.statusCode = 404;
        return "404 Not Found: index.html not found on the server.";
    }
});
