
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useUserSettings } from "@/hooks/useUserSettings";
import { TwoFactorModal } from "@/components/TwoFactorModal";
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Save, Bell, Shield } from 'lucide-react';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { settings, loginHistory, loading, saving, saveAllSettings } = useUserSettings();
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  
  // Estado local para as configurações (sem language)
  const [localSettings, setLocalSettings] = useState({
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

  const handleLocalSettingChange = (field: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    
    // Incluir language fixo como 'pt-br' ao salvar
    const settingsToSave = {
      ...localSettings,
      language: 'pt-br'
    };
    
    const success = await saveAllSettings(settingsToSave);
    if (success) {
      console.log('Configurações salvas com sucesso');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  if (loading) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">{t('loading')}</p>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{t('errorLoading')}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
          <p className="text-gray-600">Gerencie suas preferências e configurações de conta</p>
        </div>

        {/* Seção de Notificações */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Notificações</h2>
            </div>
            
            <div className="space-y-6">
              {/* Preferências de Notificação */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Preferências de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="email-notifications" 
                      checked={localSettings.email_notifications}
                      onCheckedChange={(checked) => { 
                        if (typeof checked === 'boolean') {
                          handleLocalSettingChange('email_notifications', checked);
                        }
                      }}
                    />
                    <Label htmlFor="email-notifications" className="text-gray-700 font-medium">
                      Notificações por E-mail
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="system-alerts" 
                      checked={localSettings.system_alerts}
                      onCheckedChange={(checked) => { 
                        if (typeof checked === 'boolean') {
                          handleLocalSettingChange('system_alerts', checked);
                        }
                      }}
                    />
                    <Label htmlFor="system-alerts" className="text-gray-700 font-medium">
                      Alertas de Sistema
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="project-updates" 
                      checked={localSettings.project_updates}
                      onCheckedChange={(checked) => { 
                        if (typeof checked === 'boolean') {
                          handleLocalSettingChange('project_updates', checked);
                        }
                      }}
                    />
                    <Label htmlFor="project-updates" className="text-gray-700 font-medium">
                      Atualizações de Projeto
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="recommendation-alerts" 
                      checked={localSettings.recommendation_alerts}
                      onCheckedChange={(checked) => { 
                        if (typeof checked === 'boolean') {
                          handleLocalSettingChange('recommendation_alerts', checked);
                        }
                      }}
                    />
                    <Label htmlFor="recommendation-alerts" className="text-gray-700 font-medium">
                      Novas Recomendações
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      id="weekly-summary" 
                      checked={localSettings.weekly_summary}
                      onCheckedChange={(checked) => { 
                        if (typeof checked === 'boolean') {
                          handleLocalSettingChange('weekly_summary', checked);
                        }
                      }}
                    />
                    <Label htmlFor="weekly-summary" className="text-gray-700 font-medium">
                      Resumo Semanal
                    </Label>
                  </div>
                </div>
              </div>

              {/* Canais de Notificação */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Canais de Notificação</h3>
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seção de Segurança */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">Segurança da Conta</h2>
            </div>
            
            <div className="space-y-6">
              {/* Autenticação de Dois Fatores */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">Autenticação de Dois Fatores</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
              </div>

              {/* Histórico de Login */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Histórico de Login</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-3 pr-4 font-medium text-gray-700">Data</th>
                        <th className="pb-3 pr-4 font-medium text-gray-700">Dispositivo</th>
                        <th className="pb-3 pr-4 font-medium text-gray-700">Localização</th>
                        <th className="pb-3 font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginHistory.length > 0 ? (
                        loginHistory.map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-100">
                            <td className="py-3 pr-4 text-gray-700">{formatDate(entry.login_date)}</td>
                            <td className="py-3 pr-4 text-gray-700">{entry.device_info || 'Desconhecido'}</td>
                            <td className="py-3 pr-4 text-gray-700">{entry.location || 'Brasil'}</td>
                            <td className={`py-3 font-medium ${entry.success ? 'text-green-600' : 'text-red-600'}`}>
                              {entry.success ? 'Sucesso' : 'Falha'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-gray-500 text-center">
                            Nenhum histórico de login disponível
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botão Salvar */}
        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Salvando...' : t('saveChanges')}
          </Button>
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
