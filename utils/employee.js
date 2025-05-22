// utils/employee.js
import api from "./api";

export async function getEmployees() {
  const { data } = await api.get("/employee");
  return data;
}

export async function getEmployee(id) {
  const { data } = await api.get(`/employee/${id}`);
  return data;
}

export async function createEmployee(payload) {
  const { data } = await api.post("/employee", payload);
  return data;
}

export async function updateEmployee(id, payload) {
  const { data } = await api.put(`/employee/${id}`, payload);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await api.delete(`/employee/${id}`);
  return data;
}
