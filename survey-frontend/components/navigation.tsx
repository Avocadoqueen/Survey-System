"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navigation() {
  return (
    <nav className="bg-[#7a0019] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo space */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
              <Image
                src="/assets/NEULOGO.png"
                alt="NEU Logo"
                width={160}
                height={60}
                className="rounded-lg"
              />
            </div>
            <div>
              <p className="text-xs text-primary-foreground/80">Near East University</p>
              <h1 className="text-xl font-bold">Survey Hub</h1>
            </div>
          </div>

          {/* Navigation links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-primary-foreground/80 transition-colors">
              Home
            </Link>
            <Link href="/surveys" className="hover:text-primary-foreground/80 transition-colors">
              Surveys
            </Link>
            <Link href="/about" className="hover:text-primary-foreground/80 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary-foreground/80 transition-colors">
              Contact
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
              <Link href="/login">Login</Link>
            </Button>
            <Button variant="secondary" size="sm">
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
