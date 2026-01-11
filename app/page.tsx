import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import PlaystationStyleShowcase from "../components/PlaystationStyleShowcase";
import Script from "next/script";

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <Hero />

      {/* About */}
      <section id="about" className="bg-[#F5EDCE] text-[#0F0E0E]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl">About Me</h2>
          <div className="mt-4 font-body text-lg max-w-3xl space-y-4">
            <p>I’m Andrea Korkeamaki, a creative developer working across web, 3D, video, and AI.</p>
            <p>I build visual projects, AR assets, AI-generated content, and automations, adapting tools and approaches case by case.</p>
            <p>I studied game production and tend to learn by building and experimenting with new tools over time.</p>
          </div>
        </div>
      </section>

      {/* Projects (Playstation-style Showcase) */}
      <section id="projects">
        <PlaystationStyleShowcase />
      </section>

      {/* Services */}
      <section id="services" className="bg-white text-[#0F0E0E]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl">Services</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {([
              {
                title: 'Landing Pages',
                desc: 'Fast, elegant, conversion-focused experiences.',
                accentClass: 'bg-azzurro'
              },
              {
                title: '3D Visuals',
                desc: 'Interactive scenes and motion design.',
                accentClass: 'bg-viola'
              },
              {
                title: 'Automations',
                desc: 'AI-assisted workflows and integrations.',
                accentClass: 'bg-teal'
              }
            ] as const).map((card) => (
              <div key={card.title} className={"rounded-2xl border border-black/5 p-6 shadow-sm transition hover:shadow-md bg-[#FFFDF6]"}>
                <div className={`h-1.5 w-12 rounded-full ${card.accentClass}`} />
                <h3 className="mt-4 font-display text-2xl">{card.title}</h3>
                <p className="mt-2 font-body text-black/70">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#0F0E0E] text-[#FFFDF6]">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <ContactForm />
        </div>
      </section>

      <footer className="bg-[#0F0E0E] text-[#FFFDF6]">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 border-t border-white/10 px-6 py-6 text-sm text-white/70 md:flex-row md:items-center md:justify-between">
          <span>Andrea Korkeamaki · Registered 2025</span>
          <span>P.IVA: 02487580561</span>
        </div>
      </footer>

      <elevenlabs-convai agent-id="agent_8301keprjx37f088wdmjm4gq8ynz"></elevenlabs-convai>
      <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
    </main>
  );
}
