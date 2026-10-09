import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/motion.css";
import "blobatar/gaze.css";

import { useContactForm } from "@/features/contact/hooks/use-contact-form";

export function ContactForm() {
  const { form, loading, success, error, onSubmit } = useContactForm();
  const { ref: gazeRef } = useGaze({ travel: 3, lookAt: "pointer" });

  const { errors } = form.formState;

  return (
    <section id="contact" className="px-4 py-16 md:py-24 border-t border-gray-100">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8">
        {/* Left: label + description */}
        <div>
          <p className="text-lg tracking-[-0.64px] text-black mb-4">
            Get in touch
          </p>
          <Blobatar
            ref={gazeRef}
            name="hugo"
            animate="always"
            title="This is me"
            className="w-24 mb-4 aspect-square"
          />
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
            Available for freelance projects and part-time opportunities. Say
            hello at{" "}
            <a
              href="mailto:aji.ahmad.dev@gmail.com"
              className="text-[#111111] underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              aji.ahmad.dev@gmail.com
            </a>
          </p>
        </div>

        {/* Right: minimal form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            {...form.register("email")}
            className="w-full border-b border-gray-200 py-3 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] bg-transparent transition-colors"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <textarea
            rows={4}
            placeholder="Your message..."
            {...form.register("message")}
            className="w-full border-b border-gray-200 py-3 text-sm text-[#111111] placeholder:text-gray-400 focus:outline-none focus:border-[#111111] bg-transparent resize-none transition-colors"
          />
          {errors.message && (
            <p className="text-sm text-red-500">{errors.message.message}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="text-sm font-medium text-[#111111] underline underline-offset-4 hover:text-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending…" : "Send message →"}
          </button>
          {success && (
            <p className="text-sm text-gray-500">Message sent successfully.</p>
          )}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </form>
      </div>
    </section>
  );
}
