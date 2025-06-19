// utils/position.js
import api from "@/lib/axios";

export async function getDepartments() {
  const { data } = await api.get('/admin/departments');

  return data;
}
