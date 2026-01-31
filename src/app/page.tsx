import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Zap, Shield, Leaf } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">ClearBill</span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/dashboard/invoices/new">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eco Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="h-4 w-4" />
              100% Paperless & Eco-Friendly
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Simple Invoicing for{" "}
              <span className="text-primary">Sri Lankan</span> Businesses
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create professional digital invoices in minutes. Go paperless and help protect our environment while managing your business efficiently.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/invoices/new">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-20 border-t">
          <h2 className="text-3xl font-bold text-center mb-4">
            Everything you need to get paid
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Powerful invoicing tools that help your business grow while protecting our planet
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Leaf className="h-10 w-10 text-green-600 dark:text-green-400" />}
              title="Paperless & Green"
              description="Go digital, save trees. Every invoice sent digitally saves paper and reduces your carbon footprint."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Quick & Easy"
              description="Create and send invoices in under 2 minutes. No accounting degree required."
            />
            <FeatureCard
              icon={<FileText className="h-10 w-10 text-primary" />}
              title="Professional Templates"
              description="Beautiful invoice templates that make your business look professional."
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="LKR & Tax Ready"
              description="Built-in support for Sri Lankan Rupees and local tax calculations."
            />
          </div>
        </section>

        {/* Eco Impact Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Leaf className="h-12 w-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Join the Paperless Movement
              </h2>
              <p className="text-lg opacity-90 mb-6">
                Every digital invoice saves paper, ink, and energy. Together, we can make a difference for our environment.
              </p>
              <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto text-center">
                <div>
                  <div className="text-3xl font-bold">0</div>
                  <div className="text-sm opacity-80">Trees Cut</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm opacity-80">Digital</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">Zero</div>
                  <div className="text-sm opacity-80">Waste</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to go paperless?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of eco-conscious Sri Lankan businesses using ClearBill.
            </p>
            <Link href="/dashboard/invoices/new">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
              >
                Start Creating Digital Invoices
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-green-600 dark:text-green-400">Committed to a paperless future</span>
          </div>
          <p>&copy; {new Date().getFullYear()} ClearBill. Made with care in Sri Lanka.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-card border rounded-lg p-6 text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
