'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/lib/i18n/locale-context';

export function PublicFooter() {
  const { t } = useLocale();

  const quickLinks = [
    { name: t.nav.rooms, href: '/rooms' },
    { name: t.nav.booking, href: '/booking' },
    { name: t.nav.about, href: '/about' },
    { name: t.nav.contact, href: '/contact' },
  ];

  const services = [
    { name: 'Restaurant', href: '/services/restaurant' },
    { name: 'Spa & Wellness', href: '/services/spa' },
    { name: 'Conference Rooms', href: '/services/conference' },
    { name: 'Airport Shuttle', href: '/services/shuttle' },
  ];

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-serif text-xl font-bold">L</span>
              </div>
              <div>
                <span className="font-serif text-xl font-semibold">Leul Mekonen</span>
                <span className="block text-xs text-sidebar-foreground/70 -mt-1">Hotel</span>
              </div>
            </div>
            <p className="text-sm text-sidebar-foreground/80 mb-4">
              {t.hotel.description}
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t.footer.services}</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-sm font-semibold mb-4">{t.footer.contact}</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2 text-sm text-sidebar-foreground/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{t.hotel.address}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{t.hotel.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-sidebar-foreground/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>{t.hotel.email}</span>
              </li>
            </ul>

            <h4 className="text-sm font-semibold mb-2">{t.footer.newsletter}</h4>
            <p className="text-xs text-sidebar-foreground/60 mb-2">{t.footer.subscribeText}</p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t.footer.enterEmail}
                className="bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50"
              />
              <Button size="sm" className="shrink-0">
                {t.footer.subscribe}
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-sidebar-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sidebar-foreground/60">
            &copy; {new Date().getFullYear()} Leul Mekonen Hotel. {t.footer.allRightsReserved}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              {t.footer.privacyPolicy}
            </Link>
            <Link href="/terms" className="text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors">
              {t.footer.termsOfService}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
