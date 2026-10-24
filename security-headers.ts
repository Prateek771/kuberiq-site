// Keep the production preview and deployable header manifest in sync.
export function securityHeaders(development = false) {
  const csp = [
    "default-src 'self'",
    `script-src 'self'${development ? " 'unsafe-inline'" : ''}`,
    // React uses style attributes for motion; Vite injects styles during HMR.
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "media-src 'self'",
    `connect-src 'self'${development ? ' ws://127.0.0.1:* ws://localhost:*' : ''}`,
    "object-src 'none'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
    // Enquiries are deliberately non-sending until a backend is implemented.
    "form-action 'none'",
  ].join('; ') + ';';
  return {
    'Content-Security-Policy': csp,
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  };
}
