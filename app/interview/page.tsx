"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Phone, MessageSquare, Clock, Volume2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Animated ASCII sphere component (same as landing page)
function AnimatedAvatarSphere({ isSpeaking }: { isSpeaking: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // When speaking, make the sphere expand/contract (disassemble effect)
      const baseRadius = Math.min(rect.width, rect.height) * 0.4;
      const pulseAmount = isSpeaking ? Math.sin(timeRef.current * 3) * 15 : 0;
      const radius = baseRadius + pulseAmount;

      ctx.font = "10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const points: { x: number; y: number; z: number; char: string }[] = [];

      // Generate sphere points
      for (let phi = 0; phi < Math.PI * 2; phi += 0.18) {
        for (let theta = 0; theta < Math.PI; theta += 0.18) {
          const x = Math.sin(theta) * Math.cos(phi + timeRef.current * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + timeRef.current * 0.5);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = timeRef.current * 0.3;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X axis
          const rotX = timeRef.current * 0.2;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: chars[charIndex],
          });
        }
      }

      // Sort by z for depth
      points.sort((a, b) => a.z - b.z);

      // Draw points
      points.forEach((point) => {
        const alpha = 0.2 + (point.z + 1) * 0.4;
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillText(point.char, point.x, point.y);
      });

      // Speed up rotation when speaking
      timeRef.current += isSpeaking ? 0.04 : 0.02;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameRef.current);
    };
  }, [isSpeaking]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

const domainNames: Record<string, string> = {
  frontend: "Frontend Development",
  backend: "Backend Development",
  uiux: "UI/UX Design",
};

function InterviewContent() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain") || "frontend";
  const domainName = domainNames[domain] || "Technical";

  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; content: string }>>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    // Load initial question from API
    const loadInitialQuestion = async () => {
      try {
        const response = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain,
            difficulty: 'medium',
            topic: domainName
          })
        });
        const data = await response.json();
        const question = data.message;
        setQuestions([question]);
        setConversationHistory(data.conversationHistory);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load interview:', error);
        setQuestions(["Hello! I'm VERITY, your AI interviewer. Let's begin!"]);
        setLoading(false);
      }
    };
    loadInitialQuestion();
  }, [domain, domainName]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate AI speaking animation
  useEffect(() => {
    const speakingInterval = setInterval(() => {
      setIsAISpeaking((prev) => !prev);
    }, 3000);
    return () => clearInterval(speakingInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden noise-overlay bg-background">
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
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
      <header className="relative z-10 px-6 lg:px-12 py-4 border-b border-foreground/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-display">VERITY</span>
              <span className="text-xs text-muted-foreground font-mono">TM</span>
            </Link>
            <span className="hidden sm:block text-sm text-muted-foreground font-mono">
              {domainName} Interview
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">Recording</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main interview area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row">
        {/* AI Avatar section */}
        <div 
          className={`flex-1 flex flex-col items-center justify-center p-8 lg:p-12 transition-all duration-1000 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* AI Avatar - Animated ASCII Sphere */}
          <div className="relative mb-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <AnimatedAvatarSphere isSpeaking={isAISpeaking} />
            </div>

            {/* Speaking indicator */}
            <div 
              className={`flex items-center gap-2 px-3 py-1 bg-foreground text-background rounded-full text-xs font-mono transition-opacity duration-300 mt-4 ${
                isAISpeaking ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <Volume2 className="w-3 h-3" />
              Speaking
            </div>
          </div>

          {/* AI Name */}
          <h2 className="text-2xl font-display mb-2">VERITY AI</h2>
          <p className="text-sm text-muted-foreground font-mono mb-8">AI Interviewer</p>

          {/* Current question */}
          <div className="max-w-xl text-center">
            <p className="text-lg leading-relaxed text-foreground/80">
              {questions[currentQuestion]}
            </p>
          </div>

          {/* Question navigation */}
          <div className="flex items-center gap-2 mt-8">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQuestion(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentQuestion 
                    ? "bg-foreground w-8" 
                    : i < currentQuestion 
                      ? "bg-foreground/50" 
                      : "bg-foreground/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Transcript sidebar */}
        <div className="lg:w-[400px] border-t lg:border-t-0 lg:border-l border-foreground/10 p-6 lg:p-8 bg-foreground/[0.02]">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">Live Transcript</span>
          </div>

          <div className="space-y-6 max-h-[300px] lg:max-h-[500px] overflow-y-auto">
            {/* AI message */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">VERITY AI</span>
                <span className="text-xs text-muted-foreground">0:00</span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {questions[0]}
              </p>
            </div>

            {/* Placeholder for user responses */}
            <div className="border-t border-dashed border-foreground/10 pt-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mic className="w-4 h-4" />
                <span className="text-xs font-mono">Waiting for your response...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls footer */}
      <footer className="relative z-10 px-6 lg:px-12 py-6 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-4">
          {/* Mute button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full border-foreground/20 ${
              isMuted ? "bg-red-500/10 border-red-500/30 text-red-500" : ""
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>

          {/* End call button */}
          <Link href="/">
            <Button
              size="lg"
              className="h-14 px-8 rounded-full bg-red-500 hover:bg-red-600 text-white"
            >
              <Phone className="w-5 h-5 mr-2 rotate-[135deg]" />
              End Interview
            </Button>
          </Link>

          {/* Next question button */}
          <Button
            variant="outline"
            size="lg"
            onClick={() => setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))}
            disabled={currentQuestion >= questions.length - 1}
            className="h-14 px-6 rounded-full border-foreground/20 disabled:opacity-50"
          >
            Next Question
          </Button>
        </div>
      </footer>
    </main>
  );
}

export default function InterviewPage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen flex items-center justify-center noise-overlay bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">Loading interview...</p>
        </div>
      </main>
    }>
      <InterviewContent />
    </Suspense>
  );
}
