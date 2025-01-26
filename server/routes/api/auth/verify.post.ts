import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { generateAuthCookie } from "~/utils/auth";
const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
    try {
        console.log("VERIFY PINK");
        const body = await readBody(event);

        // Normalize the input
        const normalizedBody = {
            pin: body["pin[]"] || [], // Map `pin[]` to `pin`
        };

        console.log(normalizedBody);

        // Validate the request body using Zod
        const pinSchema = z.object({
            pin: z.array(
                z.string().length(
                    1,
                    "Each PIN digit must be exactly 1 character.",
                ),
            ).length(6, "PIN must be exactly 6 digits."),
        });

        const parsedBody = pinSchema.safeParse(normalizedBody);

        if (!parsedBody.success) {
            const errors = parsedBody.error.flatten().fieldErrors;

            console.log(errors);
            // Get the first error message
            const firstError = Object.values(errors).flat()[0];

            const verifyPinView = loadView("verify-pin")({
                errorMessage: firstError,
                pinLength: 6,
            });

            return verifyPinView;
        }

        const { pin } = parsedBody.data;
        const verificationCode = pin.join(""); // Combine the array into a single string

        // Find the user by their verification code
        const user = await prisma.user.findFirst({
            where: { verificationCode },
        });

        if (!user) {
            const verifyPinView = loadView("verify-pin")({
                errorMessage: "Invalid verification code.",
                pinLength: 6,
            });

            return verifyPinView;
        }

        // Mark the user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationCode: null, // Clear the verification code
            },
        });

        // Generate the authentication cookie
        const authCookie = generateAuthCookie(user.id, user.email);

        setHeader(event, "Set-Cookie", authCookie);

        // Check for the `redirect` cookie
        const redirectCookie = getCookie(event, "redirect");

        if (redirectCookie) {
            // Clear the redirect cookie
            setHeader(
                event,
                "Set-Cookie",
                "redirect=; Path=/; HttpOnly; Secure; Max-Age=0",
            );

            // Redirect to the original destination
            setHeader(event, "HX-Redirect", decodeURIComponent(redirectCookie));
            return;
        }

        const headerHtml = await loadTemplate("header")({
            loggedIn: true,
            username: user.name,
            oob: true,
        });
        const landing = loadView("landing-page")({});
        // Return a success response
        return `${headerHtml}${landing}`;
    } catch (error) {
        console.error("Error during PIN verification:", error);
        return {
            success: false,
            message: "Failed to verify PIN.",
            error: error.message,
        };
    }
});
