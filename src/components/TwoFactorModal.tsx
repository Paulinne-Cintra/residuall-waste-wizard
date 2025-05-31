
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useUserSettings } from '@/hooks/useUserSettings';
import { useAuth } from '@/hooks/useAuth';
import QRCode from 'qrcode';
import { Secret, TOTP } from 'otpauth';

interface TwoFactorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TwoFactorModal = ({ open, onOpenChange }: TwoFactorModalProps) => {
  const { user } = useAuth();
  const { settings, updateSettings } = useUserSettings();
  const { toast } = useToast();
  
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'method' | 'setup' | 'verify'>('method');
  const [method, setMethod] = useState<'app' | 'sms' | 'email'>('app');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !settings?.two_factor_enabled) {
      setStep('method');
    } else if (open && settings?.two_factor_enabled) {
      setStep('setup');
    }
  }, [open, settings]);

  const generateQRCode = async () => {
    if (!user?.email) return;

    try {
      // Gerar secret aleatório
      const newSecret = new Secret({ size: 20 });
      const secretString = newSecret.base32;
      
      // Criar TOTP
      const totp = new TOTP({
        issuer: 'RESIDUALL',
        label: user.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secretString,
      });

      // Gerar QR Code
      const qrUrl = await QRCode.toDataURL(totp.toString());
      
      setSecret(secretString);
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o código QR.',
        variant: 'destructive',
      });
    }
  };

  const sendCodeViaSMS = async () => {
    setLoading(true);
    try {
      // Simular envio de SMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Código enviado',
        description: 'Um código de verificação foi enviado para seu telefone.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o código SMS.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendCodeViaEmail = async () => {
    setLoading(true);
    try {
      // Simular envio de email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: 'Código enviado',
        description: 'Um código de verificação foi enviado para seu email.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar o código por email.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupMethod = async () => {
    if (method === 'app') {
      await generateQRCode();
      setStep('setup');
    } else if (method === 'sms') {
      await sendCodeViaSMS();
      setStep('verify');
    } else if (method === 'email') {
      await sendCodeViaEmail();
      setStep('verify');
    }
  };

  const verifyCode = async () => {
    if (!verificationCode) return;

    setLoading(true);

    try {
      if (method === 'app' && secret) {
        // Verificar TOTP para app autenticador
        const totp = new TOTP({
          issuer: 'RESIDUALL',
          label: user?.email || '',
          algorithm: 'SHA1',
          digits: 6,
          period: 30,
          secret: secret,
        });

        const delta = totp.validate({ token: verificationCode, window: 1 });
        
        if (delta === null) {
          toast({
            title: 'Código inválido',
            description: 'O código digitado está incorreto. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }
      } else {
        // Para SMS e Email, simular verificação
        if (verificationCode !== '123456') {
          toast({
            title: 'Código inválido',
            description: 'O código digitado está incorreto. Tente novamente.',
            variant: 'destructive',
          });
          return;
        }
      }

      // Código válido - salvar configuração
      const success = await updateSettings({
        two_factor_enabled: true,
        two_factor_secret: method === 'app' ? secret : null,
      });

      if (success) {
        toast({
          title: 'Sucesso!',
          description: 'Autenticação de dois fatores ativada com sucesso.',
        });
        onOpenChange(false);
        resetModal();
      }
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao verificar o código. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    
    try {
      const success = await updateSettings({
        two_factor_enabled: false,
        two_factor_secret: null,
      });

      if (success) {
        toast({
          title: 'Desativado',
          description: 'Autenticação de dois fatores foi desativada.',
        });
        onOpenChange(false);
        resetModal();
      }
    } catch (error) {
      console.error('Erro ao desativar 2FA:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('method');
    setMethod('app');
    setVerificationCode('');
    setSecret('');
    setQrCodeUrl('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {settings?.two_factor_enabled 
              ? 'Gerenciar Autenticação de Dois Fatores'
              : 'Configurar Autenticação de Dois Fatores'
            }
          </DialogTitle>
        </DialogHeader>

        {settings?.two_factor_enabled ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              A autenticação de dois fatores está ativada em sua conta.
            </p>
            <Button 
              variant="destructive" 
              onClick={disable2FA}
              disabled={loading}
            >
              {loading ? 'Desativando...' : 'Desativar 2FA'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {step === 'method' && (
              <>
                <p className="text-sm text-gray-600">
                  Escolha como você gostaria de receber os códigos de verificação:
                </p>
                
                <RadioGroup value={method} onValueChange={(value) => setMethod(value as 'app' | 'sms' | 'email')}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="app" id="app" />
                    <Label htmlFor="app">Aplicativo Autenticador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sms" id="sms" />
                    <Label htmlFor="sms">SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                </RadioGroup>

                <Button onClick={setupMethod} className="w-full">
                  Continuar
                </Button>
              </>
            )}

            {step === 'setup' && method === 'app' && (
              <>
                <p className="text-sm text-gray-600">
                  Escaneie o código QR abaixo com seu aplicativo autenticador:
                </p>
                
                {qrCodeUrl && (
                  <div className="flex justify-center">
                    <img src={qrCodeUrl} alt="QR Code para 2FA" className="border rounded" />
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center">
                  Código manual: {secret}
                </p>

                <Button onClick={() => setStep('verify')} className="w-full">
                  Continuar
                </Button>
              </>
            )}

            {step === 'verify' && (
              <>
                <p className="text-sm text-gray-600">
                  Digite o código de 6 dígitos {method === 'app' ? 'gerado pelo seu aplicativo autenticador' : 'enviado para você'}:
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Código de Verificação</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                </div>

                {method !== 'app' && (
                  <Button 
                    variant="outline" 
                    onClick={method === 'sms' ? sendCodeViaSMS : sendCodeViaEmail}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Enviando...' : 'Reenviar código'}
                  </Button>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setStep(method === 'app' ? 'setup' : 'method')}>
                    Voltar
                  </Button>
                  <Button 
                    onClick={verifyCode} 
                    disabled={verificationCode.length !== 6 || loading}
                    className="flex-1"
                  >
                    {loading ? 'Verificando...' : 'Verificar e Ativar'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
