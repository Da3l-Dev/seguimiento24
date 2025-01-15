import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart, registerables } from 'chart.js';

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
   * Agrega una tabla al PDF.
   * @param pdf jsPDF instance
   * @param startY Posición Y inicial
   * @param headers Encabezados de la tabla
   * @param data Datos de la tabla
   * @param margenIzquierdo margen izquierdo la tabla
   * @param margenDerecho margen derecho la tabla
   */

  addTableMetas(
    pdf: jsPDF,
    startY: number,
    headers: string[],
    data: any[][],
    margenIzquierdo: number,
    margenDerecho: number
  ): number {
    (pdf as any).autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'grid',
      tableLineColor: [105, 105, 105],
      tableLineWidth: 0.2,
      didDrawCell: (data: { row?: any; table?: any; column?: any; cell?: any; doc?: any; }) => {
        const { cell, doc } = data;
      
        // Verifica si está en la fila que deseas pintar (-1)
        if (data.row.index === data.table.body.length - 1) {
          // Obtén el valor de la fila anterior (-2)
          const value = data.table.body[data.row.index - 1]?.raw[data.column.index]; // Valor de la celda de la fila -2
          
      
          let fillColor: number[] = [255, 255, 255]; // Color por defecto (blanco)
      
          // Condición para determinar el color según el porcentaje
          if (typeof value === 'string' && value.includes('%')) {
            const porcentaje = parseFloat(value.replace('%', ''));

            if(porcentaje > 115){
              fillColor = [153, 95, 255];
            }
            else if (porcentaje >= 85 && porcentaje <= 115) {
              fillColor = [102, 255, 95]; // Verde para porcentajes >= 90
            } else if (porcentaje >= 65 && porcentaje < 85) {
              fillColor = [248, 236, 49]; // Amarillo para porcentajes >= 70
            } else if (porcentaje < 65) {
              fillColor = [248, 55, 55]; // Naranja para porcentajes >= 50
            }
          }
      
          // Calcular el centro de la celda
          const centerX = cell.x + cell.width / 2;
          const centerY = cell.y + cell.height / 2;
      
          // Dibuja un círculo en el centro de la celda
          doc.setFillColor(...fillColor);
          doc.circle(centerX, centerY, 3, 'F'); // Radio = 3, estilo = 'F' para relleno
        }
      },            
      headStyles: {
        fillColor: [87, 87, 87],
        textColor: [255, 255, 255], // Texto blanco
        fontSize: 10, // Tamaño de fuente
        cellPadding: 2, // Padding en las celdas
        halign: 'center',
      },
      bodyStyles: {
        minCellHeight: 10,
        textColor: [0, 0, 0],
        fontSize: 10, 
        cellPadding: 1,
        halign: 'center',
        fontStyle: "italic", 
        font: "times"
      },
      margin: { top: 0, left: margenIzquierdo, right: margenDerecho },
    });
  
    return (pdf as any).lastAutoTable.finalY; // Devuelve la última posición Y
  }
  


  /**
   * Agrega una tabla al PDF.
   * @param pdf jsPDF instance
   * @param startY Posición Y inicial
   * @param headers Encabezados de la tabla
   * @param data Datos de la tabla
   * @param margin Margen establecidos de la tabla
   * @param fieldColor Color de contenido de la tabla en RGB [0,0,0]
   */

  addTablePlane(pdf: jsPDF, startY: number, headers: string[], data: any[][], margin: number, fieldColor: [number, number, number]): number{
    (pdf as any).autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'plain',
      headStyles: {
        fontSize: 9, // Tamaño de fuente
        halign: 'center', // Alineación horizontal
        fontStyle: 'normal',
      },
      bodyStyles: {
        textColor: fieldColor,
        fontSize: 7, // Tamaño de fuente para las celdas
        halign: 'center', // Alineación horizontal
        cellPadding: 1,
        fontStyle: 'normal', // Solo un valor
      },
      margin: { top: 0, left: margin, right: margin },
    });

    return (pdf as any).lastAutoTable.finalY; // Devuelve la última posición Y
  }

  /**
   * Agrega una tabla al PDF.
   * @param pdf jsPDF instance
   * @param startY Posición Y inicial
   * @param headers Encabezados de la tabla
   * @param data Datos de la tabla
   * @param margin Margen establecidos de la tabla
   * @param fieldColor Color de contenido de la tabla en RGB [0,0,0]
   */
  addTableText(pdf: jsPDF, startY: number, headers: string[], data: any[][], margin: number, fieldColor: [number, number, number]): number{
    (pdf as any).autoTable({
      head: [headers],
      body: data,
      startY,
      theme: 'plain',
      headStyles: {
        fontSize: 9, // Tamaño de fuente
        halign: 'left', // Alineación horizontal
        fontStyle: 'normal',
      },
      bodyStyles: {
        textColor: fieldColor,
        fontSize: 7, // Tamaño de fuente para las celdas
        halign: 'left', // Alineación horizontal
        cellPadding: 2,
        fontStyle: 'normal', // Solo un valor
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

  /**
   * Agrega las firmas al pie del PDF.
   * @param pdf jsPDF instance
   * @param firmas Array de firmas [{ nombre: string, puesto: string }]
   * @param startY Posición Y inicial para las firmas
   */
  addSignaturesSeguimiento(pdf: jsPDF, margin: number): void {
    const headTb = ['Vo. Bo', 'REVISÓ', 'ELABORÓ'];
    const data = [
      [
        'SELENE MUÑOZ ORTEGA \n DIRECTORA GENERAL DE EVALUACIÓN',
        'EURÍDICE DEL ÁNGEL PÉREZ \n DIRECTORA DE EVALUACIÓN PROGRAMÁTICA PRESUPUESTAL',
        'CAROLINA NAVA GONZÁLEZ \n SUBDIR. SIST. DE INDIC. DEL PROCESO PROGRAMÁTICO',
      ],
    ];
  
    // Posición inicial
    let yPosition = pdf.internal.pageSize.height - 35;
  
    // Dibujar la tabla de firmas
    yPosition = this.addTablePlane(pdf, yPosition, headTb, data, margin, [0, 0, 0]) + 3;
  
    // Añadir texto dividido en 60-40
    const anchoPagina = pdf.internal.pageSize.width; // Ancho disponible
    const ancho60 = (anchoPagina * 80) / 100; // 60% del ancho
    const ancho40 = (anchoPagina * 20) / 100; // 40% del ancho
  

    const texto60 =
      '*CRITERIOS DE VALORACIÓN: CARACTERÍSTICAS (REELEVANTE: Está directamente relacionado con algún aspecto fundamental del objetivo del programa, los resultados obtenidos y su desempeño. PERTINENTE: Tiene suficientes elementos para emitir un juicio sobre el desempeño del programa y si la información que proporciona el indicador es apropiada para describir los logros del programa.  CONFIABLE: Tiene medios de verificación y métodos de cálculo claros.)';
    const texto40 =
      'CATEGORÍAS (ADECUADA: Se tienen todas las características establecidas. MODERADA: Se tienen dos características establecidas. OPORTUNIDAD DE MEJORA: Se tiene al menos una característica establecida.)';
  
    // Posiciones iniciales
    const xStart60 = margin;
    const xStart40 = ancho60; // Deja un espacio de 5 entre las columnas
  
    // Dividir texto y dibujar cada bloque
    const textoDividido60 = pdf.splitTextToSize(texto60, ancho60 + margin);
    const textoDividido40 = pdf.splitTextToSize(texto40, ancho40 + 60);
  
    // Dibujar texto 60%
    let maxHeight = 0; // Altura máxima entre los bloques
    pdf.setFontSize(6);
    pdf.text(textoDividido60, xStart60, yPosition, { align: 'left' });
    maxHeight = textoDividido60.length * pdf.getLineHeightFactor() * pdf.getFontSize() / 72 * 25.4;
  
    // Dibujar texto 40%
    pdf.text(textoDividido40, xStart40 - 35, yPosition, { align: 'left' });
  
    // Ajustar la altura máxima para asegurar que no se superponen
    maxHeight = Math.max(
      maxHeight,
      textoDividido40.length * pdf.getLineHeightFactor() * pdf.getFontSize() / 72 * 25.4
    );
  
    // Actualizar la posición para el siguiente contenido si es necesario
    yPosition += maxHeight + 5; // Deja espacio adicional después de los bloques
  }  


  async renderizarGrafica(
    pdf: jsPDF,
    posicionX: number,
    posicionY: number,
    metaProg: any = { m1_p: 0, m2_p: 0, m3_p: 0, m4_p: 0 },
    metaAlcanzada: any = { MetaAlcanzadaTrim1: 0, MetaAlcanzadaTrim2: 0, MetaAlcanzadaTrim3: 0, MetaAlcanzadaTrim4: 0 }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Crear un canvas temporal con alta resolución
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        canvas.width = 400; // Alta resolución
        canvas.height = 200; // Alta resolución
        canvas.style.display = 'none'; // Ocultar el canvas temporalmente
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          canvas.remove();
          reject(new Error('No se pudo obtener el contexto 2D del canvas.'));
          return;
        }
  
        // Configurar la gráfica con opciones mínimas y fuentes ajustadas
        const chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['ENE - MAR', 'ABR - JUN', 'JUL - SEP', 'OCT - DIC'],
            datasets: [
              {
                label: 'Meta programada',
                data: [metaProg.m1_p, metaProg.m2_p, metaProg.m3_p, metaProg.m4_p],
                backgroundColor: 'rgba(221, 201, 163)',
                borderColor: '#ddc9a3',
                borderWidth: 1,
              },
              {
                label: 'Meta Alcanzada',
                data: [metaAlcanzada.MetaAlcanzadaTrim1, metaAlcanzada.MetaAlcanzadaTrim2, 
                       metaAlcanzada.MetaAlcanzadaTrim3, metaAlcanzada.MetaAlcanzadaTrim4],
                backgroundColor: 'rgba(105, 27, 49)',
                borderColor: '#691B31',
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: false,
            maintainAspectRatio: false,
            animation: false, // Deshabilitar animaciones para mejorar el rendimiento
            plugins: {
              legend: {
                display: true,
                labels: {

                  font: {
                    size: 12, // Tamaño ajustado de fuente para la leyenda
                  },
                  color: '#000000',
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  font: {
                    size: 11, // Tamaño ajustado de fuente para las etiquetas del eje Y
                  },
                  color: '#000000',
                },
              },
              x: {
                ticks: {
                  font: {
                    size: 11, // Tamaño ajustado de fuente para las etiquetas del eje X
                  },
                  color: '#000000',
                },
              },
            },
          },
        });
  
        // Renderizar la gráfica
        chart.render();
  
        // Convertir el canvas a imagen de alta calidad
        const imageData = canvas.toDataURL('image/png', 1.0); // Calidad máxima (1.0)
  
        if (imageData) {
        
          // Añadir la imagen al PDF
          pdf.addImage(imageData, 'PNG', posicionX + 10, posicionY - 5 , 90, 60);
          console.log('Gráfica renderizada correctamente en el PDF.');
        } else {
          pdf.setFontSize(10);
          pdf.text('Gráfica no disponible', posicionX, posicionY + 10);
          console.warn('No se pudo obtener la imagen de la gráfica.');
        }
  
        // Destruir el gráfico y limpiar el canvas
        chart.destroy();
        canvas.remove();
        resolve();
      } catch (error) {
        console.error('Error inesperado al renderizar la gráfica:', error);
        reject(error);
      }
    });
  }
  
  
}
