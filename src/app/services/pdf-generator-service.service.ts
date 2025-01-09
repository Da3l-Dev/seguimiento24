import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  constructor() {}

  margenIzquierdo: number = 5;
  margenDerecho: number = 5;
  private newTab: Window | null = null;

  /**
   * Abre una ventana con una pantalla de carga.
   */
  showLoadingScreen(): void {
    this.newTab = window.open('', '_blank'); // Abrir ventana en blanco de inmediato

    if (this.newTab) {
      this.newTab.document.write(`
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

      this.newTab.document.close(); // Asegura que se renderice el contenido
    }
  }

  /**
   * Cierra la ventana de carga y muestra el PDF generado.
   * @param pdfBlob Blob del PDF generado
   */
  showGeneratedPdf(pdfBlob: Blob): void {
    const url = URL.createObjectURL(pdfBlob);

    if (this.newTab) {
      this.newTab.location.href = url; // Redirigir a la URL del PDF generado
    } else {
      console.error('No se pudo abrir la nueva pestaña.');
    }
  }

  /**
   * Genera un Blob a partir del PDF con pantalla de carga.
   * @param pdf jsPDF instance
   */
  async generateBlobWithLoading(pdf: jsPDF): Promise<void> {
    // Introducir un pequeño retraso para asegurarse de que la pantalla de carga se muestre
    setTimeout(() => {
      const pdfBlob = pdf.output('blob'); // Generar el PDF
      this.showGeneratedPdf(pdfBlob); // Mostrar el PDF en la ventana abierta
    }, 500); // Retraso de 500 ms
  }

  /**
   * Agrega el encabezado al PDF con un logo, título y subtítulo.
   * @param pdf jsPDF instance
   * @param title Título del PDF
   * @param subtitle Subtítulo o trimestre
   * @param logoUrl URL o ruta del logo
   */
  addHeader(pdf: jsPDF, title: string, subtitle: string, logoUrl: string): number {
    const pdfWidth = pdf.internal.pageSize.width;
    const logo = new Image();
    logo.src = logoUrl;

    const altoImagen = 28;
    const marginArriba = 5;
    this.margenIzquierdo = 5;
    this.margenDerecho = 5;

    let posicionY = marginArriba;

    // Agregar logo
    pdf.addImage(logo, 'JPEG', this.margenIzquierdo, posicionY, pdfWidth - (this.margenIzquierdo + this.margenDerecho + 20), altoImagen);

    posicionY += altoImagen + 5;

    // Agregar título
    pdf.setFontSize(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(title, pdfWidth / 2, posicionY, { align: 'center' });

    // Agregar subtítulo
    let achoTexto = pdf.getTextWidth(subtitle);
    pdf.setFontSize(9);
    pdf.setFont('Helvetica', 'bold');
    pdf.text(subtitle, pdfWidth - (achoTexto + this.margenIzquierdo), posicionY, { align: 'center' });

    posicionY += 4;

    return posicionY;
  }

  /**
   * Agrega una tabla al PDF.
   * @param pdf jsPDF instance
   * @param startY Posición Y inicial
   * @param headers Encabezados de la tabla
   * @param data Datos de la tabla
   */
  addTable(pdf: jsPDF, startY: number, headers: string[], data: any[][], margin: number): number {
    (pdf as any).autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'grid',
      tableLineColor: [105, 105, 105],
      tableLineWidth: 0.2,
      headStyles: {
        fillColor: [87, 87, 87],
        textColor: [255, 255, 255], // Texto blanco
        fontSize: 11, // Tamaño de fuente
        halign: 'center', // Alineación horizontal
        cellPadding: 2, // Padding en las celdas
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 11, // Tamaño de fuente para las celdas
        halign: 'center', // Alineación horizontal
        cellPadding: 1,
        fontStyle: "italic", // Solo un valor
        font: "times"  // Fuente personalizada
      },
      margin: { top: 0, left: margin, right: margin },
    });

    return (pdf as any).lastAutoTable.finalY; // Devuelve la última posición Y
  }

  /**
   * Agrega las firmas al pie del PDF.
   * @param pdf jsPDF instance
   * @param firmas Array de firmas [{ nombre: string, puesto: string }]
   * @param startY Posición Y inicial para las firmas
   */
  addSignatures(pdf: jsPDF, firmas: any[], margin: number): void {
    const pdfWidth = pdf.internal.pageSize.width;
    const pdfHeight = pdf.internal.pageSize.height;
  
    const margen = margin; // Margen lateral izquierdo y derecho
    const anchoDisponible = pdfWidth - margen * 2; // Ancho disponible para todas las firmas
    const espacioPorFirma = anchoDisponible / firmas.length; // Espacio asignado por firma
  
    const yPosition = pdfHeight - 20; // Posición vertical de las firmas (cerca del borde inferior)
  

    pdf.setTextColor(163, 163, 163)
    pdf.setFontSize(9);
    
    firmas.forEach((firma, index) => {
      // Posición inicial horizontal para la firma actual
      const xInicio = margen + index * espacioPorFirma;
  
      // Calcular ancho del texto (nombre y puesto)
      const nombre = `${firma.cNombre} ${firma.cPaterno} ${firma.cMaterno}`;
      const puesto = firma.cPuesto;
  
      const nombreWidth = pdf.getTextWidth(nombre);
      const puestoWidth = pdf.getTextWidth(puesto);
  
      // Calcular posición centrada para el nombre
      const xNombre = xInicio + (espacioPorFirma - nombreWidth) / 2;
  
      // Dibujar el nombre
      pdf.text(nombre, xNombre, yPosition);
  
      // Calcular posición centrada para el puesto (debajo del nombre)
      const xPuesto = xInicio + (espacioPorFirma - puestoWidth) / 2;
  
      // Dibujar el puesto
      pdf.text(puesto, xPuesto, yPosition + 5);
    });

    pdf.setTextColor(0,0,0);
  }  
}
