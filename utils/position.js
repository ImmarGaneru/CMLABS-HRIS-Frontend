// utils/position.js
import api from './api';

export async function getPositions() {
  const { data } = await api.get('/position');

  return data;
}
