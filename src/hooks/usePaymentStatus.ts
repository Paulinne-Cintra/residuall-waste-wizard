
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PaymentStatus {
  hasActivePlan: boolean;
  selectedPlan: string | null;
  paymentCompleted: boolean;
  loading: boolean;
}

export const usePaymentStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>({
    hasActivePlan: false,
    selectedPlan: null,
    paymentCompleted: false,
    loading: true,
  });

  const checkPaymentStatus = async () => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      // Verificar se existe registro de pagamento na tabela profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Erro ao verificar status de pagamento:', error);
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      // Por enquanto, simular verificação de pagamento baseado em metadata
      const hasPayment = user.user_metadata?.payment_completed === true || 
                        profile?.professional_role === 'admin' ||
                        localStorage.getItem(`payment_completed_${user.id}`) === 'true';

      const selectedPlan = localStorage.getItem(`selected_plan_${user.id}`);

      setStatus({
        hasActivePlan: hasPayment,
        selectedPlan: selectedPlan,
        paymentCompleted: hasPayment,
        loading: false,
      });
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const markPaymentCompleted = (planId: string) => {
    if (user) {
      localStorage.setItem(`payment_completed_${user.id}`, 'true');
      localStorage.setItem(`selected_plan_${user.id}`, planId);
      setStatus(prev => ({
        ...prev,
        hasActivePlan: true,
        paymentCompleted: true,
        selectedPlan: planId,
      }));
    }
  };

  const clearPaymentStatus = () => {
    if (user) {
      localStorage.removeItem(`payment_completed_${user.id}`);
      localStorage.removeItem(`selected_plan_${user.id}`);
      setStatus(prev => ({
        ...prev,
        hasActivePlan: false,
        paymentCompleted: false,
        selectedPlan: null,
      }));
    }
  };

  useEffect(() => {
    checkPaymentStatus();
  }, [user]);

  return {
    ...status,
    checkPaymentStatus,
    markPaymentCompleted,
    clearPaymentStatus,
  };
};
