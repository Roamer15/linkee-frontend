import {
  Header,
  HeroSection,
  FeaturesSection,
  DemoSection,
  CTASection,
  Footer,
} from '@/components/landing';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
