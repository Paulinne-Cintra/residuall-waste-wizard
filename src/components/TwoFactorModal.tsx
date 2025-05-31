
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && !settings?.two_factor_enabled) {
      generateQRCode();
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
      setStep('setup');
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível gerar o código QR.',
        variant: 'destructive',
      });
    }
  };

  const verifyCode = async () => {
    if (!verificationCode || !secret) return;

    setLoading(true);

    try {
      // Criar TOTP para verificação
      const totp = new TOTP({
        issuer: 'RESIDUALL',
        label: user?.email || '',
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: secret,
      });

      // Verificar token
      const delta = totp.validate({ token: verificationCode, window: 1 });
      
      if (delta !== null) {
        // Token válido - salvar configuração
        const success = await updateSettings({
          two_factor_enabled: true,
          two_factor_secret: secret,
        });

        if (success) {
          toast({
            title: 'Sucesso!',
            description: 'Autenticação de dois fatores ativada com sucesso.',
          });
          onOpenChange(false);
          setVerificationCode('');
          setStep('setup');
        }
      } else {
        toast({
          title: 'Código inválido',
          description: 'O código digitado está incorreto. Tente novamente.',
          variant: 'destructive',
        });
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
      }
    } catch (error) {
      console.error('Erro ao desativar 2FA:', error);
    } finally {
      setLoading(false);
    }
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
            {step === 'setup' && (
              <>
                <p className="text-sm text-gray-600">
                  Escaneie o código QR abaixo com seu aplicativo autenticador (Google Authenticator, Authy, etc.):
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
                  Digite o código de 6 dígitos gerado pelo seu aplicativo autenticador:
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

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setStep('setup')}>
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
