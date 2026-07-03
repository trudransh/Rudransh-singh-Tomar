import { FadeIn } from '../components/motion';
import { researchAreas } from '../data/profile';

// The vault: 105+ documents distilled into six territories.
// Deliberately inverted — the single white passage in a dark site,
// like flipping the ledger open to a printed page.
export function ResearchSection() {
  return (
    <section className="rounded-t-[40px] bg-white px-5 py-24 text-ink sm:rounded-t-[50px] sm:px-8 md:rounded-t-[60px] md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-6 font-mono text-xs tracking-[0.3em] text-electric sm:text-sm">
            {'// '}05 — THE VAULT
          </div>
          <h2
            className="font-display font-black uppercase leading-none tracking-tight text-ink"
            style={{ fontSize: 'clamp(3rem, 10vw, 130px)' }}
          >
            Research
          </h2>
          <p className="mt-4 max-w-xl font-light leading-relaxed text-ink/60">
            105+ technical documents — architecture specs, audit reports, grant proposals, protocol
            designs — organized into six territories.
          </p>
        </FadeIn>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
          {researchAreas.map((r, i) => (
            <FadeIn key={r.title} delay={i * 0.06} className="h-full">
              <div className="group flex h-full flex-col gap-3 bg-white p-7 transition-colors duration-300 hover:bg-[#eef1f4]">
                <span className="font-mono text-xs text-electric">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                  {r.title}
                </h3>
                <p className="font-light text-sm leading-relaxed text-ink/55">{r.detail}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
