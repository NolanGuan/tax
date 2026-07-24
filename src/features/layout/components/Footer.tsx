'use client';

import { useSiteConfig } from '@/config/site-context';

export function Footer() {
  const { footer, contactEmail, social, name } = useSiteConfig();

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 text-sm text-gray-600 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-gray-900">{name}</p>
          <p className="max-w-md text-gray-600">{footer.about}</p>
          <div className="space-y-1 text-gray-500">
            <p>
              Contact us at{' '}
              <a className="text-blue-600 hover:text-blue-700" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>
            <p>
              Share feedback at{' '}
              <a className="text-blue-600 hover:text-blue-700" href={`mailto:${contactEmail}`}>
                {contactEmail}
              </a>
            </p>
            <div className="flex gap-4 text-blue-600">
              {social.github ? (
                <a href={social.github} target="_blank" rel="noreferrer" className="hover:text-blue-700">
                  GitHub
                </a>
              ) : null}
              {social.twitter ? (
                <a href={social.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-700">
                  Twitter
                </a>
              ) : null}
              <button
                type="button"
                className="hover:text-blue-700"
                onClick={() => window.dispatchEvent(new Event('gtc:open-consent'))}
              >
                Privacy choices
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Quick links</h3>
          <ul className="space-y-2">
            {footer.links?.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-gray-600 transition-colors hover:text-gray-900">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Resources</h3>
          <ul className="space-y-2">
            {footer.resources?.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-gray-600 transition-colors hover:text-gray-900"
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500">
          {footer.copyright}
        </div>
      </div>
    </footer>
  );
}
