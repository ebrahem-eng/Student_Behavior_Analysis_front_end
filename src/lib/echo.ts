import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
    Echo: any;
  }
}

window.Pusher = Pusher;

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY || 'sba-app-key';
const host = import.meta.env.VITE_PUSHER_HOST || 'localhost';
const port = Number(import.meta.env.VITE_PUSHER_PORT) || 8080;
const scheme = import.meta.env.VITE_PUSHER_SCHEME || 'http';
const isTls = scheme === 'https';

export const echo = new Echo({
  broadcaster: 'reverb',
  key: pusherKey,
  wsHost: host,
  wsPort: port,
  wssPort: port,
  forceTLS: isTls,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/broadcasting/auth`,
  auth: {
    headers: {
      get Authorization() {
        const token = localStorage.getItem('auth_token');
        return token ? `Bearer ${token}` : '';
      },
    },
  },
});

window.Echo = echo;
