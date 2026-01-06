import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'API', href: '/api-docs' },
      { label: 'Status', href: '/status' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'Cookies', href: '/cookies' },
    ],
    Support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Community', href: '/community' },
      { label: 'Contact Support', href: '/support' },
    ],
  };

  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <h3 className="text-2xl font-bold">Grok AI</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Building the future of human-AI interaction. Our chatbot delivers intelligent,
              nuanced conversations powered by cutting-edge AI technology.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-lg hover:bg-muted"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-lg hover:bg-muted"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border rounded-lg hover:bg-muted"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@grokai.com"
                className="p-2 border rounded-lg hover:bg-muted"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Grok AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ by the Grok team</span>
              <span>•</span>
              <span>San Francisco, CA</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}