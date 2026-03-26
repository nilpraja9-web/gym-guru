import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { Demo } from "./Demo";
import {    
  Zap,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Clock,
  Shield,
  Trophy,
  Users,
  X,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Plans",
    description:
      "Get a training program tailored to your goals, experience, and schedule.",
    delay: "delay-100",
  },
  {
    icon: Target,
    title: "Goal-Oriented",
    description:
      "Whether you want to build muscle, lose fat, or get stronger — we optimize for your goal.",
    delay: "delay-200",
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description:
      "Plans that fit your lifestyle. Train 2 days or 6 — we adapt to you.",
    delay: "delay-300",
  },
  {
    icon: Clock,
    title: "Time-Efficient",
    description:
      "Every workout is designed to maximize results in your available time.",
    delay: "delay-400",
  },
];

const stats = [
  { label: "Plans Generated", value: "12,482+", icon: Zap },
  { label: "Active Athletes", value: "8.5k+", icon: Users },
  { label: "Success Rate", value: "98%", icon: Trophy },
  { label: "Expert Verified", value: "100%", icon: Shield },
];

export default function Home() {
  const { user, isLoading } = useAuth();
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
    if (showDemo) {
      const timers = [
        setTimeout(() => setDemoStep(1), 1500),
        setTimeout(() => setDemoStep(2), 3000),
        setTimeout(() => setDemoStep(3), 4500),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      setDemoStep(0);
    }
  }, [showDemo]);

  if (!isLoading && user) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Elements */}
      <div className="mesh-bg" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)]/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--color-accent)]/5 rounded-full blur-[120px] animate-pulse-glow" />

      {/* Demo Modal Overlay */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-fade-in">
          <button 
            onClick={() => setShowDemo(false)}
            className="absolute top-6 right-6 p-2 rounded-full glass hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <Card className="w-full max-w-2xl overflow-hidden glass border-[var(--color-accent)]/20 shadow-[0_0_50px_rgba(163,230,53,0.1)]">
            <div className="p-8 md:p-12 text-center">
              {demoStep < 3 ? (
                <div className="space-y-8 animate-slide-up">
                  <div className="relative w-24 h-24 mx-auto">
                    <Loader2 className="w-full h-full text-[var(--color-accent)] animate-spin stroke-[1.5]" />
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-[var(--color-accent)]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">
                      {demoStep === 0 && "Analyzing your profile..."}
                      {demoStep === 1 && "Optimizing exercise selection..."}
                      {demoStep === 2 && "Finalizing your custom routine..."}
                    </h3>
                    <p className="text-[var(--color-muted)]">Our AI is building your perfect program</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-slide-up">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] font-semibold mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Custom Plan Generated
                  </div>
                  
                 <Demo  />
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-sm font-medium text-[var(--color-muted)]">
              Next-Gen AI Training
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 animate-slide-up">
            Train <span className="text-gradient">Smarter</span>.
            <br />
            Level Up <span className="text-gradient">Faster</span>.
          </h1>

          <p className="text-lg md:text-xl text-[var(--color-foreground)]/90 max-w-2xl mx-auto mb-12 animate-slide-up opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            Ditch the cookie-cutter routines. Get a professional-grade training 
            program built by AI, optimized for your physiology and goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]">
            <Link to="/onboarding">
              <Button size="lg" className="h-14 px-10 text-lg gap-3">
                Build My Plan
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              className="h-14 px-10 text-lg"
              onClick={() => setShowDemo(true)}
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-[var(--color-border)] glass/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 text-[var(--color-foreground)]">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-widest text-[var(--color-muted)] font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Built for Performance</h2>
            <p className="text-[var(--color-muted)] text-lg max-w-2xl mx-auto">
              Our AI engine analyzes thousands of data points to generate
              the most effective training protocol for your specific needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card
                key={feature.title}
                variant="bordered"
                className={`group cursor-pointer hover:border-[var(--color-accent)]/50 transition-all duration-500 p-7`}
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center mb-6 group-hover:bg-[var(--color-accent)] group-hover:text-black transition-all duration-500">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-xl mb-3">{feature.title}</h3>
                <p className="text-[var(--color-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 bg-[var(--color-accent)]/5">
        <div className="max-w-4xl mx-auto text-center glass p-16 rounded-[3rem] border-dash border-2 border-[var(--color-accent)]/20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">
            Ready to break your <br /><span className="text-[var(--color-accent)]">Personal Best?</span>
          </h2>
          <p className="text-xl text-[var(--color-muted)] mb-12">
            Join thousands of athletes who have already optimized their training with GymAI.
          </p>
          <Link to="/onboarding">
            <Button size="lg" className="h-16 px-12 text-xl rounded-2xl">
              Start Free Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--color-border)] px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Zap className="w-6 h-6 text-[var(--color-accent)]" />
            GymAI
          </div>
          <div className="text-[var(--color-muted)] text-sm">
            © 2024 GymAI. All rights reserved. Built for champions.
          </div>
          <div className="flex gap-8 text-sm text-[var(--color-muted)]">
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}