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


// export async function createEmployee(payload) {
//   const { data } = await api.post("/employee", payload);
//   return data;
  
// }
export const createEmployee = (formData) => {
  return api.post('admin/employees', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateEmployee = (id, formData) => {
  return api.put(`/employee/${id}`, formData);
};

export async function importEmployee(id, payload) {
  const { data } = await api.post(`/employee/import`, payload);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await api.delete(`/employee/${id}`);
  return data;
}
export const uploadEmployeeDocument = (id, formData) => {
  return api.post(`/employee/${id}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
