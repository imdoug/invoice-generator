import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 text-center">
        <p className="text-gray-600 text-lg">Not authenticated. Please log in to access the app.</p>
        <Link href="/login">
          <button className="bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-2 px-6 rounded-md transition">
            Go to Login
          </button>
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-8 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-primary">
        Welcome to Invoice Generator
      </h1>
      <p className="text-gray-700 max-w-2xl">
        Easily create, manage, and download your invoices. Fast, simple, and professional.
      </p>
      <Link href="/invoices/new">
        <button className="bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-3 px-8 rounded-md text-lg shadow transition">
          Create New Invoice
        </button>
      </Link>
    </main>
  );
}
