import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  /**
   * Agrega el encabezado al PDF con un logo, título y subtítulo.
   * @param pdf jsPDF instance
   * @param title Título del PDF
   * @param subtitle Subtítulo o trimestre
   * @param logoUrl URL o ruta del logo
   */
  addHeader(pdf: jsPDF, title: string, subtitle: string, logoUrl: string): void {
    const pdfWidth = pdf.internal.pageSize.width;
    const logo = new Image();
    logo.src = logoUrl;

    const altoImagen = 28;
    const marginArriba = 5;
    const margenIzquierdo = 5;
    const margenDerecho = 5;

    let posicionY = marginArriba;

    // Agregar logo
    pdf.addImage(logo, 'JPEG', margenIzquierdo, posicionY, pdfWidth - (margenIzquierdo + margenDerecho + 20), altoImagen);

    posicionY += altoImagen + 5;

    // Agregar título
    pdf.setFontSize(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(title, pdfWidth / 2, posicionY, { align: 'center' });

    // Agregar subtítulo
    let achoTexto = pdf.getTextWidth(subtitle);
    pdf.setFontSize(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(subtitle, pdfWidth - (achoTexto + margenIzquierdo), posicionY , { align: 'center' });
  }

  /**
   * Agrega una tabla al PDF.
   * @param pdf jsPDF instance
   * @param startY Posición Y inicial
   * @param headers Encabezados de la tabla
   * @param data Datos de la tabla
   * @param columnStyles Estilos personalizados por columna
   */
  addTable(pdf: jsPDF, startY: number, headers: string[], data: any[][], columnStyles = {}): number {
    (pdf as any).autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      columnStyles,
    });

    return (pdf as any).lastAutoTable.finalY; // Devuelve la última posición Y
  }

  /**
   * Agrega las firmas al pie del PDF.
   * @param pdf jsPDF instance
   * @param firmas Array de firmas [{ nombre: string, puesto: string }]
   * @param startY Posición Y inicial para las firmas
   */
  addSignatures(pdf: jsPDF, firmas: { nombre: string; puesto: string }[], startY: number): void {
    const pdfWidth = pdf.internal.pageSize.width;
    const marginX = 10; // Margen izquierdo
    const widthAvailable = pdfWidth - marginX * 2; // Ancho disponible
    const spacePerSignature = widthAvailable / firmas.length;

    firmas.forEach((firma, index) => {
      const xPosition = marginX + index * spacePerSignature;
      const centerX = xPosition + spacePerSignature / 2;

      // Dibujar el nombre centrado
      const nombreWidth = pdf.getTextWidth(firma.nombre);
      pdf.text(firma.nombre, centerX - nombreWidth / 2, startY);

      // Dibujar el puesto centrado debajo del nombre
      const puestoWidth = pdf.getTextWidth(firma.puesto);
      pdf.text(firma.puesto, centerX - puestoWidth / 2, startY + 5);
    });
  }

  /**
   * Genera un Blob a partir del PDF.
   * @param pdf jsPDF instance
   * @returns Blob
   */
  generateBlob(pdf: jsPDF): void {

    const newTab = window.open('', '_blank'); // Abrir ventana en blanco de inmediato

    // Presentar pantalla de espera para generar el pdf
    if (newTab) {
      // Crear una pantalla de carga en la nueva ventana
      newTab.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Generando PDF...</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
            }
            .spinner {
              border: 8px solid #f3f3f3; /* Light grey */
              border-top: 8px solid #3498db; /* Blue */
              border-radius: 50%;
              width: 60px;
              height: 60px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .message {
              margin-top: 20px;
              font-size: 18px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div>
            <div class="spinner"></div>
            <div class="message">Generando PDF, por favor espera...</div>
          </div>
        </body>
        </html>
      `);

      newTab.document.close(); // Asegura que se renderice el contenido
    }

    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
        
        if (newTab) {
          newTab.location.href = url; // Actualizar la ubicación cuando el PDF esté listo
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
        } 
  }

  /**
   * Descarga el PDF.
   * @param pdf jsPDF instance
   * @param fileName Nombre del archivo
   */
  downloadPdf(pdf: jsPDF, fileName: string): void {
    pdf.save(fileName);
  }
}
