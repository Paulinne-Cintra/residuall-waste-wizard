
import React, { useState, useEffect } from 'react';
import { Check, CreditCard, QrCode } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import QRCodeLib from 'qrcode';
import AnimatedBackground from '@/components/AnimatedBackground';

const PaymentPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'enterprise'>('premium');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    generatePixQRCode();
  }, [selectedPlan]);

  const generatePixQRCode = async () => {
    const pixKey = '73988372697';
    const amount = selectedPlan === 'premium' ? '49.90' : '99.90';
    const description = selectedPlan === 'premium' ? 'Plano Premium RESIDUALL' : 'Plano Enterprise RESIDUALL';
    
    // Simplified PIX payload for demonstration
    const pixPayload = `00020101021126580014br.gov.bcb.pix0136${pixKey}5204000053039865406${amount}5802BR5925RESIDUALL GESTAO DE OBRAS6009SAO PAULO62070503***6304`;
    
    try {
      const qrCodeUrl = await QRCodeLib.toDataURL(pixPayload, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        width: 200,
      });
      setQrCodeDataUrl(qrCodeUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
    }
  };

  const handlePayment = async (method: string) => {
    toast({
      title: "Processando pagamento...",
      description: "Aguarde enquanto processamos seu pagamento.",
    });

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Pagamento realizado com sucesso!",
        description: "Sua assinatura foi ativada. Redirecionando...",
      });
      
      setTimeout(() => {
        navigate('/dashboard/confirmation');
      }, 2000);
    }, 3000);
  };

  const plans = {
    premium: {
      name: 'Premium',
      price: 'R$ 49,90',
      period: '/mês',
      features: [
        'Até 10 projetos simultâneos',
        'Controle de desperdício avançado',
        'Relatórios detalhados',
        'Suporte por email',
        'Dashboard completo'
      ]
    },
    enterprise: {
      name: 'Enterprise',
      price: 'R$ 99,90',
      period: '/mês',
      features: [
        'Projetos ilimitados',
        'Controle de desperdício avançado',
        'Relatórios customizáveis',
        'Suporte prioritário 24/7',
        'API de integração',
        'Gestão de equipes',
        'Análises preditivas'
      ]
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Finalizar Assinatura</h1>
            <p className="text-xl opacity-90">Escolha seu plano e método de pagamento</p>
          </div>

          {/* Plan Selection */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {Object.entries(plans).map(([planKey, plan]) => (
              <Card 
                key={planKey}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPlan === planKey 
                    ? 'ring-2 ring-residuall-green bg-residuall-green/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedPlan(planKey as 'premium' | 'enterprise')}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedPlan === planKey 
                        ? 'bg-residuall-green border-residuall-green' 
                        : 'border-gray-300'
                    }`}>
                      {selectedPlan === planKey && (
                        <Check className="w-full h-full text-white p-0.5" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-residuall-green">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-4 w-4 text-residuall-green mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Methods */}
          <Card className="backdrop-blur-sm bg-white/95">
            <CardHeader>
              <CardTitle>Método de Pagamento</CardTitle>
              <CardDescription>
                Escolha como deseja pagar sua assinatura {plans[selectedPlan].name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pix" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pix" className="flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    PIX
                  </TabsTrigger>
                  <TabsTrigger value="credit" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Cartão de Crédito
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pix" className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="bg-white p-6 rounded-lg border border-gray-200 inline-block">
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code PIX" className="mx-auto" />
                      ) : (
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-500">Gerando QR Code...</span>
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p className="font-medium">Valor: {plans[selectedPlan].price}</p>
                      <p>Escaneie o QR Code com seu app de banco ou carteira digital</p>
                    </div>
                    <Button 
                      onClick={() => handlePayment('pix')}
                      className="w-full bg-residuall-green hover:bg-residuall-green/90"
                      size="lg"
                    >
                      Confirmar Pagamento PIX
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="credit" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Validade
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome no Cartão
                      </label>
                      <input
                        type="text"
                        placeholder="Seu Nome Completo"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-residuall-green"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => handlePayment('credit')}
                    className="w-full bg-residuall-green hover:bg-residuall-green/90"
                    size="lg"
                  >
                    Pagar {plans[selectedPlan].price}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="text-center text-white/80 text-sm">
            <p>🔒 Transação 100% segura e criptografada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
