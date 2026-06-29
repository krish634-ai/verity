"use client";

import { useEffect, useState, useRef } from "react";

const domains = [
  { city: "Frontend Development", region: "React, TypeScript, CSS", latency: "45 min" },
  { city: "Backend Development", region: "APIs, Databases, System Design", latency: "60 min" },
  { city: "UI/UX Design", region: "Figma, Research, Prototyping", latency: "45 min" },
  { city: "Data Engineering", region: "SQL, Pipelines, Analytics", latency: "50 min" },
  { city: "DevOps & Cloud", region: "CI/CD, AWS, Kubernetes", latency: "55 min" },
  { city: "Mobile Development", region: "iOS, Android, React Native", latency: "45 min" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeLocation, setActiveLocation] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveLocation((prev) => (prev + 1) % domains.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Content */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}
          >
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Domains
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight mb-8">
              Your field.
              <br />
              Your interview.
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Choose a specialization and VERITY crafts a personalized interview 
              session with questions, scenarios, and evaluations tailored to your domain.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">12</div>
                <div className="text-sm text-muted-foreground">Domains covered</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Question bank</div>
              </div>
              <div>
                <div className="text-4xl lg:text-5xl font-display mb-2">45 min</div>
                <div className="text-sm text-muted-foreground">Avg. session</div>
              </div>
            </div>
          </div>

          {/* Right: Location list */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <div className="border border-foreground/10">
              {/* Header */}
              <div className="px-6 py-4 border-b border-foreground/10 flex items-center justify-between">
                <span className="text-sm font-mono text-muted-foreground">Interview Domains</span>
                <span className="flex items-center gap-2 text-xs font-mono text-green-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  6 active
                </span>
              </div>

              {/* Locations */}
              <div>
                {domains.map((domain, index) => (
                  <div
                    key={domain.city}
                    className={`px-6 py-5 border-b border-foreground/5 last:border-b-0 flex items-center justify-between transition-all duration-300 ${
                      activeLocation === index ? "bg-foreground/[0.02]" : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span 
                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                          activeLocation === index ? "bg-foreground" : "bg-foreground/20"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{domain.city}</div>
                        <div className="text-sm text-muted-foreground">{domain.region}</div>
                      </div>
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">{domain.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
