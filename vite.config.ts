import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { securityHeaders } from './security-headers.ts';

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'static-security-headers',
    generateBundle() {
      this.emitFile({
        type: 'asset', fileName: '_headers',
        source: '/*\n' + Object.entries(securityHeaders()).map(([name, value]) => `  ${name}: ${value}`).join('\n') + '\n',
      });
    },
  }],
  server: { host: '127.0.0.1', headers: securityHeaders(true) },
  preview: { host: '127.0.0.1', headers: securityHeaders() },
  build: { rolldownOptions: { input: ['index.html', 'voice-agents.html', 'automations.html', 'contact.html', 'privacy.html', 'terms.html'] } },
});
