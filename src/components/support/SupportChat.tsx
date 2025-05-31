
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send } from "lucide-react";
import { useSupportMessages } from '@/hooks/useSupportMessages';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SupportChatProps {
  ticketId: string;
  onBack: () => void;
}

const SupportChat = ({ ticketId, onBack }: SupportChatProps) => {
  const { messages, loading, sendMessage } = useSupportMessages(ticketId);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    const success = await sendMessage(newMessage, ticketId);
    if (success) {
      setNewMessage('');
    }
    setSending(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="text-residuall-gray hover:text-residuall-gray-dark"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h3 className="text-lg font-semibold text-residuall-gray-dark">
          Conversa - #{ticketId.slice(0, 8)}
        </h3>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-residuall-green"></div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_from_user ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.is_from_user
                        ? 'bg-residuall-green text-white'
                        : 'bg-gray-100 text-residuall-gray-dark'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className={`text-xs mt-1 ${
                      message.is_from_user ? 'text-white/70' : 'text-residuall-gray'
                    }`}>
                      {message.sender_name} - {format(new Date(message.created_at), 'dd/MM HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="border-t p-4">
          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              rows={2}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={sending || !newMessage.trim()}
              className="bg-residuall-green hover:bg-residuall-green-light text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportChat;
