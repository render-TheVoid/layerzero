import React, { useEffect, useRef, useState } from 'react';

const ScrollSection: React.FC<{ children: React.ReactNode, delayClass?: string }> = ({ children, delayClass = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${delayClass}`}>
      {children}
    </div>
  );
};

const Section: React.FC<{ index: string; label: string; children: React.ReactNode }> = ({ index, label, children }) => {
  return (
    <section className="border-t border-border pt-8">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="kicker">{index} / {label}</span>
      </div>
      {children}
    </section>
  );
};

const pipeline = [
  { title: "Data Ingestion & Parsing", body: "High-performance parsers for PDF, DOCX, and HTML DOM structures with boilerplate removal." },
  { title: "Rate Limiting", body: "Granular API rate limiting using Upstash Redis IP throttling to protect model quotas." },
  { title: "Multi-Tier Caching", body: "Upstash Redis distributed caching layer for instant responses on repeated summarization requests." },
  { title: "Routing Layer", body: "Dynamic SSE streaming dispatcher across 4 AI providers (Gemini, Groq, Sarvam, Gemma)." },
  { title: "CI/CD & Cloud Infrastructure", body: "Continuous integration and automated deployment pipeline with Docker containerization." },
  { title: "Client Generation & Export", body: "Interactive markdown streaming with client-side PDF export generation." },
];

const engines = [
  { name: "GEMINI", tag: "Cloud", body: "Massive context windows and state-of-the-art reasoning for complex synthesis across large documents." },
  { name: "GROQ", tag: "High-Speed", body: "Open-weights 120B model served at speed via Groq LPU hardware. A fast middle ground." },
  { name: "GEMMA", tag: "Local / Privacy", body: "Lightweight open models run on your hardware — zero data transmission for confidential content." },
  { name: "SARVAM", tag: "Multilingual", body: "Purpose-built for Hinglish and Indian regional languages without phrase loss." },
];

const About: React.FC = () => {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-16 md:py-20 text-foreground font-sans">
      {/* 01 / PLATFORM */}
      <ScrollSection>
        <div className="pb-10">
          <p className="kicker mb-6">01 / PLATFORM DOCUMENTATION</p>
          <h1 className="text-4xl md:text-6xl font-heading font-medium tracking-tight text-foreground mb-5">About layerzero</h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl font-sans leading-relaxed">
            A hybrid AI summarization architecture built for quiet, high-density editorial workflows.
          </p>
        </div>
      </ScrollSection>

      {/* 02 / WHAT IT DOES */}
      <Section index="02" label="WHAT IT DOES">
        <p className="text-base text-muted-foreground leading-relaxed font-sans max-w-3xl mb-10">
          layerzero is a unified platform for extracting, processing, and summarizing vast amounts of textual data. Whether dealing with dense PDF reports, lengthy DOCX files, or web articles, layerzero strips away noise and provides concise, structured, and accurate summaries.
        </p>
        <div className="grid grid-cols-3 gap-px bg-border border border-border">
          <div className="bg-background p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">Extract</span>
            <ul className="space-y-1 text-xs text-muted-foreground font-mono">
              <li>PDF / DOCX</li>
              <li>WEB</li>
              <li>TEXT</li>
            </ul>
          </div>
          <div className="bg-background p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">Process</span>
            <ul className="space-y-1 text-xs text-muted-foreground font-mono">
              <li>CLOUD MODELS</li>
              <li>LOCAL MODELS</li>
              <li>MULTILINGUAL</li>
            </ul>
          </div>
          <div className="bg-background p-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-3">Summarize</span>
            <ul className="space-y-1 text-xs text-muted-foreground font-mono">
              <li>STRUCTURED OUTPUT</li>
              <li>MARKDOWN</li>
              <li>PDF EXPORT</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* 03 / ENGINE ROUTING */}
      <Section index="03" label="ENGINE ROUTING">
        <p className="text-base text-muted-foreground leading-relaxed font-sans max-w-3xl mb-10">
          We believe in picking the model that fits the task. Choose the inference engine that matches your requirements: maximum reasoning power (Gemini), fast open-source inference (Groq), complete privacy (Gemma, local-only), or native multilingual support (Sarvam).
        </p>
        <div className="border-t border-border">
          {engines.map((engine, i) => (
            <ScrollSection key={engine.name} delayClass={`delay-${i * 50}`}>
              <div className="grid grid-cols-12 gap-x-6 py-6 border-b border-border items-start">
                <div className="col-span-12 md:col-span-3">
                  <span className="font-mono text-sm font-semibold tracking-[0.15em] text-foreground">{engine.name}</span>
                  <span className="block mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{engine.tag}</span>
                </div>
                <p className="col-span-12 md:col-span-9 text-sm text-muted-foreground leading-relaxed font-sans">{engine.body}</p>
              </div>
            </ScrollSection>
          ))}
        </div>
      </Section>

      {/* 04 / SYSTEM PIPELINE */}
      <Section index="04" label="SYSTEM PIPELINE">
        <div className="border-t border-border">
          {pipeline.map((item, i) => (
            <ScrollSection key={item.title} delayClass={`delay-${i * 40}`}>
              <div className="grid grid-cols-12 gap-x-6 py-5 border-b border-border items-start">
                <div className="col-span-1 pt-1">
                  <span className="font-mono text-[10px] text-muted-foreground">0{i + 1}</span>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
                <p className="col-span-12 md:col-span-7 text-sm text-muted-foreground leading-relaxed font-sans">{item.body}</p>
              </div>
            </ScrollSection>
          ))}
        </div>
      </Section>

      {/* 05 / DESIGN PRINCIPLE */}
      <Section index="05" label="DESIGN PRINCIPLE">
        <ScrollSection>
          <blockquote className="max-w-3xl">
            <p className="text-3xl md:text-4xl font-heading font-medium text-foreground leading-snug">
              "Strip away noise."
            </p>
            <div className="rule my-6" />
            <p className="text-base text-muted-foreground leading-relaxed font-sans max-w-3xl">
              Layerzero is designed around one constraint: the signal is already in the source text. The platform removes everything that obscures it — layout, boilerplate, redundancy — and returns structure. The same discipline applies to this product: quiet surfaces, typography as the interface, and decoration only where it communicates.
            </p>
          </blockquote>
        </ScrollSection>
      </Section>
    </div>
  );
};

export default About;