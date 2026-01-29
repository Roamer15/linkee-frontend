'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Link2, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function DemoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(
    'https://example.com/very/long/url/that/needs/shortening'
  );
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 100, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleShorten = () => {
    if (!inputValue) return;
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const randomCode = Math.random().toString(36).substring(2, 8);
      setShortUrl(`linkee.io/${randomCode}`);
      setIsLoading(false);
    }, 800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shortUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-gradient-to-b from-background via-primary/5 to-background"
    >
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Try it{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              right now
            </span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            No sign up required. See how easy it is to shorten your first link.
          </p>
        </div>

        <div
          ref={cardRef}
          className="max-w-3xl mx-auto p-8 md:p-12 rounded-3xl border bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/10"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Paste your long URL
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://your-long-url.com/..."
                    className="h-14 pl-12 text-lg bg-background/50"
                  />
                </div>
                <Button
                  onClick={handleShorten}
                  disabled={isLoading || !inputValue}
                  className="h-14 px-8 text-lg bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Shorten
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>

            {shortUrl && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-1">
                      Your shortened URL
                    </p>
                    <p className="text-xl font-semibold text-primary truncate">
                      https://{shortUrl}
                    </p>
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    size="lg"
                    className="shrink-0 gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Want analytics, custom domains, and more?{' '}
            <a href="/register" className="text-primary hover:underline font-medium">
              Create a free account
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
