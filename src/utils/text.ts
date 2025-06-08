/**
 * Memisahkan nama lengkap menjadi first_name dan last_name.
 * Jika hanya satu kata, maka last_name akan kosong.
 * Jika lebih dari satu kata, kata pertama adalah first_name, sisanya adalah last_name.
 *
 * @param fullName - Nama lengkap
 * @returns Object dengan properti first_name dan last_name
 */
export function splitName(fullName: string): {
  first_name: string;
  last_name: string;
} {
  const parts = fullName.trim().split(/\s+/);

  if (parts.length === 0) {
    return { first_name: "", last_name: "" };
  }

  const [first_name, ...rest] = parts;
  const last_name = rest.join(" ");

  return {
    first_name,
    last_name,
  };
}
