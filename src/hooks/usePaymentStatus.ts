
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PaymentStatus {
  hasActivePlan: boolean;
  selectedPlan: string | null;
  paymentCompleted: boolean;
  loading: boolean;
  subscriptionActive: boolean;
  subscriptionExpiresAt: string | null;
}

export const usePaymentStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>({
    hasActivePlan: false,
    selectedPlan: null,
    paymentCompleted: false,
    loading: true,
    subscriptionActive: false,
    subscriptionExpiresAt: null,
  });

  const checkPaymentStatus = async () => {
    if (!user) {
      setStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      console.log('Checking payment status for user:', user.id);
      
      // Check secure payment status from database
      const { data: paymentStatus, error } = await supabase
        .from('payment_status')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar status de pagamento:', error);
        setStatus(prev => ({ ...prev, loading: false }));
        return;
      }

      // Check if user has admin role as fallback
      const { data: profile } = await supabase
        .from('profiles')
        .select('professional_role')
        .eq('id', user.id)
        .maybeSingle();

      const isAdmin = profile?.professional_role === 'admin';
      const hasValidPayment = paymentStatus?.payment_completed && paymentStatus?.subscription_active;
      const isSubscriptionActive = paymentStatus?.subscription_expires_at ? 
        new Date(paymentStatus.subscription_expires_at) > new Date() : false;

      const hasActivePlan = isAdmin || (hasValidPayment && isSubscriptionActive);

      setStatus({
        hasActivePlan,
        selectedPlan: paymentStatus?.plan_id || null,
        paymentCompleted: paymentStatus?.payment_completed || false,
        subscriptionActive: paymentStatus?.subscription_active || false,
        subscriptionExpiresAt: paymentStatus?.subscription_expires_at || null,
        loading: false,
      });

      console.log('Payment status checked:', {
        hasActivePlan,
        paymentCompleted: paymentStatus?.payment_completed,
        subscriptionActive: paymentStatus?.subscription_active,
        isAdmin
      });
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  const markPaymentCompleted = async (planId: string) => {
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }

    try {
      console.log('Marking payment as completed for user:', user.id, 'plan:', planId);
      
      // Create or update payment status in database
      const { error } = await supabase
        .from('payment_status')
        .upsert({
          user_id: user.id,
          plan_id: planId,
          plan_name: planId,
          payment_completed: true,
          payment_date: new Date().toISOString(),
          subscription_active: true,
          subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        });

      if (error) {
        console.error('Erro ao salvar status de pagamento:', error);
        return false;
      }

      // Clear any old localStorage data
      localStorage.removeItem(`payment_completed_${user.id}`);
      localStorage.removeItem(`selected_plan_${user.id}`);

      // Refresh payment status
      await checkPaymentStatus();
      return true;
    } catch (error) {
      console.error('Erro ao marcar pagamento como completo:', error);
      return false;
    }
  };

  const clearPaymentStatus = async () => {
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }

    try {
      console.log('Clearing payment status for user:', user.id);
      
      // Update payment status in database
      const { error } = await supabase
        .from('payment_status')
        .update({
          payment_completed: false,
          subscription_active: false,
          subscription_expires_at: null,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Erro ao limpar status de pagamento:', error);
        return false;
      }

      // Clear localStorage as well
      localStorage.removeItem(`payment_completed_${user.id}`);
      localStorage.removeItem(`selected_plan_${user.id}`);

      // Refresh payment status
      await checkPaymentStatus();
      return true;
    } catch (error) {
      console.error('Erro ao limpar status de pagamento:', error);
      return false;
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
