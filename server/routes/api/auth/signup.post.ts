import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import { z } from "zod";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with a secure key in production
const MAGIC_LINK_URL = process.env.MAGIC_LINK_URL ||
    "https://your-app.com/auth/magic";

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);

        // Validate the request body using Zod
        const userSchema = z.object({
            email: z.string().email("Invalid email format."),
            username: z.string().min(4),
            password: z.string().min(
                8,
                "Password must be at least 8 characters long.",
            ),
        });

        const parsedBody = userSchema.safeParse(body);

        if (!parsedBody.success) {
            const errors = parsedBody.error.flatten().fieldErrors;

            // Get the first error message
            const firstError = Object.values(errors).flat()[0];

            const login = loadView("signup")({
                errorMessage: firstError,
            });

            return login;
        }

        const { email, password, username } = parsedBody.data;

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                success: false,
                message: "User already exists. Please log in instead.",
            };
        }

        // Hash the password (even if unused in magic link, for future-proofing)
        const argon2 = await import("argon2");
        const hashedPassword = await argon2.hash(password);

        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: username,
            },
        });

        // Generate a JWT token for the magic link
        const token = jwt.sign(
            { email: newUser.email, id: newUser.id },
            JWT_SECRET,
            { expiresIn: "15m" }, // Token expires in 15 minutes
        );

        // Construct the magic link
        const magicLink = `${MAGIC_LINK_URL}?token=${token}`;

        // Send the magic link via email
        await resend.emails.send({
            from: "hello@jamesdawson.build", // Replace with your sender address
            to: email,
            subject: "Complete Your Signup",
            html:
                `<p>Welcome! Click the link below to verify your email and complete your signup:</p>
             <p><a href="${magicLink}">Complete Signup</a></p>
             <p>If you didn't sign up, you can ignore this email.</p>`,
        });

        const cookieOptions = [
            `HttpOnly`, // Prevent JavaScript access to the cookie
            `Path=/`, // Make it available site-wide
            `Secure`, // Use HTTPS in production
            `SameSite=Strict`, // Prevent cross-site request forgery (CSRF)
            `Max-Age=3600`, // Expire after 1 hour
          ].join("; ");
      

        // Add the cookie to the response headers
        setHeader(event, "Set-Cookie", `auth_token=${token}; ${cookieOptions}`);
        setHeader(event, "HX-Redirect", "/");

        return {
            success: true,
            message:
                "Signup successful. Please check your email to complete the process.",
        };
    } catch (error) {
        console.error("Error during signup:", error);
        return {
            success: false,
            message: "Signup failed.",
            error: error.message,
        };
    }
});
