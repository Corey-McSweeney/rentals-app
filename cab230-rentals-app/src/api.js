export const API_URL = 'http://4.237.58.241:3000';

export const authHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const jsonHeaders = () => ({
  'Content-Type': 'application/json',
});

export const authJsonHeaders = () => ({
  ...authHeaders(),
  ...jsonHeaders(),
});