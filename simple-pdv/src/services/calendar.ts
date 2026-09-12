import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];

/**
 * Converte diferentes formatos de data (ex: '15/09/2026', '15-09-2026', '2026-09-15')
 * para o formato YYYY-MM-DD exigido pelo Google Calendar.
 */
export function formatarDataParaCalendar(dataStr: string): string {
  if (!dataStr) {
    return new Date().toISOString().split('T')[0];
  }
  const clean = dataStr.trim();
  // Formato brasileiro DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(clean)) {
    const [dia, mes, ano] = clean.split('/');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  // Formato brasileiro DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(clean)) {
    const [dia, mes, ano] = clean.split('-');
    return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }
  // Formato ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(clean)) {
    return clean.substring(0, 10);
  }
  // Tentar parse nativo Date
  const d = new Date(clean);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return new Date().toISOString().split('T')[0];
}

/**
 * Instancia o cliente JWT de autenticação do Google Calendar usando Service Account
 */
function getGoogleAuthClient() {
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey) {
    return null;
  }

  try {
    let credentials: any = null;
    const trimmed = serviceAccountKey.trim();

    if (trimmed.startsWith('{')) {
      credentials = JSON.parse(trimmed);
    } else {
      // Tentar decodificar se for base64
      try {
        const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
        if (decoded.trim().startsWith('{')) {
          credentials = JSON.parse(decoded);
        }
      } catch {
        // Não é base64
      }

      // Se for caminho de arquivo
      if (!credentials) {
        const fs = require('fs');
        if (fs.existsSync(trimmed)) {
          credentials = JSON.parse(fs.readFileSync(trimmed, 'utf-8'));
        }
      }
    }

    if (!credentials || !credentials.client_email) {
      console.warn('⚠️ [Google Calendar] Credenciais de Service Account ausentes ou incompletas.');
      return null;
    }

    const auth = new google.auth.JWT({
      email: credentials.client_email,
      key: credentials.private_key?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    return auth;
  } catch (err) {
    console.warn('⚠️ [Google Calendar] Erro ao instanciar autenticação:', err);
    return null;
  }
}

/**
 * Cria evento no Google Calendar para lembrete de vencimento de conta a pagar.
 * 
 * @param nomeFornecedor Nome do fornecedor
 * @param valor Valor da conta
 * @param dataVencimento Data de vencimento (DD/MM/YYYY ou YYYY-MM-DD)
 */
export async function criarEventoVencimento(
  nomeFornecedor: string,
  valor: number,
  dataVencimento: string
): Promise<any> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
  const dataFormatada = formatarDataParaCalendar(dataVencimento);
  const valorFormatado = Number(valor || 0).toFixed(2);
  const titulo = `💸 Pagar: ${nomeFornecedor || 'Fornecedor'} — R$ ${valorFormatado}`;
  const descricao = 'Conta a pagar registrada automaticamente pelo GestorMercado';

  const auth = getGoogleAuthClient();
  if (!auth) {
    console.log(`ℹ️ [Google Calendar] GOOGLE_SERVICE_ACCOUNT_KEY não configurado. Evento agendado localmente (Data: ${dataFormatada}, Título: "${titulo}").`);
    return null;
  }

  try {
    const calendar = google.calendar({ version: 'v3', auth });

    const event = {
      summary: titulo,
      description: descricao,
      start: {
        date: dataFormatada,
      },
      end: {
        date: dataFormatada,
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 dia antes (1440 min)
          { method: 'popup', minutes: 0 },       // No dia do evento
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId,
      requestBody: event,
    });

    console.log(`✅ [Google Calendar] Evento criado com sucesso: ${response.data.htmlLink || response.data.id}`);
    return response.data;
  } catch (error: any) {
    console.error('❌ [Google Calendar] Erro ao criar evento no Google Calendar:', error?.message || error);
    return null;
  }
}
