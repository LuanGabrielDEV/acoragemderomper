/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta da logo do Romper: marfim, pêssego, terracota e o verde do ramo.
        cream: '#FBF8F3', // fundo principal (marfim)
        sand: '#F5EAE0', // pêssego claro da logo: superfícies alternadas
        nude: '#EBD8C9',
        terracota: '#9C4A2C', // ação e ênfase
        'terracota-dark': '#7E3A22',
        olive: '#5E6E52', // folha do ramo
        'olive-dark': '#46543D',
        coffee: '#2B211C', // texto
        'coffee-soft': '#54473F', // texto de apoio
        linha: '#E3D6CA', // filetes e divisórias
      },
      fontFamily: {
        serif: ['"Libre Caslon Text"', 'Georgia', 'serif'],
        body: ['Figtree', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Só o que flutua de verdade (o diálogo) tem sombra.
        dialogo: '0 18px 50px -12px rgba(43, 33, 28, 0.35)',
        soft: '0 2px 20px -4px rgba(43, 33, 28, 0.08)',
        'soft-lg': '0 8px 40px -8px rgba(43, 33, 28, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
    },
  },
  plugins: [],
};
