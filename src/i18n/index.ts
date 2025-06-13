
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
      team: 'Equipe',
      materials: 'Materiais',
      reports: 'Relatórios',
      recommendations: 'Recomendações',
      overview: 'Visão Geral',
      
      // Navigation
      home: 'Início',
      logout: 'Sair',
      login: 'Entrar',
      register: 'Cadastrar',
      
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
      
      // Profile
      personalInfo: 'Informações Pessoais',
      editProfile: 'Editar Perfil',
      fullName: 'Nome Completo',
      email: 'E-mail',
      phone: 'Telefone',
      position: 'Cargo/Função',
      biography: 'Biografia',
      memberSince: 'Membro desde',
      accountSecurity: 'Segurança da Conta',
      currentPassword: 'Senha Atual',
      newPassword: 'Nova Senha',
      confirmPassword: 'Confirmar Nova Senha',
      changePassword: 'Alterar Senha',
      
      // Team
      teamMembers: 'Membros da Equipe',
      addMember: 'Adicionar Membro',
      totalMembers: 'Total de Membros',
      activeMembers: 'Membros Ativos',
      
      // Projects
      createProject: 'Criar Projeto',
      projectName: 'Nome do Projeto',
      projectDescription: 'Descrição do Projeto',
      projectStatus: 'Status do Projeto',
      
      // Common
      save: 'Salvar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Excluir',
      add: 'Adicionar',
      remove: 'Remover',
      view: 'Visualizar',
      search: 'Buscar',
      filter: 'Filtrar',
      loading: 'Carregando...',
      
      // Success messages
      settingsSaved: 'Configurações salvas',
      settingsUpdated: 'Suas configurações foram atualizadas com sucesso.',
      profileUpdated: 'Perfil atualizado com sucesso.',
      passwordChanged: 'Senha alterada com sucesso.',
      photoUpdated: 'Foto de perfil atualizada.',
      
      // Error messages
      errorLoading: 'Erro ao carregar dados',
      errorSaving: 'Erro ao salvar alterações',
      errorUpload: 'Erro no upload da foto',
      passwordsDontMatch: 'As senhas não coincidem',
      passwordTooShort: 'A senha deve ter pelo menos 6 caracteres',
      
      // Time zones
      'America/Sao_Paulo': 'América/São Paulo (GMT-3)',
      'America/New_York': 'América/Nova York (GMT-5)',
      'Europe/London': 'Europa/Londres (GMT+0)',
      'Europe/Madrid': 'Europa/Madrid (GMT+1)',
      'Asia/Tokyo': 'Ásia/Tóquio (GMT+9)',
      
      // Job positions
      architect: 'Arquiteto(a)',
      engineer: 'Engenheiro(a)',
      technician: 'Técnico(a)',
      student: 'Estudante',
      projectManager: 'Gerente de Projeto',
      consultant: 'Consultor(a)',
      others: 'Outros',
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
      team: 'Team',
      materials: 'Materials',
      reports: 'Reports',
      recommendations: 'Recommendations',
      overview: 'Overview',
      
      // Navigation
      home: 'Home',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      
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
      
      // Profile
      personalInfo: 'Personal Information',
      editProfile: 'Edit Profile',
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      position: 'Position/Role',
      biography: 'Biography',
      memberSince: 'Member since',
      accountSecurity: 'Account Security',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm New Password',
      changePassword: 'Change Password',
      
      // Team
      teamMembers: 'Team Members',
      addMember: 'Add Member',
      totalMembers: 'Total Members',
      activeMembers: 'Active Members',
      
      // Projects
      createProject: 'Create Project',
      projectName: 'Project Name',
      projectDescription: 'Project Description',
      projectStatus: 'Project Status',
      
      // Common
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      add: 'Add',
      remove: 'Remove',
      view: 'View',
      search: 'Search',
      filter: 'Filter',
      loading: 'Loading...',
      
      // Success messages
      settingsSaved: 'Settings saved',
      settingsUpdated: 'Your settings have been updated successfully.',
      profileUpdated: 'Profile updated successfully.',
      passwordChanged: 'Password changed successfully.',
      photoUpdated: 'Profile photo updated.',
      
      // Error messages
      errorLoading: 'Error loading data',
      errorSaving: 'Error saving changes',
      errorUpload: 'Error uploading photo',
      passwordsDontMatch: 'Passwords do not match',
      passwordTooShort: 'Password must be at least 6 characters',
      
      // Time zones
      'America/Sao_Paulo': 'America/São Paulo (GMT-3)',
      'America/New_York': 'America/New York (GMT-5)',
      'Europe/London': 'Europe/London (GMT+0)',
      'Europe/Madrid': 'Europe/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asia/Tokyo (GMT+9)',
      
      // Job positions
      architect: 'Architect',
      engineer: 'Engineer',
      technician: 'Technician',
      student: 'Student',
      projectManager: 'Project Manager',
      consultant: 'Consultant',
      others: 'Others',
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
      team: 'Equipo',
      materials: 'Materiales',
      reports: 'Informes',
      recommendations: 'Recomendaciones',
      overview: 'Resumen',
      
      // Navigation
      home: 'Inicio',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      
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
      
      // Common
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      add: 'Agregar',
      remove: 'Remover',
      view: 'Ver',
      search: 'Buscar',
      filter: 'Filtrar',
      loading: 'Cargando...',
      
      // Success messages
      settingsSaved: 'Configuración guardada',
      settingsUpdated: 'Su configuración se ha actualizado correctamente.',
      
      // Time zones
      'America/Sao_Paulo': 'América/São Paulo (GMT-3)',
      'America/New_York': 'América/Nueva York (GMT-5)',
      'Europe/London': 'Europa/Londres (GMT+0)',
      'Europe/Madrid': 'Europa/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asia/Tokio (GMT+9)',

      // Profile
      personalInfo: 'Información Personal',
      editProfile: 'Editar Perfil',
      fullName: 'Nombre Completo',
      email: 'Correo Electrónico',
      phone: 'Teléfono',
      position: 'Cargo/Función',
      biography: 'Biografía',
      memberSince: 'Miembro desde',
      accountSecurity: 'Seguridad de la Cuenta',
      currentPassword: 'Contraseña Actual',
      newPassword: 'Nueva Contraseña',
      confirmPassword: 'Confirmar Nueva Contraseña',
      changePassword: 'Cambiar Contraseña',
      
      // Success messages
      profileUpdated: 'Perfil actualizado con éxito.',
      passwordChanged: 'Contraseña cambiada con éxito.',
      photoUpdated: 'Foto de perfil actualizada.',
      
      // Error messages
      errorLoading: 'Error al cargar datos',
      errorSaving: 'Error al guardar cambios',
      errorUpload: 'Error al subir la foto',
      passwordsDontMatch: 'Las contraseñas no coinciden',
      passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
      
      // Job positions
      architect: 'Arquitecto(a)',
      engineer: 'Ingeniero(a)',
      technician: 'Técnico(a)',
      student: 'Estudiante',
      projectManager: 'Gerente de Proyecto',
      consultant: 'Consultor(a)',
      others: 'Otros',
    }
  },
  'fr': {
    translation: {
      // Dashboard
      dashboard: 'Tableau de bord',
      projects: 'Projets',
      settings: 'Paramètres',
      profile: 'Profil',
      archived: 'Archivés',
      team: 'Équipe',
      materials: 'Matériaux',
      reports: 'Rapports',
      recommendations: 'Recommandations',
      overview: 'Aperçu',
      
      // Navigation
      home: 'Accueil',
      logout: 'Se Déconnecter',
      login: 'Se Connecter',
      register: 'S\'inscrire',
      
      // Settings
      general: 'Général',
      notifications: 'Notifications',
      security: 'Sécurité',
      language: 'Langue',
      timezone: 'Fuseau horaire',
      theme: 'Thème de l\'interface',
      lightMode: 'Clair',
      darkMode: 'Sombre',
      systemMode: 'Système',
      saveChanges: 'Enregistrer les modifications',
      
      // Common
      save: 'Enregistrer',
      cancel: 'Annuler',
      edit: 'Modifier',
      delete: 'Supprimer',
      add: 'Ajouter',
      remove: 'Retirer',
      view: 'Voir',
      search: 'Rechercher',
      filter: 'Filtrer',
      loading: 'Chargement...',
      
      // Success messages
      settingsSaved: 'Paramètres sauvegardés',
      settingsUpdated: 'Vos paramètres ont été mis à jour avec succès.',
      
      // Time zones
      'America/Sao_Paulo': 'Amérique/São Paulo (GMT-3)',
      'America/New_York': 'Amérique/New York (GMT-5)',
      'Europe/London': 'Europe/Londres (GMT+0)',
      'Europe/Madrid': 'Europe/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asie/Tokyo (GMT+9)',

      // Profile
      personalInfo: 'Informations Personnelles',
      editProfile: 'Modifier le Profil',
      fullName: 'Nom Complet',
      email: 'Courriel',
      phone: 'Téléphone',
      position: 'Poste/Fonction',
      biography: 'Biographie',
      memberSince: 'Membre depuis',
      accountSecurity: 'Sécurité du Compte',
      currentPassword: 'Mot de Passe Actuel',
      newPassword: 'Nouveau Mot de Passe',
      confirmPassword: 'Confirmer le Nouveau Mot de Passe',
      changePassword: 'Changer le Mot de Passe',
      
      // Success messages
      profileUpdated: 'Profil mis à jour avec succès.',
      passwordChanged: 'Mot de passe changé avec succès.',
      photoUpdated: 'Photo de profil mise à jour.',
      
      // Error messages
      errorLoading: 'Erreur lors du chargement des données',
      errorSaving: 'Erreur lors de la sauvegarde des modifications',
      errorUpload: 'Erreur lors du téléchargement de la photo',
      passwordsDontMatch: 'Les mots de passe ne correspondent pas',
      passwordTooShort: 'Le mot de passe doit contenir au moins 6 caractères',
      
      // Job positions
      architect: 'Architecte',
      engineer: 'Ingénieur',
      technician: 'Technicien',
      student: 'Étudiant',
      projectManager: 'Chef de Projet',
      consultant: 'Consultant',
      others: 'Autres',
    }
  },
  'de': {
    translation: {
      // Dashboard
      dashboard: 'Dashboard',
      projects: 'Projekte',
      settings: 'Einstellungen',
      profile: 'Profil',
      archived: 'Archiviert',
      team: 'Team',
      materials: 'Materialien',
      reports: 'Berichte',
      recommendations: 'Empfehlungen',
      overview: 'Übersicht',
      
      // Navigation
      home: 'Startseite',
      logout: 'Abmelden',
      login: 'Anmelden',
      register: 'Registrieren',
      
      // Settings
      general: 'Allgemein',
      notifications: 'Benachrichtigungen',
      security: 'Sicherheit',
      language: 'Sprache',
      timezone: 'Zeitzone',
      theme: 'Oberflächenthema',
      lightMode: 'Hell',
      darkMode: 'Dunkel',
      systemMode: 'System',
      saveChanges: 'Änderungen speichern',
      
      // Common
      save: 'Speichern',
      cancel: 'Abbrechen',
      edit: 'Bearbeiten',
      delete: 'Löschen',
      add: 'Hinzufügen',
      remove: 'Entfernen',
      view: 'Anzeigen',
      search: 'Suchen',
      filter: 'Filtern',
      loading: 'Laden...',
      
      // Success messages
      settingsSaved: 'Einstellungen gespeichert',
      settingsUpdated: 'Ihre Einstellungen wurden erfolgreich aktualisiert.',
      
      // Time zones
      'America/Sao_Paulo': 'Amerika/São Paulo (GMT-3)',
      'America/New_York': 'Amerika/New York (GMT-5)',
      'Europe/London': 'Europa/London (GMT+0)',
      'Europe/Madrid': 'Europa/Madrid (GMT+1)',
      'Asia/Tokyo': 'Asien/Tokio (GMT+9)',

      // Profile
      personalInfo: 'Persönliche Informationen',
      editProfile: 'Profil bearbeiten',
      fullName: 'Vollständiger Name',
      email: 'E-Mail',
      phone: 'Telefon',
      position: 'Position/Rolle',
      biography: 'Biografie',
      memberSince: 'Mitglied seit',
      accountSecurity: 'Kontosicherheit',
      currentPassword: 'Aktuelles Passwort',
      newPassword: 'Neues Passwort',
      confirmPassword: 'Neues Passwort bestätigen',
      changePassword: 'Passwort ändern',
      
      // Success messages
      profileUpdated: 'Profil erfolgreich aktualisiert.',
      passwordChanged: 'Passwort erfolgreich geändert.',
      photoUpdated: 'Profilfoto aktualisiert.',
      
      // Error messages
      errorLoading: 'Fehler beim Laden der Daten',
      errorSaving: 'Fehler beim Speichern der Änderungen',
      errorUpload: 'Fehler beim Hochladen des Fotos',
      passwordsDontMatch: 'Die Passwörter stimmen nicht überein',
      passwordTooShort: 'Das Passwort muss mindestens 6 Zeichen lang sein',
      
      // Job positions
      architect: 'Architekt(in)',
      engineer: 'Ingenieur(in)',
      technician: 'Techniker(in)',
      student: 'Student(in)',
      projectManager: 'Projektmanager(in)',
      consultant: 'Berater(in)',
      others: 'Andere',
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
