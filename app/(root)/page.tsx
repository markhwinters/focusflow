import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Focus,
  Coffee,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto space-y-20">
          <section className="text-center space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
              Master Your Focus,
              <br />
              <span className="text-primary">Boost Your Productivity</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              FocusFlow helps you stay productive with customizable timers,
              session tracking, and insightful analytics. Build better work
              habits, one session at a time.
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/sign-up">
                <Button size="lg" className="text-lg px-8">
                  Start Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Sign In
                </Button>
              </Link>
            </div>
          </section>

          <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Focus className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Focus Sessions</h3>
              <p className="text-muted-foreground">
                Customizable focus timers with visual progress tracking
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Coffee className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Break Timer</h3>
              <p className="text-muted-foreground">
                Take regular breaks to maintain peak performance
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <BarChart3 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track your productivity with detailed charts and statistics
              </p>
            </div>

            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <Settings className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Customizable</h3>
              <p className="text-muted-foreground">
                Personalize durations, sounds, and haptic feedback
              </p>
            </div>
          </section>

          <section className="bg-card rounded-2xl p-8 md:p-12 border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-3xl font-bold">
                  Everything you need to stay focused
                </h3>
                <ul className="space-y-4">
                  {[
                    "Visual progress rings with real-time countdown",
                    "Post-session reflections with rating system",
                    "Audio notifications and haptic feedback",
                    "Daily and weekly productivity charts",
                    "Session history and completion tracking",
                    "Dark mode support",
                    "PWA support for mobile devices",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold">25:00</div>
                  <div className="text-xl text-muted-foreground">
                    Ready to focus
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="text-center space-y-6 py-12">
            <h3 className="text-3xl font-bold">
              Ready to boost your productivity?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who have improved their focus and achieved
              their goals with FocusFlow.
            </p>
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-12">
                Get Started for Free
              </Button>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
