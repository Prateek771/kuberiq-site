import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { rolldownOptions: { input: ['index.html', 'voice-agents.html', 'automations.html', 'contact.html'] } },
});
