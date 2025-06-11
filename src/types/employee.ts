// src/types/employee.ts

// Data langsung dari API Laravel
export type EmployeeFromAPI = {
    id: string;
    sign_in_code: string;
    id_user: string;
    employment_status: "active" | "inactive" | "resign";
    first_name: string;
    last_name: string;
    address: string;
    id_position: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user?: {
      id: string;
      email: string;
    };
    position?: {
      id: string;
      name: string;
    };
  };
  
// Untuk UI
export type FEEmployee = {
    id: string;
    nama: string;
    jenis_kelamin: string;
    no_telp: string;
    cabang: string;
    jabatan: string;
    status: string;
<<<<<<< HEAD
    // hireDate: string;
    start_date: string;
    // employmentType: string;
    tipe_kontrak: string;
=======
    hire_date: string;
    employment_type: string;
>>>>>>> 8ab03d8dbf0c163da7ca2af2a21c052e42463f6a
};