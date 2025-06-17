
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Camera, 
  Save, 
  Key, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  FileText, 
  Lock,
  Shield,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();
  const { 
    profile, 
    loginHistory, 
    paymentStatus,
    loading, 
    updating, 
    uploadingAvatar, 
    changingPassword,
    updateProfile, 
    uploadAvatar, 
    changePassword,
    refetch
  } = useProfile();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    professional_role: '',
    biografia: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Atualizar formData quando o profile carregar
  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        professional_role: profile.professional_role || '',
        biografia: profile.biografia || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name.trim()) {
      return;
    }

    await updateProfile(formData);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadAvatar(file);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      return;
    }

    const success = await changePassword(passwordData.newPassword);
    
    if (success) {
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader className="text-center">
              <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-6 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - profile not found
  if (!profile && !loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Erro ao carregar perfil
            </h3>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar as informações do seu perfil.
            </p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas informações pessoais e configurações de conta
          </p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Recarregar
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Avatar e ações principais */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader className="text-center">
              <div className="relative mx-auto">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || 'Avatar'} />
                  <AvatarFallback className="bg-residuall-green text-white text-2xl">
                    {profile?.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                  onClick={handleAvatarClick}
                  disabled={uploadingAvatar}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              
              <CardTitle className="text-xl">{profile?.full_name || 'Nome não informado'}</CardTitle>
              <CardDescription>{profile?.professional_role || 'Função não definida'}</CardDescription>
              
              {uploadingAvatar && (
                <p className="text-sm text-blue-600">Enviando foto...</p>
              )}
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Separator />
              
              <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Alterar Senha
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={handlePasswordChange}>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                      <DialogDescription>
                        Digite sua nova senha. Ela deve ter pelo menos 6 caracteres.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          required
                          minLength={6}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                          minLength={6}
                        />
                        {passwordData.newPassword && passwordData.confirmPassword && 
                         passwordData.newPassword !== passwordData.confirmPassword && (
                          <p className="text-sm text-red-600">As senhas não coincidem</p>
                        )}
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsPasswordModalOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={changingPassword || passwordData.newPassword !== passwordData.confirmPassword || passwordData.newPassword.length < 6}
                        className="bg-residuall-green hover:bg-residuall-green/90"
                      >
                        {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Status do Plano */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Status do Plano
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStatus ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plano:</span>
                    <Badge variant={paymentStatus.subscription_active ? "default" : "secondary"}>
                      {paymentStatus.plan_name || 'Não definido'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {paymentStatus.subscription_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inativo
                      </Badge>
                    )}
                  </div>
                  {paymentStatus.subscription_expires_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Expira em:</span>
                      <span className="text-xs">{formatDate(paymentStatus.subscription_expires_at)}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Carregando status do plano...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Formulário de informações pessoais */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e profissionais
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Nome Completo *
                    </Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Digite seu nome completo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="seu.email@exemplo.com"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone_number" className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Telefone
                    </Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="professional_role" className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Função Profissional
                    </Label>
                    <Input
                      id="professional_role"
                      value={formData.professional_role}
                      onChange={(e) => handleInputChange('professional_role', e.target.value)}
                      placeholder="Ex: Engenheiro Civil, Arquiteto"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="biografia" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Biografia
                  </Label>
                  <Textarea
                    id="biografia"
                    value={formData.biografia}
                    onChange={(e) => handleInputChange('biografia', e.target.value)}
                    placeholder="Conte um pouco sobre você e sua experiência profissional"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={updating || !formData.full_name.trim()}
                    className="bg-residuall-green hover:bg-residuall-green/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updating ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Histórico de Login */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Histórico de Acessos
              </CardTitle>
              <CardDescription>
                Últimos acessos à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loginHistory.length > 0 ? (
                <div className="space-y-3">
                  {loginHistory.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {entry.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{formatDate(entry.login_date)}</p>
                          <p className="text-xs text-gray-500">
                            {entry.device_info || 'Dispositivo desconhecido'} • {entry.location || 'Local não identificado'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={entry.success ? "default" : "destructive"}>
                        {entry.success ? 'Sucesso' : 'Falha'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum histórico de acesso disponível
                </p>
              )}
            </CardContent>
          </Card>

          {/* Informações de Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>
                Informações sobre a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-1">Dados Criptografados</h4>
                  <p className="text-sm text-green-700">
                    Todas as suas informações são armazenadas de forma segura e criptografada.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1">Privacidade Garantida</h4>
                  <p className="text-sm text-blue-700">
                    Seus dados não são compartilhados com terceiros sem sua autorização.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
