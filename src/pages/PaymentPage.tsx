
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Smartphone, Copy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import AnimatedBackground from '@/components/AnimatedBackground';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { markPaymentCompleted } = usePaymentStatus();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const plan = searchParams.get('plan') as 'basic' | 'premium';
    if (plan) {
      setSelectedPlan(plan);
    }
  }, [location]);

  useEffect(() => {
    if (selectedPlan && paymentMethod === 'pix') {
      generatePixQRCode();
    }
  }, [selectedPlan, paymentMethod]);

  const generatePixQRCode = async () => {
    if (!selectedPlan) return;
    
    const pixKey = '73988372697';
    const amount = selectedPlan === 'basic' ? '49.90' : '99.90';
    const description = selectedPlan === 'basic' ? 'RESIDUALL Plano Básico' : 'RESIDUALL Plano Premium';
    
    // Generate PIX payment string
    const pixPayload = `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540${amount.length}${amount}5802BR5925RESIDUALL6009SAO PAULO62070503***6304`;
    
    try {
      const qrUrl = await QRCode.toDataURL(pixPayload, {
        errorCorrectionLevel: 'M',
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      toast.error('Erro ao gerar QR Code PIX');
    }
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedPlan) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark payment as completed
      const success = await markPaymentCompleted(selectedPlan);
      
      if (success) {
        toast.success('Pagamento confirmado com sucesso!');
        navigate('/confirmation');
      } else {
        toast.error('Erro ao confirmar pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      toast.error('Erro ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText('73988372697');
    toast.success('Chave PIX copiada!');
  };

  const plans = {
    basic: {
      name: 'Plano Básico',
      price: 'R$ 49,90',
      features: [
        'Até 5 projetos simultâneos',
        'Relatórios básicos',
        'Suporte por email',
        'Controle de desperdício',
        'Dashboard completo'
      ]
    },
    premium: {
      name: 'Plano Premium',
      price: 'R$ 99,90',
      features: [
        'Projetos ilimitados',
        'Relatórios avançados com IA',
        'Suporte prioritário',
        'Análise preditiva',
        'Integração com fornecedores',
        'Gestão de equipe completa'
      ]
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background from LoginPage */}
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Finalizar Pagamento</h1>
            <p className="text-gray-200">Complete sua assinatura e comece a usar o RESIDUALL</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedPlan && (
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-white">{plans[selectedPlan].name}</h3>
                        <p className="text-2xl font-bold text-residuall-green">{plans[selectedPlan].price}</p>
                        <p className="text-sm text-gray-300">por mês</p>
                      </div>
                      <Badge className="bg-residuall-green text-white">Recomendado</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {plans[selectedPlan].features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Check size={16} className="text-residuall-green" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between items-center text-white">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-residuall-green">
                      {selectedPlan ? plans[selectedPlan].price : 'R$ 0,00'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Método de Pagamento</CardTitle>
                <CardDescription className="text-gray-300">
                  Escolha como deseja pagar sua assinatura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Payment Method Selection */}
                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod('pix')}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      paymentMethod === 'pix' 
                        ? 'border-residuall-green bg-residuall-green/10' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-6 w-6 text-residuall-green" />
                      <div className="text-left">
                        <div className="font-medium text-white">PIX</div>
                        <div className="text-sm text-gray-300">Aprovação instantânea</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('credit')}
                    className={`w-full p-4 rounded-lg border transition-all ${
                      paymentMethod === 'credit' 
                        ? 'border-residuall-green bg-residuall-green/10' 
                        : 'border-white/20 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6 text-residuall-green" />
                      <div className="text-left">
                        <div className="font-medium text-white">Cartão de Crédito</div>
                        <div className="text-sm text-gray-300">Visa, Mastercard, Elo</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* PIX Payment */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-white mb-2">Pagamento via PIX</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        Escaneie o QR Code ou copie a chave PIX para fazer o pagamento
                      </p>
                      
                      {qrCodeUrl && (
                        <div className="bg-white p-4 rounded-lg inline-block">
                          <img src={qrCodeUrl} alt="QR Code PIX" className="mx-auto" />
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handlePaymentConfirmation}
                      disabled={isProcessing}
                      className="w-full bg-residuall-green hover:bg-residuall-green/90 text-white"
                    >
                      {isProcessing ? 'Processando...' : 'Confirmar Pagamento'}
                    </Button>
                  </div>
                )}

                {/* Credit Card Payment */}
                {paymentMethod === 'credit' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-white mb-2">Pagamento com Cartão</h3>
                      <p className="text-sm text-gray-300 mb-4">
                        Você será redirecionado para nossa plataforma de pagamento segura
                      </p>
                    </div>

                    <Button
                      onClick={handlePaymentConfirmation}
                      disabled={isProcessing}
                      className="w-full bg-residuall-green hover:bg-residuall-green/90 text-white"
                    >
                      {isProcessing ? 'Processando...' : 'Pagar com Cartão'}
                    </Button>
                  </div>
                )}

                {!paymentMethod && (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Selecione um método de pagamento acima</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate('/planos')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Voltar para Planos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
