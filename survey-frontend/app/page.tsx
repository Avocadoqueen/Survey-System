import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedSteps } from "@/components/animated-steps"
import Link from "next/link"
import Image from "next/image"


export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
       
        {/* Hero Section */}
        <section className="relative bg-primary py-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/college-students.png"
              alt="College Students studying together"
              fill
              className="object-cover opacity-20"
              
            />
            <div className="absolute inset-0 bg-primary/75"></div>
          </div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-background rounded-2xl p-8 md:p-10 shadow-lg">
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                Create & Take Surveys
                <span className="text-primary block">Easily</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Near East University's comprehensive survey platform. Collect valuable feedback, conduct research, and
                make informed decisions with our intuitive survey tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="sm" className="text-base px-6 bg-[#800020] text-white hover:bg-[#6a001a]" asChild>
                  <Link href="/surveys/create">Create Survey</Link>
                </Button>
                <Button variant="outline" size="sm" className="text-base px-6 bg-transparent" asChild>
                  <Link href="/dashboard">Browse Surveys</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-16 bg-background overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">How It Works</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to start collecting valuable insights
              </p>
            </div>

            <AnimatedSteps />
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-16 bg-background overflow-hidden">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Why Choose Our Platform?</h2>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto">
                Built specifically for the Near East University community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <CardTitle className="text-base">Easy to Use</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Intuitive interface designed for students and faculty. No technical expertise required.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">📊</span>
                  </div>
                  <CardTitle className="text-base">Real-time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    View responses as they come in with interactive charts and detailed breakdowns.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">📱</span>
                  </div>
                  <CardTitle className="text-base">QR Code Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate QR codes for instant survey access. Perfect for classroom and campus use.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">🔒</span>
                  </div>
                  <CardTitle className="text-base">Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected with university-grade security and privacy measures.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">⚡</span>
                  </div>
                  <CardTitle className="text-base">Fast & Reliable</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Lightning-fast performance ensures smooth survey creation and participation.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold">📈</span>
                  </div>
                  <CardTitle className="text-base">Export Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Download your survey results in multiple formats for further analysis.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 bg-primary text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/assets/graduation-students.webp"
              alt="University graduation"
              fill
              className="object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-primary/80"></div>
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-base md:text-lg mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
              Join the Near East University community and start creating impactful surveys today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="sm" variant="secondary" className="bg-[#7a0019] text-white hover:bg-[#5e0014] px-6" asChild>
                <Link href="/register">Create Account</Link>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-[#7a0019] text-[#7a0019] hover:bg-[#7a0019]/10 px-6"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
