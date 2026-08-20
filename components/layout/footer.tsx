"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "@/components/backgrounds/animated-wave";
import Link from "next/link";
import { footerLinks, socialLinks } from "@/content/footer";
import { site } from "@/content/site";
import { Container } from "@/components/primitives/container";

export function Footer() {
  return (
    <footer className="relative border-t border-foreground/10">
      {/* Animated wave background */}
      <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
        <AnimatedWave />
      </div>
      
      <Container className="relative z-10">
        {/* Main Footer */}
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <Link href="/" className="inline-flex items-center gap-2 mb-6">
                <Image
                  src={site.logo.src}
                  alt={site.logo.alt}
                  width={site.logo.width}
                  height={site.logo.height}
                  className="h-10 w-auto"
                />
              </Link>

              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">
                {site.description}
              </p>

              {/* Social Links. Empty until real accounts exist. */}
              {socialLinks.length > 0 && (
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
              )}
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          {/*
            suppressHydrationWarning covers the one edge case where the server
            and the visitor's clock straddle New Year across timezones.
          */}
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              All systems operational
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
