import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabaseClient";
import bcrypt from "bcryptjs";
import { RateLimiterMemory } from "rate-limiter-flexible";
// ✅ clean import


const loginRateLimiter = new RateLimiterMemory({
  keyPrefix: "login_fail",
  points: 5,
  duration: 60,
});

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          await loginRateLimiter.consume(credentials.email);

          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("email", credentials.email)
            .single();

          if (!userData?.password_hash) return null;

          const passwordMatch = await bcrypt.compare(
            credentials.password,
            userData.password_hash
          );
          if (!passwordMatch) return null;

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
  callbacks: {
    async session({ session }) {
      if (!session?.user?.email) return session;

      const { data: user } = await supabase
        .from("users")
        .select("id, is_pro")
        .eq("email", session.user.email)
        .single();

      let invoiceCount = 0;
      
      if (user?.id) {
        const { count } = await supabase
          .from("invoices")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        invoiceCount = count ?? 0;
      }

      return {
        ...session,
        user: {
          ...session.user,
          invoiceCount,
          is_pro: user?.is_pro,
        },
      };
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// ✅ ✅ ✅ THIS IS ALL YOU EXPORT
export { handler as GET, handler as POST };
