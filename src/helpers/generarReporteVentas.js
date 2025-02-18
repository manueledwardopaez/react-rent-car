import { jsPDF } from "jspdf";

export const generarReporteVentas = (rentas) => {

  const doc = new jsPDF();

  
  doc.setFontSize(12);
  doc.text("Reporte de Rentas", 10, 10);
  doc.setFontSize(8);


  let yPosition = 20;


  doc.text("ID", 5, yPosition);
  doc.text("Cliente", 15, yPosition);
  doc.text("Empleado", 40, yPosition);
  doc.text("Vehículo", 70, yPosition);
  doc.text("Fecha Renta", 120, yPosition);
  doc.text("Fecha Devolución", 150, yPosition);
  doc.text("Total", 190, yPosition);
  yPosition += 10;


  rentas.forEach((renta) => {
    doc.text(renta.id.toString(), 5, yPosition);
    doc.text(renta.Cliente.Nombre, 15, yPosition);
    doc.text(renta.Empleado.Nombre, 40, yPosition); 
    doc.text(renta.Vehiculo.Descripcion, 70, yPosition);
    doc.text(renta.FechaRenta, 120, yPosition);
    doc.text(renta.FechaDevolucion, 150, yPosition);
    doc.text(`$${renta.TotalCobro}`, 190, yPosition);
    yPosition += 10;


    if (yPosition > 280) {
      doc.addPage();
      yPosition = 20; 
    }
  });

  doc.save("reporte_de_rentas.pdf");
};
