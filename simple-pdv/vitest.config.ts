import { defineConfig } from 'vitest/config';


export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8', // ou 'v8'
      reporter: ['text', 'json', 'html'],
      all: true, // para incluir todos os arquivos na cobertura
    },
  },
})
