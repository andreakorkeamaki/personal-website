"use client";

export default function ContactForm() {
  return (
    <form
      className="mt-8 grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const name = data.get('name');
        const email = data.get('email');
        const message = data.get('message');
        window.location.href = `mailto:hello@andreakorkeamaki.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(String(name||''))}&body=${encodeURIComponent(String(message||''))}%0A%0AFrom:%20${encodeURIComponent(String(email||''))}`;
      }}
    >
      <input name="name" placeholder="Your name" className="w-full rounded-md bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#4DA8DA]" required />
      <input name="email" type="email" placeholder="Email" className="w-full rounded-md bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#4DA8DA]" required />
      <textarea name="message" placeholder="Message" rows={5} className="w-full rounded-md bg-white/5 px-4 py-3 outline-none ring-1 ring-white/10 focus:ring-[#52357B]" required />
      <div className="flex items-center gap-4">
        <button type="submit" className="rounded-md bg-[#4DA8DA] px-6 py-3 font-medium text-[#0F0E0E] hover:opacity-90">Send</button>
        <a href="#" className="rounded-md bg-[#52357B] px-6 py-3 font-medium text-[#FFFDF6] hover:opacity-90">LinkedIn</a>
        <a href="#" className="rounded-md bg-[#468A9A] px-6 py-3 font-medium text-[#FFFDF6] hover:opacity-90">GitHub</a>
      </div>
    </form>
  );
}

