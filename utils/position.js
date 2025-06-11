// utils/position.js
import api from "@/lib/axios";

export async function getPositions() {
  const { data } = await api.get('/admin/positions');

  return data;
}
