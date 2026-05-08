"use client";

const emailAddress = "hello@andreakorkeamaki.com";
const fieldClassName =
  "w-full rounded-md bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 transition placeholder:text-white/45 focus:ring-2 focus:ring-[#4DA8DA]";

export default function ContactForm() {
  return (
    <form
      className="mt-8 grid gap-4"
      aria-label="Contact Andrea Korkeamaki"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const name = data.get("name");
        const email = data.get("email");
        const message = data.get("message");
        window.location.href = `mailto:${emailAddress}?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(String(name || ""))}&body=${encodeURIComponent(String(message || ""))}%0A%0AFrom:%20${encodeURIComponent(String(email || ""))}`;
      }}
    >
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-medium text-[#F5EDCE]">
          Your name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          className={fieldClassName}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-medium text-[#F5EDCE]">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClassName}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-medium text-[#F5EDCE]">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="What would you like to build?"
          rows={5}
          className={`${fieldClassName} resize-y`}
          required
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="rounded-md bg-[#4DA8DA] px-6 py-3 font-medium text-[#0F0E0E] transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5EDCE] focus:ring-offset-2 focus:ring-offset-[#0F0E0E]">
          Send inquiry
        </button>
        <a href={`mailto:${emailAddress}`} className="rounded-md bg-[#52357B] px-6 py-3 font-medium text-[#FFFDF6] transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#F5EDCE] focus:ring-offset-2 focus:ring-offset-[#0F0E0E]">
          Email directly
        </a>
      </div>
    </form>
  );
}
