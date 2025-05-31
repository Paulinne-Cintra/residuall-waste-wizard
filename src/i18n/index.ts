
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-br': {
    translation: {
      // Dashboard
      dashboard: 'Dashboard',
      projects: 'Projetos',
      settings: 'Configurações',
      profile: 'Perfil',
      archived: 'Arquivados',
      
      // Settings
      general: 'Geral',
      notifications: 'Notificações',
      security: 'Segurança',
      language: 'Idioma',
      timezone: 'Fuso Horário',
      theme: 'Tema da Interface',
      lightMode: 'Claro',
      darkMode: 'Escuro',
      systemMode: 'Sistema',
      saveChanges: 'Salvar Alterações',
      
      // Success messages
      settingsSaved: 'Configurações salvas',
      settingsUpdated: 'Suas configurações foram atualizadas com sucesso.',
      
      // Time zones
      'America/Sao_Paulo': 'América/São Paulo (GMT-3)',
      'America/New_York': 'América/Nova York (GMT-5)',
      'Europe/London': 'Europa/Londres (GMT+0)',
      'Europe/Madrid': 'Europa/Madrid (GMT+1)',
      'Asia/Tokyo': 'Ásia/Tóquio (GMT+9)',
    }
  },
  'en-us': {
    translation: {
      // Dashboard
      dashboard: 'Dashboard',
      projects: 'Projects',
      settings: 'Settings',
      profile: 'Profile',
      archived: 'Archived',
      
      // Settings
      general: 'General',
      notifications: 'Notifications',
      security: 'Security',
      language: 'Language',
      timezone: 'Timezone',
      theme: 'Interface Theme',
      lightMode: 'Light',
      darkMode: 'Dark',
      systemMode: 'System',
      saveChanges: 'Save Changes',
      
      // Success messages
      settingsSaved: 'Settings saved',
      settingsUpdated: 'Your settings have been updated successfully.',
      
      // Time zones
      'America/Sao_Paulo': 'America/São Paulo (GMT-3)',
      'America/New_York': 'America/New York (GMT-5)',
      'Europe/London': 'Europe/London (GMT+0)',
      'Europe/Madrid': 'Europe/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asia/Tokyo (GMT+9)',
    }
  },
  'es': {
    translation: {
      // Dashboard
      dashboard: 'Tablero',
      projects: 'Proyectos',
      settings: 'Configuración',
      profile: 'Perfil',
      archived: 'Archivados',
      
      // Settings
      general: 'General',
      notifications: 'Notificaciones',
      security: 'Seguridad',
      language: 'Idioma',
      timezone: 'Zona Horaria',
      theme: 'Tema de Interfaz',
      lightMode: 'Claro',
      darkMode: 'Oscuro',
      systemMode: 'Sistema',
      saveChanges: 'Guardar Cambios',
      
      // Success messages
      settingsSaved: 'Configuración guardada',
      settingsUpdated: 'Su configuración se ha actualizado correctamente.',
      
      // Time zones
      'America/Sao_Paulo': 'América/São Paulo (GMT-3)',
      'America/New_York': 'América/Nueva York (GMT-5)',
      'Europe/London': 'Europa/Londres (GMT+0)',
      'Europe/Madrid': 'Europa/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asia/Tokio (GMT+9)',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-br',
    fallbackLng: 'pt-br',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
