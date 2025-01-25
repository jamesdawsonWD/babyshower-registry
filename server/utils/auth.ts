import jwt from "jsonwebtoken";
import { createError, H3Event } from "h3";
import { getUserById } from "./prisma-helpers";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define the decoded token type
interface DecodedToken {
    id: number; // User ID
    providerId: string; // ID from the provider
    iat?: number; // Issued at timestamp
    exp?: number; // Expiration timestamp
}

// Extend the H3Event context type
declare module "h3" {
    interface H3EventContext {
        user?: DecodedToken;
    }
}

export const authenticate = (event: H3Event): void => {
    const authHeader = getHeader(event, "authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError({
            statusCode: 401,
            message: "Unauthorized: Missing or invalid token",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
        event.context.user = decoded; // Attach user data to the event context
    } catch (err) {
        throw createError({
            statusCode: 403,
            message: "Invalid token",
        });
    }
};

/**
 * Verify the JWT token.
 * @param {string} token - The JWT token to verify.
 * @param {string} secret - The secret key to verify the token.
 * @returns {object|null} - Decoded token data or null if invalid.
 */
export function verifyToken(token: string, secret = JWT_SECRET) {
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        console.error("Invalid token:", err.message);
        return null;
    }
}

/**
 * Check the login status of a user.
 * @param {object} event - The event object containing the request.
 * @param {string} secret - The JWT secret key.
 * @returns {Promise<{loggedIn: boolean, username: string|null}>}
 */
export async function checkLoginStatus(event, secret = JWT_SECRET) {
    const cookie = event.req.headers.cookie;
    console.log("cookie", cookie);

    if (!cookie) {
        return {
            loggedIn: false,
            username: null,
        };
    }

    const token = cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

    console.log("Token", token);

    if (!token) {
        return {
            loggedIn: false,
            username: null,
        };
    }

    const decoded = verifyToken(token, secret);

    if (!decoded) {
        return {
            loggedIn: false,
            username: null,
        };
    }

    const user = await getUserById(decoded.id);

    return { loggedIn: true, ...user };
}
