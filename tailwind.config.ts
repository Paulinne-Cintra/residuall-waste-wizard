import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Cores personalizadas da Residuall (Corrigidas)
				'residuall-green': {
					DEFAULT: '#1f2f29', // Verde Escuro Principal
					secondary: '#2a4a3d', // Verde Médio
					card: '#434b3c', // Verde para Card/Fundo
					gradient: '#6e7848', // Cor do gradiente (final)
					tag: '#46583a',
					// Adicionando variação para dark mode se necessário, mas por enquanto, manteremos fixo
					// se estas cores são a base da sua paleta verde.
				},
				'residuall-brown': {
					DEFAULT: '#ff8c42',
				},
				'residuall-gray': {
					light: '#F8F8F8', // Geralmente para fundos claros
					DEFAULT: '#c4c2c2', // Cinza médio
					dark: '#252525', // Cinza escuro
					text: '#f4f4f4', // Texto claro (para fundos escuros)
					username: '#2b2b2b',
					tableText: '#252525', // Texto de tabela (assumindo fundo claro)
					chartLight: '#8a8a8a',
					chartDark: '#3b3b3b',
				},
				'residuall-white': '#ffffff',
				// Definindo as cores do sidebar com suporte a dark mode
				sidebar: {
					// Padrão (para light mode)
					DEFAULT: '#1f2f29', // Seu '#1f2f29' (verde escuro do sidebar)
					foreground: '#f4f4f4', // Seu '#f4f4f4' (texto claro para logo/botões)
					'item-text': '#f4f4f4', // Cor do texto dos itens NÃO ativos no LIGHT mode (era residuall-green-secondary)
					'item-active-bg': '#2a4a3d', // Fundo do item ativo no LIGHT mode
					'item-active-text': '#ffffff', // Texto do item ativo no LIGHT mode
					'item-hover-bg': '#2a4a3d', // Fundo do hover no LIGHT mode
					border: '#2a4a3d', // Borda
					ring: '#6e7848', // Anel

					// Dark mode (prefixo 'dark:')
					dark: {
						DEFAULT: '#15201c', // Um verde AINDA MAIS ESCURO para o fundo do sidebar no dark mode
						foreground: '#ffffff', // Branco puro para logo/botões no dark mode
						'item-text': '#a8a8a8', // Cinza CLARO para itens NÃO ativos no DARK mode (melhor legibilidade)
						'item-active-bg': '#2a4a3d', // Fundo do item ativo no DARK mode (pode ser o mesmo ou ligeiramente diferente)
						'item-active-text': '#ffffff', // Texto do item ativo no DARK mode
						'item-hover-bg': '#2a4a3d', // Fundo do hover no DARK mode
						border: '#2a4a3d',
						ring: '#6e7848',
					}
				}
			},
			backgroundImage: {
				'sidebar-active': 'radial-gradient(circle at 0%, #2a4a3d 0%, #2a4a3d 50%, #6e7848 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'residuall': '0px 4px 6px rgba(0, 0, 0, 0.1)',
				'residuall-hover': '0px 6px 8px rgba(0, 0, 0, 0.15)',
			},
			fontFamily: {
				sans: ['Open Sans', 'Lato', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
