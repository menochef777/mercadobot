/**
 * Cliente HTTP para integração com a API OpenWA (WhatsApp Automation)
 */

export interface EnviarMensagemResposta {
  success: boolean;
  data?: any;
  error?: string;
}

export function formatarNumeroWhatsApp(numero: string): string {
  const limpo = numero.replace(/\D/g, '');
  if (!limpo) return '';
  // Se for celular brasileiro com 10/11 dígitos e sem DDI 55
  if (limpo.length === 10 || limpo.length === 11) {
    return `55${limpo}`;
  }
  return limpo;
}

export async function enviarMensagem(numero: string, texto: string): Promise<EnviarMensagemResposta> {
  const openwaUrl = (process.env.OPENWA_URL || 'http://localhost:2785').replace(/\/$/, '');
  const apiKey = process.env.OPENWA_API_KEY || 'sua-chave';

  const numeroFormatado = formatarNumeroWhatsApp(numero);
  if (!numeroFormatado) {
    console.error('❌ [OpenWA] Número de telefone inválido para envio:', numero);
    return { success: false, error: 'Número de telefone inválido' };
  }

  const chatId = numeroFormatado.includes('@') ? numeroFormatado : `${numeroFormatado}@c.us`;

  try {
    // Busca o UUID da sessão pelo nome
    const sessionsResp = await fetch(`${openwaUrl}/api/sessions`, {
      headers: { 'x-api-key': apiKey, 'Authorization': `Bearer ${apiKey}` }
    });
    const sessions = await sessionsResp.json();
    const session = sessions.find((s: any) => s.name === (process.env.OPENWA_SESSION || 'mercadobot'));
    const sessionId = session?.id || process.env.OPENWA_SESSION;
    const endpoint = `${openwaUrl}/api/sessions/${sessionId}/messages/send-text`;

    console.log(`📤 [OpenWA] Enviando mensagem para ${numeroFormatado} (Sessão: ${sessionId})...`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        chatId: chatId,
        text: texto,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️ [OpenWA] Resposta com status ${response.status} ao enviar mensagem:`, errorText);
      return { success: false, error: errorText || `Status ${response.status}` };
    }

    const data = await response.json();
    console.log(`✅ [OpenWA] Mensagem enviada com sucesso para ${numeroFormatado}!`);
    return { success: true, data };
  } catch (error: any) {
    console.error('❌ [OpenWA] Erro de conexão ao enviar mensagem:', error.message || error);
    return { success: false, error: error.message || 'Erro de conexão com OpenWA' };
  }
}

export async function configurarWebhook(webhookUrl?: string): Promise<boolean> {
  const openwaUrl = (process.env.OPENWA_URL || 'http://localhost:2785').replace(/\/$/, '');
  const apiKey = process.env.OPENWA_API_KEY || 'sua-chave';
  const session = process.env.OPENWA_SESSION || 'mercadobot';
  const backendUrl = webhookUrl || process.env.BACKEND_URL || 'https://mercadobot-production-b06f.up.railway.app';
  const targetWebhook = `${backendUrl.replace(/\/$/, '')}/whatsapp/webhook`;

  const endpoint = `${openwaUrl}/api/sessions/${session}/webhooks`;

  try {
    console.log(`🔗 [OpenWA] Registrando webhook para: ${targetWebhook}...`);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url: targetWebhook,
        events: ['message', 'message.create', 'incoming_call'],
      }),
    });

    if (response.ok) {
      console.log(`✅ [OpenWA] Webhook registrado com sucesso: ${targetWebhook}`);
      return true;
    } else {
      const err = await response.text();
      console.warn(`⚠️ [OpenWA] Aviso ao registrar webhook: Status ${response.status} - ${err}`);
      return false;
    }
  } catch (error: any) {
    console.warn(`⚠️ [OpenWA] Não foi possível registrar webhook automaticamente (OpenWA pode estar offline):`, error.message);
    return false;
  }
}

export default {
  enviarMensagem,
  configurarWebhook,
  formatarNumeroWhatsApp,
};
