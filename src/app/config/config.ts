import { environment } from '../../environments/environment';

export const config = {
  api: {
    url: environment.apiUrl,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  },
  cache: {
    timeout: 600000, /* 10 min */
  },
  demo: {
    email: 'demo@maraichage.org',
    password: 'tAe1DSEXKCKskaHf',
  },
}