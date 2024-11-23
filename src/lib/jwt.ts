import { config } from "dotenv";
import jwt from "jsonwebtoken";

/**
 * Environment variable
 */
config({ path: ".env" });

/**
 * JWT secret key
 *
 * Key to be a signature for the JWT token
 *
 * @description JWT secret key to sign the token
 * @type {string | undefined}
 */
const JWT_SECRET: string | undefined = process.env.AUTH_SECRET;

/**
 * Generate JWT token
 *
 * Generate a JWT token with the payload and expiresIn
 * Function will return a JWT token if the secret key is defined
 *
 * @param payload object
 * @param expiresIn string
 * @returns string
 */
export const generateToken = (payload: object, expiresIn = "1h"): string => {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn });
};

/**
 * Verify JWT token
 *
 * Verify the JWT token with the secret key
 * Function will return the decoded token if the secret key is defined
 *
 * @param token string
 * @returns string | object | null
 */
export const verifyToken = (token: string): string | object | null => {
  try {
    return jwt.verify(token, JWT_SECRET!);
  } catch (error) {
    return null;
  }
};
