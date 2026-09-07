import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Globe, FileText, Layers, Sparkles, Cpu, Languages } from 'lucide-react';

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

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  { icon: <Globe className="h-4 w-4" />, title: "Web Scraping & Parsing", description: "Strips away noise, sidebars, and ads to extract clean editorial text from any website URL." },
  { icon: <FileText className="h-4 w-4" />, title: "Document Processing", description: "Upload PDF or DOCX files directly. The structural parser maintains context across complex pages." },
  { icon: <Layers className="h-4 w-4" />, title: "Gemini 3.5 Flash", description: "Cloud model optimized for deep context synthesis across extensive multi-page documents." },
  { icon: <Sparkles className="h-4 w-4" />, title: "Groq GPT-OSS-120B", description: "Ultra-fast 120B open-weights inference powered by Groq LPU hardware." },
  { icon: <Cpu className="h-4 w-4" />, title: "Gemma Local Inference", description: "On-device Gemma models for complete privacy without sending data outside your environment." },
  { icon: <Languages className="h-4 w-4" />, title: "Sarvam Multilingual", description: "Native support for Hinglish and Indian regional languages without phrase loss." },
];

const Home: React.FC = () => {
  return (
    <div className="flex flex-col bg-background text-foreground font-sans">
      {/* Hero */}
      <section className="rules-band border-b border-border flex flex-1 flex-col">
        <div className="mx-auto max-w-[1100px] px-6 w-full flex flex-1 items-center py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
            {/* Left: headline & action */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <p className="kicker mb-3">
                01 / LAYERZERO — HYBRID SUMMARIZATION
              </p>

              <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight text-foreground leading-[1.08] mb-4">
                Hybrid AI summarization for intelligent document &amp; web workflows.
              </h1>

              <p className="text-[15px] text-muted-foreground max-w-xl mb-6 leading-relaxed font-sans">
                Extract, process, and summarize complex content from web pages and documents using cloud models (Gemini, Groq), local privacy engines (Gemma), or native multilingual pipelines (Sarvam).
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto mb-6">
                <Button asChild className="h-10 px-6">
                  <Link to="/register" className="inline-flex items-center gap-2">
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-10 px-6">
                  <Link to="/about">Platform Architecture ↗</Link>
                </Button>
              </div>

              <div className="w-full flex flex-wrap gap-x-7 gap-y-1.5 pt-4 border-t border-border">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">PDF &amp; DOCX PARSING</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">DOM EXTRACTION</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">4 MODEL ENGINES</span>
              </div>
            </div>

            {/* Right: system readout */}
            <div className="lg:col-span-5 w-full">
              <div className="border border-border bg-surface p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <span className="kicker">LIVE / ENGINE ROUTING</span>
                  <span className="w-1.5 h-1.5 bg-accent" />
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Provider</span>
                    <span className="text-sm font-medium text-foreground">Groq GPT-OSS-120B</span>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground block mb-1">Source</span>
                    <span className="text-sm text-muted-foreground">Financial Analysis Report Q3 2026.pdf</span>
                  </div>
                </div>

                <div className="border-t border-border my-4" />

                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground block mb-1.5">Executive Summary</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Revenue grew 24% YoY driven by enterprise adoption. Margin expansion reached 32% with operational efficiency gains across all regional clusters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-24">
          <ScrollSection>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              <div className="md:col-span-4">
                <p className="kicker">02 / CAPABILITIES</p>
              </div>
              <div className="md:col-span-8">
                <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-3">Built for Editorial Precision</h2>
                <p className="text-muted-foreground text-base font-sans max-w-xl">
                  A modular system for extracting, structuring, and synthesizing dense information from any source.
                </p>
              </div>
            </div>
          </ScrollSection>

          <div className="md:ml-[33.333%] mt-12 border-t border-border">
            {features.map((feature, index) => (
              <ScrollSection key={feature.title} delayClass={`delay-${Math.min(index * 50, 300)}`}>
                <div className="grid grid-cols-12 gap-x-6 py-6 border-b border-border items-start">
                  <div className="col-span-1 pt-1">
                    <span className="font-mono text-[10px] text-muted-foreground">0{index + 1}</span>
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center">
                      <span className="h-8 w-8 rounded-[4px] bg-secondary border border-border flex items-center justify-center text-foreground">
                        {feature.icon}
                      </span>
                    </div>
                    <span className="hidden md:block mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {titleLabel(feature.title)}
                    </span>
                  </div>
                  <div className="col-span-8 md:col-span-8">
                    <h3 className="text-lg font-heading font-medium mb-1.5 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed font-sans max-w-lg">{feature.description}</p>
                  </div>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-[1100px] px-6 py-20 md:py-24">
          <ScrollSection>
            <div className="border-t border-border pt-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
                <div className="md:col-span-9">
                  <p className="kicker mb-4">03 / CTA</p>
                  <h2 className="text-3xl md:text-4xl font-heading font-medium text-foreground mb-3">Experience layerzero</h2>
                  <p className="text-muted-foreground max-w-xl text-base font-sans leading-relaxed">
                    Seamless dispatch between local model execution and high-performance cloud providers, tailored to your privacy requirements.
                  </p>
                </div>
                <div className="md:col-span-3 flex md:justify-end">
                  <Button asChild size="lg" className="px-8 h-11 text-base">
                    <Link to="/register">Get Started ↗</Link>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>
    </div>
  );
};

// Helper: mono meta label derived from title (used in feature rows)
function titleLabel(title: string): string {
  return title.replace(/[^a-zA-Z0-9 ]/g, '').toUpperCase().slice(0, 24);
}

export default Home;