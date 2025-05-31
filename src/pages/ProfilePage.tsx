
import { useState } from "react";
import { Lock, Mail, Phone, User, Camera, Save, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ProfilePage = () => {
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Engª. Cristiana Soares",
    email: "cristiana@residuall.com",
    phone: "(11) 98765-4321",
    role: "Administrador",
    avatarUrl: "/placeholder.svg"
  });

  const [editData, setEditData] = useState({ ...profileData });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      console.log('Salvando dados do perfil:', editData);
      
      // Aqui você pode adicionar a lógica para salvar no Supabase
      // await updateProfile({
      //   name: editData.name,
      //   phone: editData.phone,
      //   avatar_url: editData.avatarUrl
      // });

      setProfileData({ ...editData });
      setIsEditing(false);
      
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Alterando senha...');
      // Aqui você pode adicionar a lógica para alterar senha no Supabase
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso!",
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar senha. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Arquivo selecionado:', file);
      // Aqui você pode adicionar a lógica para upload da foto
      // Por enquanto, vamos criar uma URL temporária para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({ ...prev, avatarUrl: result }));
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Foto selecionada",
        description: "Lembre-se de salvar as alterações para confirmar.",
      });
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Personal Information Card */}
        <Card className="shadow-residuall hover:shadow-residuall-hover transition-all">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-residuall-gray-tableText">Informações Pessoais</CardTitle>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" className="flex items-center gap-2">
                <User size={16} />
                Editar Perfil
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="flex items-center gap-2 bg-residuall-brown hover:bg-residuall-brown/90">
                  <Save size={16} />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                  <X size={16} />
                  Cancelar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-residuall-green flex items-center justify-center text-white overflow-hidden">
                  {editData.avatarUrl && editData.avatarUrl !== "/placeholder.svg" ? (
                    <img 
                      src={editData.avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} />
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-residuall-brown hover:bg-residuall-brown/90 text-white p-2 rounded-full cursor-pointer">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
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
                    value={isEditing ? editData.name : profileData.name}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    readOnly={!isEditing}
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
                    value={isEditing ? editData.email : profileData.email}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    readOnly={!isEditing}
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
                    value={isEditing ? editData.phone : profileData.phone}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, phone: e.target.value }))}
                    className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                    readOnly={!isEditing}
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
                  value={profileData.role}
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
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
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
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
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
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="pl-10 input-field"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-residuall-gray" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handlePasswordChange}
                className="bg-residuall-brown hover:bg-residuall-brown/90 text-white"
                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              >
                Alterar Senha
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default ProfilePage;
