'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, buttonsRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(glowRef.current, { scale: 0, opacity: 0 });

      // Main timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.to(glowRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.2,
      })
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          '-=0.8'
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.5'
        )
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
          },
          '-=0.4'
        );

      // Floating animation for glow
      gsap.to(glowRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Grid lines animation
      if (gridRef.current) {
        const lines = gridRef.current.querySelectorAll('.grid-line');
        gsap.fromTo(
          lines,
          { scaleY: 0, opacity: 0 },
          {
            scaleY: 1,
            opacity: 0.1,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.out',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated background grid */}
      <div
        ref={gridRef}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent"
            style={{ left: `${(i + 1) * 8}%` }}
          />
        ))}
      </div>

      {/* Glowing orb background */}
      <div
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/30 via-purple-500/20 to-blue-500/30 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="container relative z-10 flex flex-col items-center text-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Now with AI-powered analytics
          </span>
        </div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight max-w-5xl"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70">
            Shorten Links,
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-blue-500">
            Amplify Reach
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed"
        >
          Transform long URLs into powerful, trackable links. Get real-time
          analytics and insights to understand your audience like never before.
        </p>

        <div
          ref={buttonsRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/register">
            <Button
              size="lg"
              className="h-14 px-8 text-lg gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg border-2 hover:bg-primary/5 transition-all hover:scale-105"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-3 gap-8 md:gap-16">
          {[
            { value: '10M+', label: 'Links Created' },
            { value: '99.9%', label: 'Uptime' },
            { value: '150+', label: 'Countries' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
