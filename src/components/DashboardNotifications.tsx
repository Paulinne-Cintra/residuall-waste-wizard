
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  created_at: string;
  read: boolean;
}

const DashboardNotifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Buscando notificações para usuário:', user.id);

      // Buscar projetos do usuário para gerar notificações baseadas em dados reais
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, status, created_at, planned_end_date')
        .eq('user_id', user.id)
        .eq('arquivado', false)
        .order('created_at', { ascending: false })
        .limit(5);

      if (projectsError) {
        console.error('Erro ao buscar projetos para notificações:', projectsError);
        return;
      }

      // Gerar notificações baseadas nos projetos do usuário
      const generatedNotifications: Notification[] = [];
      
      if (projects && projects.length > 0) {
        // Notificação de boas-vindas para usuários com projetos
        generatedNotifications.push({
          id: `welcome-${user.id}`,
          title: 'Bem-vindo ao RESIDUALL!',
          message: `Você tem ${projects.length} projeto(s) ativo(s). Continue monitorando seus desperdícios para otimizar recursos.`,
          type: 'success',
          created_at: new Date().toISOString(),
          read: false
        });

        // Notificações específicas de projetos
        projects.forEach((project, index) => {
          if (index < 2) { // Máximo 2 notificações de projeto
            generatedNotifications.push({
              id: `project-${project.id}`,
              title: `Projeto: ${project.name}`,
              message: `Status atual: ${project.status}. Continue acompanhando o progresso.`,
              type: 'info',
              created_at: project.created_at,
              read: false
            });
          }
        });

        // Verificar projetos próximos do prazo
        const today = new Date();
        projects.forEach(project => {
          if (project.planned_end_date) {
            const endDate = new Date(project.planned_end_date);
            const daysUntilEnd = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
            
            if (daysUntilEnd <= 30 && daysUntilEnd > 0) {
              generatedNotifications.push({
                id: `deadline-${project.id}`,
                title: 'Prazo Próximo',
                message: `O projeto "${project.name}" tem prazo em ${daysUntilEnd} dias.`,
                type: 'warning',
                created_at: new Date().toISOString(),
                read: false
              });
            }
          }
        });
      } else {
        // Notificação para usuários sem projetos
        generatedNotifications.push({
          id: `no-projects-${user.id}`,
          title: 'Comece seu primeiro projeto!',
          message: 'Crie seu primeiro projeto para começar a monitorar desperdícios e otimizar recursos.',
          type: 'info',
          created_at: new Date().toISOString(),
          read: false
        });
      }

      console.log('Notificações geradas:', generatedNotifications);
      setNotifications(generatedNotifications);
    } catch (error) {
      console.error('Erro ao buscar notificações:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 z-50">
          <Card className="shadow-lg border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Notificações</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Carregando notificações...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Nenhuma notificação encontrada
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        {getIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardNotifications;
