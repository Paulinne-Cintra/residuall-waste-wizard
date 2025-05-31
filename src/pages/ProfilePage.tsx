
import { useState, useEffect } from "react";
import { Lock, Mail, Phone, User, Camera, Save, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const ProfilePage = () => {
  const { user } = useAuth();
  const { profile, loading, updating, uploadingAvatar, updateProfile, uploadAvatar, changePassword } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    phone_number: "",
    cargo: "",
    biografia: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Atualizar dados de edição quando o perfil carrega
  useEffect(() => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        cargo: profile.cargo || "",
        biografia: profile.biografia || ""
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditData({
        full_name: profile.full_name || "",
        phone_number: profile.phone_number || "",
        cargo: profile.cargo || "",
        biografia: profile.biografia || ""
      });
    }
  };

  const handleSave = async () => {
    const success = await updateProfile(editData);
    if (success) {
      setIsEditing(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }

    if (passwordData.newPassword.length < 6) {
      return;
    }

    const success = await changePassword(passwordData.newPassword);
    if (success) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Validar tamanho (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      await uploadAvatar(file);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  if (loading) {
    return (
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-residuall-green"></div>
        </div>
      </main>
    );
  }

  return (
    <ProtectedRoute>
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
                  <Button 
                    onClick={handleSave} 
                    disabled={updating}
                    className="flex items-center gap-2 bg-residuall-brown hover:bg-residuall-brown/90"
                  >
                    <Save size={16} />
                    {updating ? 'Salvando...' : 'Salvar'}
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
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  {isEditing && (
                    <label className={`absolute bottom-0 right-0 bg-residuall-brown hover:bg-residuall-brown/90 text-white p-2 rounded-full cursor-pointer ${uploadingAvatar ? 'opacity-50' : ''}`}>
                      <Camera size={16} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                    </label>
                  )}
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    </div>
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
                      value={isEditing ? editData.full_name : profile?.full_name || ''}
                      onChange={(e) => isEditing && setEditData(prev => ({ ...prev, full_name: e.target.value }))}
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
                      value={profile?.email || user?.email || ''}
                      className="pl-10 input-field bg-gray-50"
                      readOnly
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-residuall-gray" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">O email não pode ser alterado</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-residuall-gray-tableText">
                    Telefone
                  </label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      value={isEditing ? editData.phone_number : profile?.phone_number || ''}
                      onChange={(e) => isEditing && setEditData(prev => ({ ...prev, phone_number: e.target.value }))}
                      className={`pl-10 input-field ${!isEditing ? 'bg-gray-50' : ''}`}
                      readOnly={!isEditing}
                      placeholder="(11) 99999-9999"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-residuall-gray" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="cargo" className="block text-sm font-medium text-residuall-gray-tableText">
                    Cargo/Função
                  </label>
                  {isEditing ? (
                    <Select 
                      value={editData.cargo} 
                      onValueChange={(value) => setEditData(prev => ({ ...prev, cargo: value }))}
                    >
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Selecione seu cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arquiteto">Arquiteto(a)</SelectItem>
                        <SelectItem value="engenheiro">Engenheiro(a)</SelectItem>
                        <SelectItem value="tecnico">Técnico(a)</SelectItem>
                        <SelectItem value="estudante">Estudante</SelectItem>
                        <SelectItem value="gerente">Gerente de Projeto</SelectItem>
                        <SelectItem value="consultor">Consultor(a)</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="cargo"
                      type="text"
                      value={profile?.cargo || ''}
                      readOnly
                      className="bg-gray-50 input-field"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="biografia" className="block text-sm font-medium text-residuall-gray-tableText">
                    Biografia
                  </label>
                  <Textarea
                    id="biografia"
                    value={isEditing ? editData.biografia : profile?.biografia || ''}
                    onChange={(e) => isEditing && setEditData(prev => ({ ...prev, biografia: e.target.value }))}
                    className={`input-field resize-none ${!isEditing ? 'bg-gray-50' : ''}`}
                    readOnly={!isEditing}
                    placeholder="Fale um pouco sobre você e sua experiência profissional..."
                    maxLength={300}
                    rows={3}
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-500">
                      {editData.biografia.length}/300 caracteres
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-residuall-gray-tableText">
                    Membro desde
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={profile?.created_at ? `${formatDate(profile.created_at)}` : 'Data não disponível'}
                      readOnly
                      className="pl-10 bg-gray-100 input-field"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-residuall-gray" />
                    </div>
                  </div>
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
                    placeholder="Digite sua senha atual"
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
                    placeholder="Digite a nova senha (min. 6 caracteres)"
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
                    placeholder="Confirme a nova senha"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-residuall-gray" />
                  </div>
                </div>
              </div>

              {passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword && (
                <p className="text-sm text-red-500">As senhas não coincidem</p>
              )}

              {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                <p className="text-sm text-red-500">A senha deve ter pelo menos 6 caracteres</p>
              )}

              <div className="pt-4">
                <Button
                  onClick={handlePasswordChange}
                  className="bg-residuall-brown hover:bg-residuall-brown/90 text-white"
                  disabled={
                    !passwordData.currentPassword || 
                    !passwordData.newPassword || 
                    !passwordData.confirmPassword ||
                    passwordData.newPassword !== passwordData.confirmPassword ||
                    passwordData.newPassword.length < 6
                  }
                >
                  Alterar Senha
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  );
};

export default ProfilePage;
