import * as cheerio from "cheerio";
import axios from "axios";

// Function to fetch OpenGraph metadata (image, description, title)
export async function fetchOGMetadata(
    url: string,
): Promise<
    { name: string | null; description: string | null; image: string | null }
> {
    try {
        const response = await axios.get(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            },
        });

        const $ = cheerio.load(response.data);

        // Fetch OpenGraph image
        let ogImage = $('meta[property="og:image"]').attr("content");
        if (!ogImage) {
            ogImage = $('meta[name="twitter:image"]').attr("content");
        }
        if (ogImage && !ogImage.startsWith("http")) {
            const baseUrl = new URL(url).origin;
            ogImage = new URL(ogImage, baseUrl).toString();
        }

        // Fetch webpage title (instead of OpenGraph title)
        const pageTitle = $("title").text() || null;

        // Fetch OpenGraph description
        const ogDescription =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="description"]').attr("content") || null;

        return {
            name: pageTitle,
            description: ogDescription || null,
            image: ogImage || null,
        };
    } catch (error) {
        console.error("Error fetching OG metadata:", error);
        return {
            name: null,
            description: null,
            image: null,
        };
    }
}
