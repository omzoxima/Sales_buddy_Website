import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Twitter, Youtube } from 'lucide-react'
import { Container } from '@/components/ui'
import { SITE_CONFIG, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt={SITE_CONFIG.name}
                width={140}
                height={40}
                className="h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 text-sm mb-4">
              AI-powered sales assistant for equipment sales teams.
            </p>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon === 'Linkedin' ? Linkedin : social.icon === 'Twitter' ? Twitter : Youtube
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Made with ❤️ for sales teams everywhere
          </p>
        </div>
      </Container>
    </footer>
  )
}
