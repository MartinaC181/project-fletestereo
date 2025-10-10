import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import QuoteForm from "@/components/QuoteForm";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <Hero />
        <ServicesSection />
        <QuoteForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
