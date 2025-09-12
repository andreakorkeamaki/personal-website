import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";
import PlaystationStyleShowcase from "../components/PlaystationStyleShowcase";

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <Hero />

      {/* About */}
      <section id="about" className="bg-[#F5EDCE] text-[#0F0E0E]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl">About Me</h2>
          <p className="mt-4 font-body text-lg max-w-3xl">
            I’m Andrea Korkeamaki, a creative developer focused on interactive 3D,
            motion, and inventive web experiences. I blend design, code, and AI to
            craft elegant, performant interfaces that feel alive.
          </p>
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
          <h2 className="font-display text-3xl md:text-4xl">Contact</h2>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
