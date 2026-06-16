import axios from 'axios';
import { api } from 'src/boot/axios';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface LocalEvento {
  _id: string;
  nome_contratante: string;
  telefone: string;
  data: string; // YYYY-MM-DD
  hora_evento: string; // HH:MM
  hora_saida: string; // HH:MM
  responsavel: string;
  menu: string;
  bebidas: boolean;
  quantidade_pessoas: {
    quantidade_adultos: number | null;
    quantidade_criancas: number | null;
    quantidade_staffs: number | null;
  };
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
  };
  observacoes?: string;
  sugestao_qtd?: string;
}

export interface SyncResult {
  createdLocal: number;
  createdGoogle: number;
  updatedGoogle: number;
  deletedGoogle: number;
}

export interface GoogleEventTime {
  dateTime?: string;
  date?: string;
  timeZone?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start?: GoogleEventTime;
  end?: GoogleEventTime;
  status?: string;
}

export interface GoogleCalendarItem {
  id: string;
  summary: string;
  description?: string;
  timeZone?: string;
}

// Token Lifecycle Helpers
export function getAccessToken(): string | null {
  const token = localStorage.getItem('google_access_token');
  const expiry = localStorage.getItem('google_token_expiry');

  if (!token || !expiry) return null;

  // Check if expired
  if (Date.now() > Number(expiry)) {
    clearAccessToken();
    return null;
  }

  return token;
}

export function setAccessToken(token: string, expiresInSeconds: number) {
  localStorage.setItem('google_access_token', token);
  const expiryTime = Date.now() + expiresInSeconds * 1000;
  localStorage.setItem('google_token_expiry', String(expiryTime));
}

export function clearAccessToken() {
  localStorage.removeItem('google_access_token');
  localStorage.removeItem('google_token_expiry');
  localStorage.removeItem('google_calendar_id');
}

export function getStoredClientId(): string {
  // Try env variable first, fallback to localStorage configuration
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('google_client_id') || '';
}

export function setStoredClientId(clientId: string) {
  localStorage.setItem('google_client_id', clientId);
}

// Redirect to Google OAuth
export function initiateAuthFlow(clientId: string) {
  const redirectUri = `${window.location.origin}/eventos/calendario`;
  const scope = 'https://www.googleapis.com/auth/calendar.events';
  const responseType = 'token';
  const state = Math.random().toString(36).substring(2);

  const authUrl = `${GOOGLE_AUTH_URL}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}&state=${state}`;
  window.location.href = authUrl;
}

// Parse Hash parameters from redirect
export function handleAuthRedirect(): boolean {
  const hash = window.location.hash;
  if (!hash) return false;

  const params = new URLSearchParams(hash.substring(1));
  const accessToken = params.get('access_token');
  const expiresIn = params.get('expires_in');

  if (accessToken && expiresIn) {
    setAccessToken(accessToken, Number(expiresIn));
    // Clean hash
    window.location.hash = '';
    return true;
  }

  return false;
}

// Google Calendar API Helpers
async function googleRequest(method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH', endpoint: string, data?: unknown) {
  const token = getAccessToken();
  if (!token) throw new Error('Não autenticado com o Google.');

  const url = endpoint.startsWith('http') ? endpoint : `${GOOGLE_API_BASE}${endpoint}`;
  const response = await axios({
    method,
    url,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  });
  return response.data;
}

// Get or Create Secondary Calendar
export async function getOrCreateVarandaoCalendar(): Promise<string> {
  const cachedId = localStorage.getItem('google_calendar_id');
  if (cachedId) {
    try {
      // Verify it still exists
      await googleRequest('GET', `/calendars/${cachedId}`);
      return cachedId;
    } catch {
      localStorage.removeItem('google_calendar_id');
    }
  }

  // List all calendars
  const listData = (await googleRequest('GET', '/users/me/calendarList')) as { items?: GoogleCalendarItem[] };
  const calendars = listData.items || [];
  const varandaoCal = calendars.find((cal: GoogleCalendarItem) => cal.summary === 'Varandão');

  if (varandaoCal) {
    localStorage.setItem('google_calendar_id', varandaoCal.id);
    return varandaoCal.id;
  }

  // Create new secondary calendar
  const newCal = await googleRequest('POST', '/calendars', {
    summary: 'Varandão',
    description: 'Agenda para sincronização automática de eventos do Varandão',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo',
  });

  localStorage.setItem('google_calendar_id', newCal.id);
  return newCal.id;
}

