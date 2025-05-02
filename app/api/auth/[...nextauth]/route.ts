import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { RateLimiterMemory } from "rate-limiter-flexible";

const loginRateLimiter = new RateLimiterMemory({
  keyPrefix: "login_fail",
  points: 5, // 5 attempts
  duration: 60, // per 60 seconds
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          await loginRateLimiter.consume(credentials?.email);

          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single();

          if (!userData || !userData.password_hash) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            userData.password_hash
          );

          if (!passwordMatch) return null;
          if (error) {
            console.error("Login failed: user not found.");
            return null;
          }

          return {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            is_pro: userData.is_pro,
          };
        } catch (rateError) {
          console.warn("🚫 Rate limit hit:", rateError);
          throw new Error("Too many login attempts. Try again later.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
