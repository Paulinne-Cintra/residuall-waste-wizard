import { useLocation } from "react-router-dom";
import { Lock, Mail, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Removidas as importações de SidebarDashboard e DashboardHeader
// import SidebarDashboard from "@/components/SidebarDashboard";
// import DashboardHeader from "@/components/DashboardHeader";

const ProfilePage = () => {
  const location = useLocation();

  return (
    // A página agora começa diretamente com o conteúdo da área principal.
    // O layout (sidebar e header) é providenciado pelo DashboardLayout no App.tsx.
    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information Card */}
        <Card className="shadow-residuall hover:shadow-residuall-hover transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-residuall-gray-tableText">Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-residuall-green flex items-center justify-center text-white">
                <User size={40} />
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-residuall-gray-tableText">
                  Nome Completo
                </label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    defaultValue="Engª. Cristiana Soares"
                    className="pl-10 input-field"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-residuall-gray" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-residuall-gray-tableText">
                  E-mail
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    defaultValue="cristiana@residuall.com"
                    className="pl-10 input-field"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-residuall-gray" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-residuall-gray-tableText">
                  Telefone
                </label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    defaultValue="(11) 98765-4321"
                    className="pl-10 input-field"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone size={18} className="text-residuall-gray" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="block text-sm font-medium text-residuall-gray-tableText">
                  Cargo/Função
                </label>
                <Input
                  id="role"
                  type="text"
                  value="Administrador"
                  readOnly
                  className="bg-gray-100 input-field"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="shadow-residuall hover:shadow-residuall-hover transition-all">
          <CardHeader>
            <CardTitle className="text-xl text-residuall-gray-tableText">Segurança da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="current-password" className="block text-sm font-medium text-residuall-gray-tableText">
                Senha Atual
              </label>
              <div className="relative">
                <Input
                  id="current-password"
                  type="password"
                  className="pl-10 input-field"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-residuall-gray" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-medium text-residuall-gray-tableText">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="new-password"
                  type="password"
                  className="pl-10 input-field"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-residuall-gray" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-medium text-residuall-gray-tableText">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type="password"
                  className="pl-10 input-field"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-residuall-gray" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            className="order-2 sm:order-1 border border-gray-300 text-residuall-gray-tableText hover:bg-gray-50 hover:text-residuall-gray-tableText"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="order-1 sm:order-2 bg-residuall-brown hover:bg-residuall-brown/90 text-white"
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