// Parse Varandão ID from description
function parseVarandaoId(description?: string): string | null {
  if (!description) return null;
  const match = description.match(/ID do Gestor Varandão:\s*([a-zA-Z0-9_-]+)/i);
  return match ? match[1] || null : null;
}

// Format Varandão ID into description
function formatDescription(evento: Omit<LocalEvento, '_id'>, id: string): string {
  const adults = evento.quantidade_pessoas?.quantidade_adultos || 0;
  const kids = evento.quantidade_pessoas?.quantidade_criancas || 0;
  const staffs = evento.quantidade_pessoas?.quantidade_staffs || 0;

  return [
    `Contratante: ${evento.nome_contratante}`,
    `Telefone: ${evento.telefone || 'Não informado'}`,
    `Menu: ${evento.menu || 'Não informado'}`,
    `Chef Responsável: ${evento.responsavel || 'Não informado'}`,
    `Pessoas: ${adults} Adultos, ${kids} Crianças, ${staffs} Staffs`,
    evento.observacoes ? `Observações: ${evento.observacoes}` : '',
    evento.sugestao_qtd ? `Sugestão de quantidade: ${evento.sugestao_qtd}` : '',
    '',
    `ID do Gestor Varandão: ${id}`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function formatAddress(end: LocalEvento['endereco']) {
  if (!end) return '';
  const parts = [
    end.logradouro,
    end.numero ? `nº ${end.numero}` : '',
    end.complemento,
    end.bairro,
    end.cidade,
    end.cep ? `CEP: ${end.cep}` : '',
  ].filter(Boolean);
  return parts.join(', ');
}

// Convert local event times to datetime bounds
function getEventDateTimes(evento: Omit<LocalEvento, '_id'>) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';
  const data = evento.data; // YYYY-MM-DD
  const startHour = evento.hora_evento || '12:00';

  let endHour = evento.hora_saida;
  if (!endHour || endHour <= startHour) {
    // If exit time is undefined or before event hour, set as 4 hours later
    const [h, m] = startHour.split(':').map(Number);
    const endH = (h! + 4) % 24;
    endHour = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  return {
    start: {
      dateTime: `${data}T${startHour}:00`,
      timeZone: tz,
    },
    end: {
      dateTime: `${data}T${endHour}:00`,
      timeZone: tz,
    },
  };
}

// Parse details from a manually created Google Event description to sync back to the App
function parseGoogleEventToLocal(gEvt: GoogleCalendarEvent): Omit<LocalEvento, '_id'> {
  const desc = gEvt.description || '';
  const summary = gEvt.summary || '';

  // Extract phone
  const phoneMatch = desc.match(/Telefone:\s*(.+)/i);
  const telefone = phoneMatch && phoneMatch[1] ? phoneMatch[1].trim() : '';

  // Extract menu
  const menuMatch = desc.match(/Menu:\s*(.+)/i);
  const menu = menuMatch && menuMatch[1] ? menuMatch[1].trim() : '';

  // Extract Chef
  const chefMatch = desc.match(/Chef Responsável:\s*(.+)/i);
  const responsavel = chefMatch && chefMatch[1] ? chefMatch[1].trim() : '';

  // Extract people quantities
  const peopleMatch = desc.match(/Pessoas:\s*(\d+)\s*Adultos,\s*(\d+)\s*Crianças,\s*(\d+)\s*Staffs/i);
  const quantidade_pessoas = {
    quantidade_adultos: peopleMatch && peopleMatch[1] ? Number(peopleMatch[1]) : null,
    quantidade_criancas: peopleMatch && peopleMatch[2] ? Number(peopleMatch[2]) : null,
    quantidade_staffs: peopleMatch && peopleMatch[3] ? Number(peopleMatch[3]) : null,
  };

  // Extract observations
  const obsMatch = desc.match(/Observações:\s*([\s\S]*?)(?:Sugestão de quantidade:|ID do Gestor Varandão:|$)/i);
  const observacoes = obsMatch && obsMatch[1] ? obsMatch[1].trim() : '';

  // Extract suggestion
  const sugMatch = desc.match(/Sugestão de quantidade:\s*([\s\S]*?)(?:ID do Gestor Varandão:|$)/i);
  const sugestao_qtd = sugMatch && sugMatch[1] ? sugMatch[1].trim() : '';

  // Parse Date and Hours
  const startDateTime = gEvt.start?.dateTime || gEvt.start?.date || '';
  const endDateTime = gEvt.end?.dateTime || gEvt.end?.date || '';

  const data = startDateTime.substring(0, 10) || new Date().toISOString().substring(0, 10);
  const hora_evento = startDateTime.includes('T') ? startDateTime.substring(11, 16) : '12:00';
  const hora_saida = endDateTime.includes('T') ? endDateTime.substring(11, 16) : '16:00';

  // Parse location
  const location = gEvt.location || '';
  const endereco = {
    cep: '',
    logradouro: location,
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
  };

  // Try parsing simple address parts if it's comma separated
  if (location.includes(',')) {
    const parts = location.split(',').map((p: string) => p.trim());
    const part0 = parts[0];
    const part1 = parts[1];
    const part2 = parts[2];
    const part3 = parts[3];

    if (part0) endereco.logradouro = part0;
    if (part1) {
      const numMatch = part1.match(/nº\s*(.+)/i) || part1.match(/(\d+)/);
      endereco.numero = numMatch && numMatch[1] ? numMatch[1] : part1;
    }
    if (part2) endereco.bairro = part2;
    if (part3) endereco.cidade = part3;

    const cepPart = parts.find((p: string) => p.toLowerCase().includes('cep:'));
    if (cepPart) {
      endereco.cep = cepPart.replace(/cep:\s*/i, '').trim();
    }
  }

  // Parse contractor name from summary, removing prefix "Varandão - " if present
  let nome_contratante = summary;
  if (summary.startsWith('Varandão - ')) {
    nome_contratante = summary.replace(/^Varandão - /, '').split('(')[0]?.trim() || summary;
  }

  return {
    nome_contratante,
    telefone,
    data,
    hora_evento,
    hora_saida,
    responsavel,
    menu,
    bebidas: desc.toLowerCase().includes('bebidas: sim') || false,
    quantidade_pessoas,
    endereco,
    observacoes,
    sugestao_qtd,
  };
}

// Bidirectional Sync Algorithm
export async function syncEvents(progressCallback?: (step: string) => void): Promise<SyncResult> {
  const result: SyncResult = {
    createdLocal: 0,
    createdGoogle: 0,
    updatedGoogle: 0,
    deletedGoogle: 0,
  };

  progressCallback?.('Conectando ao Google Agenda...');
  const calendarId = await getOrCreateVarandaoCalendar();

  progressCallback?.('Buscando eventos locais...');
  const localRes = await api.get('/eventos?periodo=todos', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const localEvents: LocalEvento[] = localRes.data || [];

  progressCallback?.('Buscando eventos do Google...');
  // Fetch Google events (limit range to avoid huge pagination, e.g. 6 months past to 2 years future)
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  const twoYearsFuture = new Date();
  twoYearsFuture.setFullYear(now.getFullYear() + 2);

  const googleRes = (await googleRequest(
    'GET',
    `/calendars/${calendarId}/events?timeMin=${sixMonthsAgo.toISOString()}&timeMax=${twoYearsFuture.toISOString()}&maxResults=1000`
  )) as { items?: GoogleCalendarEvent[] };
  const googleEvents = googleRes.items || [];

  // Create Maps
  const localMap = new Map<string, LocalEvento>();
  localEvents.forEach((evt) => {
    if (evt._id) localMap.set(evt._id, evt);
  });

  const googleMapByVarandaoId = new Map<string, GoogleCalendarEvent>();
  const googleEventsWithNoVarandaoId: GoogleCalendarEvent[] = [];

  googleEvents.forEach((gEvt: GoogleCalendarEvent) => {
    // Skip cancelled events
    if (gEvt.status === 'cancelled') return;

    const vId = parseVarandaoId(gEvt.description);
    if (vId) {
      googleMapByVarandaoId.set(vId, gEvt);
    } else {
      googleEventsWithNoVarandaoId.push(gEvt);
    }
  });

  // 1. Process Local Events: upload new or update existing in Google Calendar
  let processed = 0;
  for (const localEvt of localEvents) {
    if (!localEvt._id) continue;

    processed++;
    progressCallback?.(`Processando eventos locais (${processed}/${localEvents.length})...`);

    const gEvt = googleMapByVarandaoId.get(localEvt._id);
    const dateTimes = getEventDateTimes(localEvt);
    const summary = `Varandão - ${localEvt.nome_contratante} (${localEvt.responsavel || 'Sem chef'})`;
    const description = formatDescription(localEvt, localEvt._id);
    const location = formatAddress(localEvt.endereco);

    const eventPayload = {
      summary,
      description,
      location,
      start: dateTimes.start,
      end: dateTimes.end,
    };

    if (!gEvt) {
      // Create event in Google Calendar
      await googleRequest('POST', `/calendars/${calendarId}/events`, eventPayload);
      result.createdGoogle++;
    } else {
      // Check if anything changed to avoid redundant API hits
      const startChanged = gEvt.start?.dateTime?.substring(0, 16) !== dateTimes.start.dateTime.substring(0, 16);
      const endChanged = gEvt.end?.dateTime?.substring(0, 16) !== dateTimes.end.dateTime.substring(0, 16);
      const summaryChanged = gEvt.summary !== summary;
      const descChanged = gEvt.description !== description;
      const locChanged = gEvt.location !== location;

      if (startChanged || endChanged || summaryChanged || descChanged || locChanged) {
        await googleRequest('PUT', `/calendars/${calendarId}/events/${gEvt.id}`, eventPayload);
        result.updatedGoogle++;
      }
    }
  }

  // 2. Process Google Events that are linked to Varandão ID, but do NOT exist locally (deleted in App)
  for (const [vId, gEvt] of googleMapByVarandaoId.entries()) {
    if (!localMap.has(vId)) {
      progressCallback?.(`Removendo eventos cancelados do Google Agenda...`);
      // Delete from Google Calendar since it was deleted in the Varandão app
      await googleRequest('DELETE', `/calendars/${calendarId}/events/${gEvt.id}`);
      result.deletedGoogle++;
    }
  }

  // 3. Process Google Events with no Varandão ID (created directly on Google Calendar)
  let googleNewProcessed = 0;
  for (const gEvt of googleEventsWithNoVarandaoId) {
    googleNewProcessed++;
    progressCallback?.(`Importando novos eventos do Google Agenda (${googleNewProcessed}/${googleEventsWithNoVarandaoId.length})...`);

    // Parse the event into local format
    const localPayload = parseGoogleEventToLocal(gEvt);

    // Save to App backend database
    try {
      const response = await api.post('/eventos', localPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const newLocalEvt = response.data;
      if (newLocalEvt && newLocalEvt._id) {
        result.createdLocal++;

        // Update the Google Event's description to link it with the new local ID
        const dateTimes = getEventDateTimes(localPayload);
        const updatedDescription = formatDescription(localPayload, newLocalEvt._id);
        const updatedSummary = `Varandão - ${localPayload.nome_contratante} (${localPayload.responsavel || 'Sem chef'})`;

        await googleRequest('PUT', `/calendars/${calendarId}/events/${gEvt.id}`, {
          summary: updatedSummary,
          description: updatedDescription,
          location: formatAddress(localPayload.endereco),
          start: dateTimes.start,
          end: dateTimes.end,
        });
      }
    } catch (err) {
      console.error('Falha ao importar evento do Google para o banco local:', err);
    }
  }

  progressCallback?.('Sincronização concluída!');
  return result;
}
