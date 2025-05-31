
// tailwind.config.ts
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
				// Cores do shadcn/ui
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
				// Nova paleta de cores da RESIDUALL
				'residuall-green': {
					DEFAULT: '#2F4A3A', // Verde escuro principal
					secondary: '#3a5944', // Variação para hover
					light: '#4a6b56', // Verde mais claro
				},
				'residuall-orange': {
					DEFAULT: '#D87C4A', // Laranja queimado
					light: '#e59464', // Variação mais clara
					dark: '#c16a3a', // Variação mais escura
				},
				'residuall-gray': {
					light: '#F4F4F4', // Cinza claro quase branco
					DEFAULT: '#454545', // Grafite escuro
					dark: '#2a2a2a', // Mais escuro para textos
				},
				'residuall-beige': '#E7C792', // Bege dourado claro
				'residuall-white': '#FFFFFF',
				// Cores para sidebar (compatibilidade)
				sidebar: {
					DEFAULT: '#2F4A3A',
					foreground: '#f4f4f4',
					'item-text': '#f4f4f4',
					'item-active-bg': '#3a5944',
					'item-active-text': '#ffffff',
					'item-hover-bg': '#3a5944',
					border: '#3a5944',
					ring: '#4a6b56',
					dark: {
						DEFAULT: '#1a2e22',
						foreground: '#ffffff',
						'item-text': '#a8a8a8',
						'item-active-bg': '#3a5944',
						'item-active-text': '#ffffff',
						'item-hover-bg': '#3a5944',
						border: '#3a5944',
						ring: '#4a6b56',
					}
				}
			},
			backgroundImage: {
				'residuall-gradient': 'linear-gradient(135deg, #2F4A3A 0%, #D87C4A 100%)',
				'login-bg': 'linear-gradient(135deg, #2F4A3A 0%, #3a5944 50%, #D87C4A 100%)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'residuall': '0 4px 6px -1px rgba(47, 74, 58, 0.1), 0 2px 4px -1px rgba(47, 74, 58, 0.06)',
				'residuall-hover': '0 10px 15px -3px rgba(47, 74, 58, 0.1), 0 4px 6px -2px rgba(47, 74, 58, 0.05)',
				'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			},
			fontFamily: {
				sans: ['Lato', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				quicksand: ['Quicksand', 'sans-serif'],
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
				},
				'glow': {
					'0%': { filter: 'brightness(1)' },
					'100%': { filter: 'brightness(1.2)' }
				},
				'geometric-move': {
					'0%': { transform: 'translateX(-100%) translateY(0) rotate(0deg)' },
					'50%': { transform: 'translateX(50vw) translateY(-20px) rotate(180deg)' },
					'100%': { transform: 'translateX(100vw) translateY(0) rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'glow': 'glow 0.3s ease-in-out',
				'geometric-move': 'geometric-move 20s linear infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
