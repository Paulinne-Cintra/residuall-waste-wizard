import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("geral");
  
  const handleSaveChanges = () => {
    toast({
      title: "Alterações salvas",
      description: "Suas configurações foram atualizadas com sucesso.",
      // Utilizando a variante "default" em vez de "success" já que só temos default e destructive disponíveis
      variant: "default",
    });
  };

  return (
    // A página agora começa diretamente com o conteúdo, pois o layout principal (sidebar, header)
    // é fornecido pelo DashboardLayout que a envolve no App.tsx.
    // A classe 'p-6' no main já é a responsabilidade do DashboardLayout, mas se você
    // quiser um padding específico para o conteúdo interno da SettingsPage, pode adicionar uma div.
    <main className="p-6"> {/* Mantemos o p-6 para o padding interno da página */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Menu de Subseções (Coluna Esquerda) */}
        <div className="md:w-1/4 lg:w-1/5">
          <Card className="shadow-residuall">
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
                    className="justify-start px-4 py-3 data-[state=active]:bg-residuall-gray-light data-[state=active]:text-residuall-gray-tableText data-[state=active]:border-l-4 data-[state=active]:border-residuall-green text-residuall-gray data-[state=inactive]:hover:bg-residuall-gray-light/50"
                  >
                    Geral
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notificacoes" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-residuall-gray-light data-[state=active]:text-residuall-gray-tableText data-[state=active]:border-l-4 data-[state=active]:border-residuall-green text-residuall-gray data-[state=inactive]:hover:bg-residuall-gray-light/50"
                  >
                    Notificações
                  </TabsTrigger>
                  <TabsTrigger 
                    value="seguranca" 
                    className="justify-start px-4 py-3 data-[state=active]:bg-residuall-gray-light data-[state=active]:text-residuall-gray-tableText data-[state=active]:border-l-4 data-[state=active]:border-residuall-green text-residuall-gray data-[state=inactive]:hover:bg-residuall-gray-light/50"
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
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Idioma e Fuso Horário</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="language" className="text-residuall-gray-tableText">Idioma</Label>
                        <Select defaultValue="pt-br">
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
                        <Label htmlFor="timezone" className="text-residuall-gray-tableText">Fuso Horário</Label>
                        <Select defaultValue="america-sp">
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

              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Tema da Interface</h3>
                  
                  <div>
                    <p className="text-sm text-residuall-gray mb-3">Selecione o tema de exibição do sistema:</p>
                    
                    <ToggleGroup type="single" defaultValue="claro">
                      <ToggleGroupItem value="claro" className="data-[state=on]:bg-residuall-green data-[state=on]:text-white">
                        Claro
                      </ToggleGroupItem>
                      <ToggleGroupItem value="escuro" className="data-[state=on]:bg-residuall-green data-[state=on]:text-white">
                        Escuro
                      </ToggleGroupItem>
                      <ToggleGroupItem value="sistema" className="data-[state=on]:bg-residuall-green data-[state=on]:text-white">
                        Sistema
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conteúdo da seção Notificações */}
            <TabsContent value="notificacoes" className="space-y-6 mt-0">
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Preferências de Notificação</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="email-notifications" />
                      <Label htmlFor="email-notifications" className="text-residuall-gray-tableText">
                        Notificações por E-mail
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="system-alerts" />
                      <Label htmlFor="system-alerts" className="text-residuall-gray-tableText">
                        Alertas de Sistema
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="project-updates" defaultChecked />
                      <Label htmlFor="project-updates" className="text-residuall-gray-tableText">
                        Atualizações de Projeto
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="recommendation-alerts" defaultChecked />
                      <Label htmlFor="recommendation-alerts" className="text-residuall-gray-tableText">
                        Novas Recomendações
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox id="weekly-summary" />
                      <Label htmlFor="weekly-summary" className="text-residuall-gray-tableText">
                        Resumo Semanal
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Canais de Notificação</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-residuall-gray-tableText">Notificações no Navegador</h4>
                        <p className="text-sm text-residuall-gray">Receba notificações em tempo real no navegador</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-residuall-gray-tableText">SMS</h4>
                        <p className="text-sm text-residuall-gray">Receba alertas críticos por mensagem de texto</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conteúdo da seção Segurança */}
            <TabsContent value="seguranca" className="space-y-6 mt-0">
              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Autenticação de Dois Fatores</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-residuall-gray-tableText">Ativar autenticação de dois fatores</h4>
                        <p className="text-sm text-residuall-gray">Adicione uma camada extra de segurança à sua conta</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Button variant="outline" className="mt-4">
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-residuall">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-residuall-gray-tableText">Histórico de Login</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 font-medium text-residuall-gray-tableText">Data</th>
                          <th className="pb-2 font-medium text-residuall-gray-tableText">Dispositivo</th>
                          <th className="pb-2 font-medium text-residuall-gray-tableText">Localização</th>
                          <th className="pb-2 font-medium text-residuall-gray-tableText">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 text-residuall-gray-tableText">22/05/2023 08:32</td>
                          <td className="py-3 text-residuall-gray-tableText">Chrome / Windows</td>
                          <td className="py-3 text-residuall-gray-tableText">São Paulo, Brasil</td>
                          <td className="py-3 text-green-600">Sucesso</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 text-residuall-gray-tableText">21/05/2023 17:45</td>
                          <td className="py-3 text-residuall-gray-tableText">Safari / iOS</td>
                          <td className="py-3 text-residuall-gray-tableText">São Paulo, Brasil</td>
                          <td className="py-3 text-green-600">Sucesso</td>
                        </tr>
                        <tr>
                          <td className="py-3 text-residuall-gray-tableText">19/05/2023 14:12</td>
                          <td className="py-3 text-residuall-gray-tableText">Firefox / macOS</td>
                          <td className="py-3 text-residuall-gray-tableText">Rio de Janeiro, Brasil</td>
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
              className="bg-residuall-brown hover:bg-residuall-brown/90 text-white"
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
