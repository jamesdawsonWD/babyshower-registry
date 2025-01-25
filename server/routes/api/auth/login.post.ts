import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import argon2 from "argon2"; // Use Argon2 for password verification

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Use a secure secret in production

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Extract login details from the request body
    const { email, password } = body;

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    // Find the user in the database by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      const login = loadView("login")({
        errorMessage: "User not found. Please try again",
      });
      return login;
    }

    // Verify the password using Argon2
    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      const login = loadView("login")({
        errorMessage: "Incorrect password. Please try again",
      });
      return login;
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1h" }, // Token expires in 1 hour
    );

    // Set the cookie
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
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "Login failed.",
      error: error.message,
    };
  }
});
