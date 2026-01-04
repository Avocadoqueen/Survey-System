import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">About Our Survey Platform</h1>
            <p className="text-xl text-muted-foreground mb-8 text-pretty">
              Empowering the Near East University community with simple, effective survey tools
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-foreground mb-6">Simple. Convenient. For Everyone.</h2>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our survey platform is designed to make collecting feedback and conducting research as simple as
                possible. Whether you're a student working on a project, a professor gathering course feedback, or a
                club organizing events, our platform provides the tools you need to create meaningful surveys and get
                valuable insights.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">For Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Perfect for research projects, thesis work, and group assignments. Create surveys for your
                      studies, collect data from classmates, and analyze results with built-in analytics tools.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">For Faculty & Staff</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Gather course evaluations, conduct academic research, and collect feedback from students.
                      Easy-to-use interface saves time while providing professional results.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">For Master's & PhD Students</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Advanced research capabilities for graduate studies. Create complex surveys for your research,
                      export data for analysis, and share results with your supervisors and committees.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">For Clubs & Organizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Plan events, gather member feedback, and make decisions based on community input. QR codes make it
                      easy to collect responses during meetings and events.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">Why Choose Our Platform?</h3>

              <ul className="space-y-3 text-muted-foreground mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>No technical skills required</strong> - Anyone can create professional surveys in minutes
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>Mobile-friendly</strong> - Works perfectly on phones, tablets, and computers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>Real-time results</strong> - See responses as they come in with interactive charts
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>QR code sharing</strong> - Perfect for classroom and campus distribution
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>Export capabilities</strong> - Download results in multiple formats for further analysis
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>
                    <strong>Secure and private</strong> - Your data is protected with university-grade security
                  </span>
                </li>
              </ul>

              <div className="bg-muted/50 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold text-foreground mb-4">Ready to Create Your First Survey?</h3>
                <p className="text-muted-foreground mb-6">
                  Join hundreds of students, faculty, and organizations already using our platform to gather valuable
                  insights.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/register">Get Started Today</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/dashboard">View Sample Surveys</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
