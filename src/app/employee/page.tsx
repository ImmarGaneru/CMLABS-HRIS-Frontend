"use client";


import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCloudDownloadAlt,
  FaCloudUploadAlt,
  FaPlusCircle,
  FaFilter,
} from "react-icons/fa"; // Import the icons
const employees = [
  {
    id: 1,
    nama: "Ahmad",
    jenisKelamin: "Laki-laki",
    nomor: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: true,
  },
  {
    id: 2,
    nama: "Luna Christina aj",
    jenisKelamin: "Perempuan",
    nomor: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: true,
  },
  {
    id: 3,
    nama: "Didik Putra Utar",
    jenisKelamin: "Laki-laki",
    nomor: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: true,
  },
  {
    id: 4,
    nama: "Nirmala Sukma",
    jenisKelamin: "Perempuan",
    nomor: "085850219981",
    cabang: "Malang",
    jabatan: "Manager",
    status: false,
  }];


export default function EmployeeTablePage() {
  const [filterText, setFilterText] = useState("");
  const [filterGender, setFilterGender] = useState(""); // ✅ pindahkan ke sini
  const [statusData, setStatusData] = useState(employees);

  const filteredEmployees = statusData.filter(
    (item) =>
      item.nama.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterGender === "" || item.jenisKelamin === filterGender)
  );

  const toggleStatus = (id: number) => {
    setStatusData((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, status: !emp.status } : emp))
    );
  };

  const columns = useMemo(
    () => [
      {
        name: "No",
        selector: (row: { id: any }) => row.id,
        width: "60px",
      },
      {
        name: "Avatar",
        cell: () => (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "9999px",
              background: "#E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            👤
          </div>
        ),
        width: "80px",
      },
      {
        name: "Nama",
        selector: (row: { nama: any }) => row.nama,
        sortable: true,
      },
      {
        name: "Jenis Kelamin",
        selector: (row: { jenisKelamin: any }) => row.jenisKelamin,
        sortable: true,
      },
      {
        name: "Nomor Telepon",
        selector: (row: { nomor: any }) => row.nomor,
      },
      {
        name: "Cabang",
        selector: (row: { cabang: any }) => row.cabang,
      },
      {
        name: "Jabatan",
        selector: (row: { jabatan: any }) => row.jabatan,
      },
      {
        name: "Status",
        cell: (row: { status: boolean | undefined; id: number }) => (
          <label
            style={{
              display: "inline-block",
              width: 40,
              height: 20,
              position: "relative",
            }}
          >
            <input
              type="checkbox"
              checked={row.status}
              onChange={() => toggleStatus(row.id)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: "absolute",
                cursor: "pointer",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: row.status ? "#16a34a" : "#dc2626",
                borderRadius: 20,
                transition: "0.4s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  height: 16,
                  width: 16,
                  left: row.status ? 20 : 4,
                  bottom: 2,
                  backgroundColor: "white",
                  borderRadius: "50%",
                  transition: "0.4s",
                }}
              ></span>
            </span>
          </label>
        ),
        width: "100px",
      },
      {
        name: "Action",
        cell: (row: { nama: any }) => (
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              title="Lihat"
              onClick={() => alert(`Lihat ${row.nama}`)}
              style={{
                backgroundColor: "white",
                border: "1px solid #1E3A5F",
                padding: "6px 12px",
                borderRadius: 6,
                color: "#1E3A5F",
              }}
            >
              <FaEye />
            </button>
            <button
              title="Edit"
              onClick={() => alert(`Edit ${row.nama}`)}
              style={{
                backgroundColor: "white",
                border: "1px solid #1E3A5F",
                padding: "6px 12px",
                borderRadius: 6,
                color: "#1E3A5F",
              }}
            >
              <FaEdit />
            </button>
            <button
              title="Hapus"
              onClick={() => alert(`Hapus ${row.nama}`)}
              style={{
                backgroundColor: "white",
                border: "1px solid #1E3A5F",
                padding: "6px 12px",
                borderRadius: 6,
                color: "#1E3A5F",
              }}
            >
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [statusData]
  );

  return (
  
    
    <div
      style={{ padding: 24, backgroundColor: "#f9fafb", minHeight: "100vh" }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          {[
            { label: "Periode", value: "Aug/2025" },
            { label: "Total Employee", value: "234 Employee" },
            { label: "Total New Hire", value: "12 Person" },
            { label: "Full Time Employee", value: "212 Full Time" },
          ].map((info, idx) => (
            <div key={idx} style={{ flex: 1, textAlign: "center" }}>
              <strong style={{ fontSize: 18 }}>{info.value}</strong>
              <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
                {info.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
  style={{
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    marginTop: 24, // Menambahkan jarak dari atas
  }}
>
<div
  style={{
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.0)",
    marginTop: 24, // Menambahkan jarak dari atas
  }}
>
<div
  style={{
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.0)",
    marginTop: 0, // Menambahkan jarak dari atas
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
      gap: 16, // Memberikan jarak antar elemen
      flexWrap: "wrap",  // Membungkus elemen jika lebar layar kecil
    }}
  >
    <h3 style={{ fontSize: 18, fontWeight: "bold", color: "#1E3A5F" }}>
      Semua Informasi Karyawan
    </h3>

    {/* Input pencarian */}
    <div style={{ display: "flex", gap: 10 }}>
    <div style={{ position: "relative", flex: 1, maxWidth: "240px" }}>
      <FaSearch
        style={{
          position: "absolute",
          top: "50%",
          left: "10px",
          transform: "translateY(-50%)",
          color: "#6b7280",
        }}
      />
    <div style={{ position: "relative", flex: "1 1 300px", maxWidth: "500px" }}>
  
  <input
    type="text"
    placeholder="search here"
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    style={{
      padding: "8px 10px 10px 30px",
      border: "1px solid #1E3A5F",
      borderRadius: 6,
      width: "100%", // Responsif
      height: "36px",
      fontSize: "14px",
    }}
  />
</div>

    </div>

    {/* Tombol Filter, Export, Import, Tambah Data */}
 
   
      <div
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        backgroundColor: "white",
        border: "1px solid #1E3A5F",
        color: "#1E3A5F",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <FaFilter />
      <select
        value={filterGender}
        onChange={(e) => setFilterGender(e.target.value)}
        style={{
          border: "none",
          backgroundColor: "transparent",
          color: "#1E3A5F",
          outline: "none",
          fontSize: "14px",
          cursor: "pointer",
        }}
      >
        <option value="">All</option>
        <option value="Laki-laki">Laki-laki</option>
        <option value="Perempuan">Perempuan</option>
      </select>
    </div>
    
     

      <button
        onClick={() => alert("Export clicked")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          backgroundColor: "white",
          border: "1px solid #1E3A5F", // Border biru
          color: "#1E3A5F",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FaCloudDownloadAlt /> {/* Ikon Export */}
        Export
      </button>

      <button
        onClick={() => alert("Import clicked")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          backgroundColor: "white",
          border: "1px solid #1E3A5F", // Border biru
          color: "#1E3A5F",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FaCloudUploadAlt /> {/* Ikon Import */}
        Import
      </button>

      <button
        onClick={() => alert("Tambah Data clicked")}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          backgroundColor: "#3b82f6",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FaPlusCircle /> {/* Ikon Tambah Data */}
        Tambah Data
      </button>
    </div>
  </div>
</div>




        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          highlightOnHover
          striped
        />
      </div>
      </div>
      </div>
    
  );
 

}


