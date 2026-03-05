import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Twitter, Youtube } from 'lucide-react'
import { Container } from '@/components/ui'
import { SITE_CONFIG, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white">
      <Container size="full" className="py-16 lg:py-24 px-6 md:px-12 lg:px-20">
        {/* Top Section: Brand Story & Context */}
        <div className="mb-16 border-b border-slate-800 pb-16">
          <div className="space-y-6">
            <p className="text-xl text-slate-300 leading-relaxed font-medium">
              Salezx is built by <span className="text-white font-bold">Zoxima</span> — an AI consulting and implementation company working with enterprises across manufacturing, healthcare, and FMCG.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Built for equipment & manufacturing sales teams with 20–200 reps.
              <span className="text-slate-300 block mt-2 font-semibold">Salesforce-native. Works on top of your existing systems.</span>
            </p>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6">
              <a href="mailto:hello@salezx.com" className="text-xl font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 group">
                hello@salezx.com
                <div className="w-8 h-px bg-blue-400 group-hover:w-12 transition-all mt-1" />
              </a>
              <div className="flex gap-6">
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
                      <Icon className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Grouped Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Product</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Resources</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Company</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Legal</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
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
