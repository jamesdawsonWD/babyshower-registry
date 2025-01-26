import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
import { z } from "zod";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// Function to generate a 6-digit verification code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

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
        const verificationCode = generateVerificationCode();

        // Create the new user
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: username,
                verificationCode,
                isVerified: false, // User is not verified yet
            },
        });

        // Send the magic link via email
        const response = await resend.emails.send({
            from: "hello@jamesdawson.dev", // Replace with your sender address
            to: email,
            subject: "Complete Your Signup",
            html: `<p>Welcome! Here is your verification code:</p>
             <h1>${verificationCode}</h1>`,
        });

        if (response.error) {
            console.log(response.error);
        }

        const verifyPinView = loadView("verify-pin")({
            pinLength: 6,
        });

        return verifyPinView;
    } catch (error) {
        console.error("Error during signup:", error);
        return {
            success: false,
            message: "Signup failed.",
            error: error.message,
        };
    }
});
