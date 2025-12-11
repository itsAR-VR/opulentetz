import crypto from "crypto"
import { cookies } from "next/headers"

const rawEmailEnv = process.env.ADMIN_ALLOWED_EMAILS ?? "Astro.aimedia@gmail.com,ar@soramedia.co"
const allowedEmails = rawEmailEnv
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

const adminPassword = process.env.ADMIN_PASSWORD ?? "qwertyuioppoiuytrewq123"
const sessionSecret = process.env.ADMIN_SESSION_SECRET ?? adminPassword
const COOKIE_NAME = "opulentetz_admin"

export const validateCredentials = (email: string, password: string) => {
  return allowedEmails.includes(email.toLowerCase()) && password === adminPassword
}

const signToken = (email: string) => {
  const signature = crypto.createHmac("sha256", sessionSecret).update(email).digest("hex")
  return `${email}:${signature}`
}

const verifyToken = (token: string) => {
  const [email, signature] = token.split(":")
  if (!email || !signature) return null
  const expected = crypto.createHmac("sha256", sessionSecret).update(email).digest("hex")
  if (expected !== signature) return null
  if (!allowedEmails.includes(email.toLowerCase())) return null
  return email
}

export const setSessionCookie = (email: string) => {
  cookies().set(COOKIE_NAME, signToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export const clearSessionCookie = () => {
  cookies().delete(COOKIE_NAME)
}

export const getSessionEmail = () => {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
