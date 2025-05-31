
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
				// Manter suas cores de shadcn/ui
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
				// Nova paleta de cores RESIDUALL
				'residuall-green': {
					DEFAULT: '#2F4A3A', // Verde escuro principal
					light: '#3A5A47',
					dark: '#1F3127'
				},
				'residuall-orange': {
					DEFAULT: '#D87C4A', // Laranja queimado
					light: '#E09966',
					dark: '#B8652E'
				},
				'residuall-gray': {
					light: '#F4F4F4', // Cinza claro quase branco
					DEFAULT: '#454545', // Grafite escuro
					dark: '#2A2A2A'
				},
				'residuall-beige': '#E7C792', // Bege dourado claro
				'residuall-white': '#FFFFFF',
				
				// Cores antigas mantidas para compatibilidade
				'residuall-green-default': '#2F4A3A',
				'residuall-green-secondary': '#3A5A47',
				'residuall-green-card': '#434b3c',
				'residuall-green-gradient': '#6e7848',
				'residuall-green-tag': '#46583a',
				'residuall-brown': {
					DEFAULT: '#D87C4A',
					light: '#E09966'
				},
				'residuall-orange-burnt': '#D87C4A',
				'residuall-accent-orange': '#D87C4A',
				'residuall-gray-dark': '#454545',
				'residuall-gray-text': '#f4f4f4',
				'residuall-gray-username': '#2b2b2b',
				'residuall-gray-tableText': '#252525',
				'residuall-gray-chartLight': '#8a8a8a',
				'residuall-gray-chartDark': '#3b3b3b',
				
				sidebar: {
					DEFAULT: '#1f2f29',
					foreground: '#f4f4f4',
					'item-text': '#f4f4f4',
					'item-active-bg': '#2a4a3d',
					'item-active-text': '#ffffff',
					'item-hover-bg': '#2a4a3d',
					border: '#2a4a3d',
					ring: '#6e7848',
					dark: {
						DEFAULT: '#15201c',
						foreground: '#ffffff',
						'item-text': '#a8a8a8',
						'item-active-bg': '#2a4a3d',
						'item-active-text': '#ffffff',
						'item-hover-bg': '#2a4a3d',
						border: '#2a4a3d',
						ring: '#6e7848',
					}
				}
			},
			backgroundImage: {
				'sidebar-active': 'radial-gradient(circle at 0%, #2a4a3d 0%, #2a4a3d 50%, #6e7848 100%)',
				'login-bg': 'linear-gradient(135deg, #2F4A3A 0%, #D87C4A 100%)',
				'hero-gradient': 'linear-gradient(135deg, #2F4A3A 0%, #3A5A47 50%, #2F4A3A 100%)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'residuall': '0px 4px 6px rgba(0, 0, 0, 0.1)',
				'residuall-hover': '0px 6px 8px rgba(0, 0, 0, 0.15)',
				'soft-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'soft-2xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'card': '0 4px 12px rgba(47, 74, 58, 0.1)',
				'card-hover': '0 8px 24px rgba(47, 74, 58, 0.15)'
			},
			fontFamily: {
				sans: ['Lato', 'sans-serif'],
				montserrat: ['Montserrat', 'sans-serif'],
				quicksand: ['Quicksand', 'sans-serif'],
				lato: ['Lato', 'sans-serif']
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
				'geometric-move': {
					'0%': { transform: 'translateX(-100px) rotate(0deg)' },
					'50%': { transform: 'translateX(100px) rotate(180deg)' },
					'100%': { transform: 'translateX(-100px) rotate(360deg)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
				'geometric-move': 'geometric-move 20s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
