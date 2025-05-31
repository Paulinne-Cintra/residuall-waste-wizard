
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useUserSettings } from "@/hooks/useUserSettings";
import { TwoFactorModal } from "@/components/TwoFactorModal";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR, enUS, es } from 'date-fns/locale';
import { Save } from 'lucide-react';

const SettingsPage = () => {
  const { t, i18n } = useTranslation();
  const { settings, loginHistory, loading, saving, saveAllSettings } = useUserSettings();
  const [activeTab, setActiveTab] = useState("geral");
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  
  // Estado local para as configurações
  const [localSettings, setLocalSettings] = useState({
    language: 'pt-br',
    theme: 'sistema',
    email_notifications: false,
    system_alerts: false,
    project_updates: true,
    recommendation_alerts: true,
    weekly_summary: false,
    browser_notifications: false,
    sms_notifications: false,
  });

  // Sincronizar configurações locais com as do banco
  useEffect(() => {
    if (settings) {
      setLocalSettings({
        language: settings.language,
        theme: settings.theme,
        email_notifications: settings.email_notifications,
        system_alerts: settings.system_alerts,
        project_updates: settings.project_updates,
        recommendation_alerts: settings.recommendation_alerts,
        weekly_summary: settings.weekly_summary,
        browser_notifications: settings.browser_notifications,
        sms_notifications: settings.sms_notifications,
      });
    }
  }, [settings]);

  // Apply theme to document
  useEffect(() => {
    if (!settings) return;

    const applyTheme = () => {
      const html = document.documentElement;
      
      if (settings.theme === "escuro") {
        html.classList.add("dark");
      } else if (settings.theme === "claro") {
        html.classList.remove("dark");
      } else if (settings.theme === "sistema") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    };

    applyTheme();

    if (settings.theme === "sistema") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings]);

  // Apply language changes
  useEffect(() => {
    if (settings?.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings?.language, i18n]);

  const handleLocalSettingChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));

    // Aplicar imediatamente mudanças de idioma e tema
    if (field === 'language') {
      i18n.changeLanguage(value);
    }
    if (field === 'theme') {
      const html = document.documentElement;
      if (value === "escuro") {
        html.classList.add("dark");
      } else if (value === "claro") {
        html.classList.remove("dark");
      } else if (value === "sistema") {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    const success = await saveAllSettings(localSettings);
    if (success) {
      // Configurações salvas com sucesso
      console.log('Configurações salvas com sucesso');
    }
  };

  const getDateLocale = () => {
    switch (localSettings.language) {
      case 'en-us': return enUS;
      case 'es': return es;
      default: return ptBR;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: getDateLocale() });
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Carregando configurações...</p>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">Erro ao carregar configurações.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Menu de Subseções (Coluna Esquerda) */}
        <div className="md:w-1/4 lg:w-1/5">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                orientation="vertical"
                className="w-full"
              >
                <TabsList className="flex flex-col items-stretch h-auto bg-transparent space-y-1 p-2">
                  <TabsTrigger 
                    value="geral" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 text-gray-600 data-[state=inactive]:hover:bg-gray-50"
                  >
                    {t('general')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notificacoes" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 text-gray-600 data-[state=inactive]:hover:bg-gray-50"
                  >
                    {t('notifications')}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seguranca" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 text-gray-600 data-[state=inactive]:hover:bg-gray-50"
                  >
                    {t('security')}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Conteúdo da Subseção Selecionada (Coluna Direita) */}
        <div className="md:w-3/4 lg:w-4/5">
          <Tabs value={activeTab} className="w-full">
            {/* Conteúdo da seção Geral */}
            <TabsContent value="geral" className="space-y-6 mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('language')}</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-gray-700">{t('language')}</Label>
                      <Select 
                        value={localSettings.language} 
                        onValueChange={(value) => handleLocalSettingChange('language', value)}
                      >
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Selecione o idioma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                          <SelectItem value="en-us">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="it">Italiano</SelectItem>
                          <SelectItem value="zh">中文 (简体)</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('theme')}</h3>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Selecione o tema de exibição do sistema:</p>
                    <ToggleGroup 
                      type="single" 
                      value={localSettings.theme} 
                      onValueChange={(value) => value && handleLocalSettingChange('theme', value)}
                    >
                      <ToggleGroupItem value="claro" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        {t('lightMode')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="escuro" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        {t('darkMode')}
                      </ToggleGroupItem>
                      <ToggleGroupItem value="sistema" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        {t('systemMode')}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conteúdo da seção Notificações */}
            <TabsContent value="notificacoes" className="space-y-6 mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Preferências de Notificação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="email-notifications" 
                        checked={localSettings.email_notifications}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('email_notifications', checked);
                          }
                        }}
                      />
                      <Label htmlFor="email-notifications" className="text-gray-700">
                        Notificações por E-mail
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="system-alerts" 
                        checked={localSettings.system_alerts}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('system_alerts', checked);
                          }
                        }}
                      />
                      <Label htmlFor="system-alerts" className="text-gray-700">
                        Alertas de Sistema
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="project-updates" 
                        checked={localSettings.project_updates}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('project_updates', checked);
                          }
                        }}
                      />
                      <Label htmlFor="project-updates" className="text-gray-700">
                        Atualizações de Projeto
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recommendation-alerts" 
                        checked={localSettings.recommendation_alerts}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('recommendation_alerts', checked);
                          }
                        }}
                      />
                      <Label htmlFor="recommendation-alerts" className="text-gray-700">
                        Novas Recomendações
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="weekly-summary" 
                        checked={localSettings.weekly_summary}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('weekly_summary', checked);
                          }
                        }}
                      />
                      <Label htmlFor="weekly-summary" className="text-gray-700">
                        Resumo Semanal
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Canais de Notificação</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">Notificações no Navegador</h4>
                        <p className="text-sm text-gray-600">Receba notificações em tempo real no navegador</p>
                      </div>
                      <Switch 
                        checked={localSettings.browser_notifications}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('browser_notifications', checked);
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">SMS</h4>
                        <p className="text-sm text-gray-600">Receba alertas críticos por mensagem de texto</p>
                      </div>
                      <Switch 
                        checked={localSettings.sms_notifications}
                        onCheckedChange={(checked) => { 
                          if (typeof checked === 'boolean') {
                            handleLocalSettingChange('sms_notifications', checked);
                          }
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conteúdo da seção Segurança */}
            <TabsContent value="seguranca" className="space-y-6 mt-0">
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Autenticação de Dois Fatores</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">Ativar autenticação de dois fatores</h4>
                        <p className="text-sm text-gray-600">Adicione uma camada extra de segurança à sua conta</p>
                      </div>
                      <Switch 
                        checked={settings.two_factor_enabled}
                        onCheckedChange={() => setTwoFactorModalOpen(true)}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setTwoFactorModalOpen(true)}
                    >
                      {settings.two_factor_enabled ? 'Gerenciar 2FA' : 'Configurar 2FA'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Histórico de Login</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 font-medium text-gray-700">Data</th>
                          <th className="pb-2 font-medium text-gray-700">Dispositivo</th>
                          <th className="pb-2 font-medium text-gray-700">Localização</th>
                          <th className="pb-2 font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loginHistory.length > 0 ? (
                          loginHistory.map((entry) => (
                            <tr key={entry.id} className="border-b">
                              <td className="py-3 text-gray-700">{formatDate(entry.login_date)}</td>
                              <td className="py-3 text-gray-700">{entry.device_info || 'Desconhecido'}</td>
                              <td className="py-3 text-gray-700">{entry.location || 'Brasil'}</td>
                              <td className={`py-3 ${entry.success ? 'text-green-600' : 'text-red-600'}`}>
                                {entry.success ? 'Sucesso' : 'Falha'}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-3 text-gray-500 text-center">
                              Nenhum histórico de login disponível
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botão Salvar Mudanças */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Salvando...' : t('saveChanges')}
            </Button>
          </div>
        </div>
      </div>

      <TwoFactorModal 
        open={twoFactorModalOpen} 
        onOpenChange={setTwoFactorModalOpen} 
      />
    </main>
  );
};

export default SettingsPage;
