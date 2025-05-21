
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
				// Cores personalizadas da Residuall (Atualizadas para as cores oficiais)
				residuall: {
					green: {
						DEFAULT: '#1f2f29', // Verde Escuro Principal
						secondary: '#2a4a3d', // Verde Secundário
						card: '#434b3c',    // Verde Cards Projeto
						gradient: '#6e7848', // Verde Destaque Gradiente
						tag: '#46583a',     // Verde Fundo Tag "Administrador"
					},
					brown: {
						DEFAULT: '#ff8c42', // Laranja/Marrom
					},
					gray: {
						light: '#F8F8F8',   // Fundo da Área de Conteúdo Principal
						DEFAULT: '#c4c2c2', // Cinza Secundário
						text: '#f4f4f4',    // Cinza Texto/Ícones Claro
						username: '#2b2b2b', // Cinza Nome Usuário
						tableText: '#252525', // Cinza Texto Listas/Tabelas
						chartLight: '#8a8a8a', // Tom de Cinza Claro para Gráficos
						chartDark: '#3b3b3b', // Tom de Cinza Escuro para Gráficos
					},
					white: '#ffffff',      // Branco
				},
				sidebar: {
					DEFAULT: '#1f2f29', // Verde Escuro Principal
					foreground: '#f4f4f4', // Cinza Texto/Ícones Claro
					primary: '#2a4a3d', // Verde Secundário
					'primary-foreground': '#ffffff', // Branco
					accent: '#2a4a3d', // Verde Secundário
					'accent-foreground': '#ffffff', // Branco
					border: '#2a4a3d', // Verde Secundário
					ring: '#6e7848', // Verde Destaque Gradiente
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
