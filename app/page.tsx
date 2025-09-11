import Hero from "../components/Hero";
import ContactForm from "../components/ContactForm";

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

      {/* Projects */}
      <section id="projects" className="bg-[#FFFDF6] text-[#0F0E0E]">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-display text-3xl md:text-4xl">Projects</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <article
                key={i}
                className="group relative overflow-hidden rounded-xl border border-black/5 bg-white p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#4DA8DA]/0 via-[#468A9A]/0 to-[#52357B]/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                <div className="h-36 rounded-lg bg-gradient-to-br from-[#4DA8DA]/30 via-[#468A9A]/25 to-[#52357B]/30" />
                <h3 className="mt-4 font-display text-xl">Project {i + 1}</h3>
                <p className="mt-2 text-sm text-black/70 font-body">
                  A short description of the project with an elegant hover effect.
                </p>
                <div className="mt-4 flex gap-2 text-xs">
                  <span className="rounded-full bg-[#4DA8DA]/15 px-3 py-1 text-[#4DA8DA]">Three.js</span>
                  <span className="rounded-full bg-[#468A9A]/15 px-3 py-1 text-[#468A9A]">Next.js</span>
                  <span className="rounded-full bg-[#52357B]/15 px-3 py-1 text-[#52357B]">R3F</span>
                </div>
              </article>
            ))}
          </div>
        </div>
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
