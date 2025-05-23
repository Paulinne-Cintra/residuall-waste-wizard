
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("geral");
  
  // Settings state
  const [language, setLanguage] = useState("pt-br");
  const [timezone, setTimezone] = useState("america-sp");
  const [theme, setTheme] = useState("claro");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [systemAlerts, setSystemAlerts] = useState(false);
  const [projectUpdates, setProjectUpdates] = useState(true);
  const [recommendationAlerts, setRecommendationAlerts] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(false);
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const html = document.documentElement;
      
      if (theme === "escuro") {
        html.classList.add("dark");
      } else if (theme === "claro") {
        html.classList.remove("dark");
      } else if (theme === "sistema") {
        // Check system preference
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when "sistema" is selected
    if (theme === "sistema") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener("change", handleChange);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);
  
  const handleSaveChanges = () => {
    toast({
      title: "Alterações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
      variant: "default",
    });
  };

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
                    Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notificacoes" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 text-gray-600 data-[state=inactive]:hover:bg-gray-50"
                  >
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seguranca" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900 data-[state=active]:border-l-4 data-[state=active]:border-blue-500 text-gray-600 data-[state=inactive]:hover:bg-gray-50"
                  >
                    Segurança
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
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Idioma e Fuso Horário</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-gray-700">Idioma</Label>
                        <Select value={language} onValueChange={setLanguage}>
                          <SelectTrigger id="language" className="w-full">
                            <SelectValue placeholder="Selecione o idioma" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                            <SelectItem value="en-us">English (US)</SelectItem>
                            <SelectItem value="es">Español</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timezone" className="text-gray-700">Fuso Horário</Label>
                        <Select value={timezone} onValueChange={setTimezone}>
                          <SelectTrigger id="timezone" className="w-full">
                            <SelectValue placeholder="Selecione o fuso horário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="america-sp">América/São Paulo (GMT-3)</SelectItem>
                            <SelectItem value="america-ny">América/Nova York (GMT-5)</SelectItem>
                            <SelectItem value="europe-london">Europa/Londres (GMT+0)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Tema da Interface</h3>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-3">Selecione o tema de exibição do sistema:</p>
                    
                    <ToggleGroup type="single" value={theme} onValueChange={(value) => value && setTheme(value)}>
                      <ToggleGroupItem value="claro" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        Claro
                      </ToggleGroupItem>
                      <ToggleGroupItem value="escuro" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        Escuro
                      </ToggleGroupItem>
                      <ToggleGroupItem value="sistema" className="data-[state=on]:bg-blue-500 data-[state=on]:text-white">
                        Sistema
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
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                      <Label htmlFor="email-notifications" className="text-gray-700">
                        Notificações por E-mail
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="system-alerts" 
                        checked={systemAlerts}
                        onCheckedChange={setSystemAlerts}
                      />
                      <Label htmlFor="system-alerts" className="text-gray-700">
                        Alertas de Sistema
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="project-updates" 
                        checked={projectUpdates}
                        onCheckedChange={setProjectUpdates}
                      />
                      <Label htmlFor="project-updates" className="text-gray-700">
                        Atualizações de Projeto
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recommendation-alerts" 
                        checked={recommendationAlerts}
                        onCheckedChange={setRecommendationAlerts}
                      />
                      <Label htmlFor="recommendation-alerts" className="text-gray-700">
                        Novas Recomendações
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="weekly-summary" 
                        checked={weeklySummary}
                        onCheckedChange={setWeeklySummary}
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
                        checked={browserNotifications}
                        onCheckedChange={setBrowserNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-700">SMS</h4>
                        <p className="text-sm text-gray-600">Receba alertas críticos por mensagem de texto</p>
                      </div>
                      <Switch 
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
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
                        checked={twoFactorAuth}
                        onCheckedChange={setTwoFactorAuth}
                      />
                    </div>
                    
                    <Button variant="outline" className="mt-4">
                      Configurar
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
                        <tr className="border-b">
                          <td className="py-3 text-gray-700">22/05/2023 08:32</td>
                          <td className="py-3 text-gray-700">Chrome / Windows</td>
                          <td className="py-3 text-gray-700">São Paulo, Brasil</td>
                          <td className="py-3 text-green-600">Sucesso</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 text-gray-700">21/05/2023 17:45</td>
                          <td className="py-3 text-gray-700">Safari / iOS</td>
                          <td className="py-3 text-gray-700">São Paulo, Brasil</td>
                          <td className="py-3 text-green-600">Sucesso</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-gray-700">19/05/2023 14:12</td>
                          <td className="py-3 text-gray-700">Firefox / macOS</td>
                          <td className="py-3 text-gray-700">Rio de Janeiro, Brasil</td>
                          <td className="py-3 text-red-600">Falha</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Botão Salvar Alterações */}
          <div className="flex justify-end mt-6">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSaveChanges}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
