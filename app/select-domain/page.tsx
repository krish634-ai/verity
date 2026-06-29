"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Code, Palette, Server } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const domains = [
  {
    id: "frontend",
    name: "Frontend Development",
    description: "React, TypeScript, CSS, and modern web development practices. Focus on UI implementation and user experience.",
    icon: Code,
    topics: ["React & Next.js", "TypeScript", "CSS & Tailwind", "State Management", "Performance"],
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "APIs, databases, system design, and server-side architecture. Focus on scalability and reliability.",
    icon: Server,
    topics: ["Node.js & Python", "REST & GraphQL", "Databases", "System Design", "Security"],
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    description: "User research, prototyping, design systems, and user-centered design principles.",
    icon: Palette,
    topics: ["User Research", "Wireframing", "Prototyping", "Design Systems", "Accessibility"],
  },
];

export default function SelectDomainPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartInterview = () => {
    if (selectedDomain) {
      router.push(`/interview?domain=${selectedDomain}`);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden noise-overlay">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 lg:px-12 py-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-display">VERITY</span>
            <span className="text-xs text-muted-foreground font-mono mt-1">TM</span>
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12">
        <div className="max-w-[1200px] mx-auto w-full">
          {/* Eyebrow */}
          <div 
            className={`mb-8 transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              Step 1 of 2
            </span>
          </div>

          {/* Title */}
          <h1 
            className={`text-4xl lg:text-6xl font-display leading-[0.9] tracking-tight mb-6 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">Choose your</span>
            <span className="block text-muted-foreground">interview domain</span>
          </h1>

          <p 
            className={`text-xl text-muted-foreground mb-12 max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Select the area you want to be interviewed in. VERITY will tailor questions and evaluation criteria to your chosen specialization.
          </p>

          {/* Domain cards */}
          <div 
            className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {domains.map((domain, index) => {
              const Icon = domain.icon;
              const isSelected = selectedDomain === domain.id;
              const isHovered = hoveredDomain === domain.id;
              
              return (
                <button
                  key={domain.id}
                  onClick={() => setSelectedDomain(domain.id)}
                  onMouseEnter={() => setHoveredDomain(domain.id)}
                  onMouseLeave={() => setHoveredDomain(null)}
                  className={`relative text-left p-8 border transition-all duration-300 group ${
                    isSelected
                      ? "border-foreground bg-foreground/[0.02]"
                      : "border-foreground/10 hover:border-foreground/30"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-foreground" />
                  )}

                  {/* Icon */}
                  <div className={`w-12 h-12 mb-6 flex items-center justify-center border transition-colors duration-300 ${
                    isSelected || isHovered ? "border-foreground" : "border-foreground/20"
                  }`}>
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${
                      isSelected || isHovered ? "text-foreground" : "text-muted-foreground"
                    }`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-display mb-3">{domain.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    {domain.description}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {domain.topics.map((topic) => (
                      <span
                        key={topic}
                        className="px-3 py-1 text-xs font-mono bg-foreground/5 text-muted-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <div 
            className={`flex items-center gap-6 transition-all duration-700 delay-400 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              size="lg"
              onClick={handleStartInterview}
              disabled={!selectedDomain}
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Interview
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            
            {selectedDomain && (
              <span className="text-sm text-muted-foreground font-mono">
                Selected: {domains.find(d => d.id === selectedDomain)?.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-6">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span className="font-mono">2026 VERITY</span>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs">Interview duration: ~45 minutes</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
