
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-br': {
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
