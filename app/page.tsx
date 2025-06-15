import Link from "next/link";

export default async function HomePage() {

  return (
 <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex flex-col justify-center items-center px-4">
      {/* Hero */}
      <section className="max-w-4xl text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6">
          Create, Send & Manage Invoices Effortlessly
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          InvoiceGen helps freelancers & small businesses generate professional invoices in seconds. Keep track of payments, impress your clients — and get paid faster.
        </p>
        <Link
          href="/register"
          className="inline-block bg-primary bg-blue-500 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-md shadow-lg transition"
        >
          Start Free — Get 30 Days Pro!
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2 text-primary">Beautiful Invoices</h3>
          <p className="text-gray-600">
            Customize invoices with your logo and branding. Download or email them directly to clients.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2 text-primary">Stay Organized</h3>
          <p className="text-gray-600">
            Manage all invoices in one secure dashboard. View status, payment methods, and track client details.
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <h3 className="text-xl font-bold mb-2 text-primary">Free Pro Trial</h3>
          <p className="text-gray-600">
            Register today and enjoy 30 days of Pro features — unlimited invoices, CSV export, and more.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-primary">
          Ready to impress your clients and get paid faster?
        </h2>
        <Link
          href="/register"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-md shadow-lg transition"
        >
          Join Free & Try Pro for 30 Days
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} InvoiceGen — Simple Invoicing for Modern Freelancers.
      </footer>
    </main>
  );
}
