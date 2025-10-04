import Footer from "@/components/Footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <div className="max-w-2xl">
          <p className="text-lg mb-8">
            Have a question? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                rows={6}
                className="w-full rounded-md border border-[var(--border)] bg-transparent px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="rounded-md bg-[var(--accent)] px-8 py-3 font-medium text-[var(--background)] hover:opacity-90 transition-opacity"
            >
              Send Message
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h2 className="text-xl font-semibold mb-4">Other Ways to Reach Us</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p><strong>Email:</strong> support@sellery.com</p>
              <p><strong>Phone:</strong> 1-800-SELLERY</p>
              <p><strong>Hours:</strong> Monday - Friday, 9am - 5pm EST</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
