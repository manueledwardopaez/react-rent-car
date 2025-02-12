
export const formatTarjeta = (tarjeta) => {
    if (!tarjeta) return "";
    return String(tarjeta)
      .replace(/\D/g, "") // Elimina cualquier carácter que no sea número
      .replace(/(\d{4})(?=\d)/g, "$1-"); // Agrega guión después de cada 4 dígitos, excepto al final
  };
  
  export const formatDinero = (cantidad) => {
    if (!cantidad) return "0";
    return parseFloat(cantidad).toLocaleString("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
    });
  };

  export const formatCedula = (cedula) => {
    if (!cedula) return "";
    
    return String(cedula)
      .replace(/\D/g, "") // Elimina cualquier carácter que no sea número
      .replace(/^(\d{3})(\d{7})(\d)$/, "$1-$2-$3"); // Aplica el formato XXX-XXXXXXX-X
  };
  