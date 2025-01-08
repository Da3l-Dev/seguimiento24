import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { SharedDataService } from '../../services/shared-data.service';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { FirmasServiceService } from '../../services/firmas-service.service';
import { PdfGeneratorService } from '../../services/pdf-generator-service.service';


@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.scss'],
})
export class NavMainComponent implements OnInit {
  cUnidadOperante: string = "";
  datosProyecto: any[] = [];
  datos: any[] = [];
  firmas: any[] = [];
  variables: any[] = [];
  metasAlcanzadas: any[] = [];
  trimActivo: any[] = [];
  idArea: number = 0;
  idProyecto: number = 0;
  year: number = 2024;
  
  constructor(
    private proyectoData: DatosProyectosService,
    private serviceShareData: SharedDataService,
    private firmasService : FirmasServiceService,
    private pdfGenerator : PdfGeneratorService
  ) {}


    ngOnInit(): void {
      this.serviceShareData.userModel$.subscribe(data => {
        this.idArea = data?.idArea || 0;
        this.cUnidadOperante = data?.cUnidadOperante || 'Titulo por defecto';
        this.idProyecto = data?.idPrograma || 0;
      });

      this.proyectoData.getTrimActivo(this.idArea).subscribe(data => {
        this.trimActivo = data[0];
      });

    }
    


    /**
     * Permite generar el pdf de la cedula de evidencias
     */

    // Funcion Crear pdf Cedula de Evidencias
    async generarPdfCedula(trimestre: number): Promise<void> {
      try {

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

        this.firmas = await new Promise<any[]>((resolve, reject) => {
          this.firmasService.getFirmasProyecto(this.idProyecto).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          )
        })

        // region Obtencion de Datos
        // Obtener los datos del proyecto
        const dataProyectos = await new Promise<any[]>((resolve, reject) => {
          this.proyectoData.getDataProyects(this.idArea, this.year).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          );
        });
        this.datos = dataProyectos;


        //Obtener variables del proyecto
        this.variables = await new Promise<any[]>((resolve, reject) => {
          this.proyectoData.getVariables(this.idArea, this.year).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          );
        });


        //Obtener metas Alcanzadas del proyecto
        this.metasAlcanzadas = await new Promise<any[]>((resolve, reject) => {
          this.proyectoData.getMetasAlcanzadas(this.idArea).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          );
        });


        
        
        
        //endregion

        // Inicialización del PDF
        const pdf = new jsPDF('landscape', 'mm', 'a4'); // PDF en formato A4 horizontal
        const pdfWidth = 297; // Ancho del PDF en mm
    
        // Iterar sobre los datos y agregar contenido en cada página

        for (let i = 0; i < this.datos.length; i++) {    
        
          // Obtener variables del indicador
          const elementVar = this.variables.find((variable) => variable.idIndica === this.datos[i].idIndicador && variable.idEje === this.year);

          // Obtener observacion 1 y 2
          const logrosData = await new Promise<any[]>((resolve, reject) => {
            this.proyectoData
              .getLogros(elementVar.idEje, elementVar.idArea, trimestre, elementVar.idIndica)
              .subscribe(
                (data) => resolve(data),
                (error) => reject(error)
              );
          });

          const obs1 = logrosData[0]?.obs1 || 'Sin observación 1';
          const obs2 = logrosData[0]?.obs2 || 'Sin observación 2';

          // Obtener metas alcanzadas
          const elementMeta = this.metasAlcanzadas.find((metas)=> metas.ejercicio === this.year && metas.idIndica === this.datos[i].idIndicador && metas.idArea === this.idArea);
          
      

          let maTrim;
          let metaAlTotal;
          let textTrim;

          
          switch(trimestre){
            case 1:
              maTrim = elementMeta.MetaAlcanzadaTrim1;
              metaAlTotal = elementMeta.MetaAlcanzadaTrim1 + elementMeta.MetaAlcanzadaTrim2 + elementMeta.MetaAlcanzadaTrim3 + elementMeta.MetaAlcanzadaTrim4;
              textTrim = "Primer Trimestre " + this.year;
              break;

            case 2:
              maTrim = elementMeta.MetaAlcanzadaTrim2;
              metaAlTotal = elementMeta.MetaAlcanzadaTrim1 + elementMeta.MetaAlcanzadaTrim2 + elementMeta.MetaAlcanzadaTrim3 + elementMeta.MetaAlcanzadaTrim4;
              textTrim = "Segundo Trimestre " + this.year;
              break;
            
            case 3:
              maTrim = elementMeta.MetaAlcanzadaTrim3;
              metaAlTotal = elementMeta.MetaAlcanzadaTrim1 + elementMeta.MetaAlcanzadaTrim2 + elementMeta.MetaAlcanzadaTrim3 + elementMeta.MetaAlcanzadaTrim4;
              textTrim = "Tercer Trimestre " + this.year;
              break;
            
            case 4:
              maTrim = elementMeta.MetaAlcanzadaTrim4;
              metaAlTotal = elementMeta.MetaAlcanzadaTrim1 + elementMeta.MetaAlcanzadaTrim2 + elementMeta.MetaAlcanzadaTrim3 + elementMeta.MetaAlcanzadaTrim4;
              textTrim = "Cuarto Trimestre " + this.year;
              break;
          }



          let currentY = 5; // Reinicia la posición vertical en cada página


          // Agregar Encabezado con Logo
          const logoUrl = '/img/encabezadosPDF/encabecedula.jpg'; // Ruta relativa del logo
          const logo = new Image();
          logo.src = logoUrl;
    
          await new Promise((resolve, reject) => {
            logo.onload = () => {
              const logoWidth = 280;
              const logoHeight = 28;
              const x = ((pdfWidth - logoWidth) / 2) - 16; // Centrar la imagen
              pdf.addImage(logo, 'JPEG', x, currentY, logoWidth, logoHeight);
              resolve(true);
            };
            logo.onerror = reject;
          });
    
          currentY += 28 + 5; // Altura del logo + margen inferior dinámico
    
          // Agregar Título
          const title = this.cUnidadOperante || "Título por Defecto";
          pdf.setFontSize(11);
          pdf.setFont('Helvetica', 'bold');
          const textWidth = pdf.getTextWidth(title);
          const textX = (pdfWidth - textWidth) / 2; // Centrar el título
          pdf.text(title, textX, currentY);
    

          //Agregar trimestre actual
          const titleTrim = textTrim || '';
          pdf.setFontSize(10)
          pdf.setFont('Helvetica', 'bold');
          const textTrimWidth = pdf.getTextWidth(titleTrim);
          const xTrim = (textWidth) + (textTrimWidth) * 4; 
          pdf.text(titleTrim, xTrim, currentY);

          currentY += 7; // Incrementar según el tamaño del texto


          // Define márgenes y configuración
          const marginX = 35; // Márgenes laterales
          const contentWidth = pdfWidth - 35; // Ancho disponible para contenido
          const lineSpacing = 3; // Espaciado adicional entre bloques
          const fontSizetext = 9;

          // region Medio de verificación
          const mv = this.datos[i].MV || 'N/A';
          const mvLines = pdf.splitTextToSize(mv, contentWidth);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(mvLines, marginX, currentY);

          const mvHeight = pdf.getTextDimensions(mvLines.join('\n')).h; // Altura total del texto dividido
          currentY += mvHeight + lineSpacing + 3;

          // Título Medio de Verificación
          const titleMV = 'Medio de Verificación';
          pdf.setTextColor(105, 27, 49);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(titleMV, marginX, currentY);

          const titleMVH = pdf.getTextDimensions(titleMV).h;
          currentY += titleMVH + lineSpacing;
          // endregion

          // region Indicador
          const indicador = this.datos[i].Indicador || 'N/A';
          const indicadorLines = pdf.splitTextToSize(indicador, contentWidth);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(indicadorLines, marginX, currentY);

          const indicadorHeight = pdf.getTextDimensions(indicadorLines.join('\n')).h;
          currentY += indicadorHeight + lineSpacing;

          // Título Indicador
          const titleIndicador = 'Indicador';
          pdf.setTextColor(105, 27, 49);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(titleIndicador, marginX, currentY);

          const titleIndicadorH = pdf.getTextDimensions(titleIndicador).h;
          currentY += titleIndicadorH + lineSpacing;
          // endregion

          // region Fórmula de cálculo
          const formula = this.datos[i].formula || 'N/A';
          const formulaLines = pdf.splitTextToSize(formula, contentWidth);
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(formulaLines, marginX, currentY);

          const formulaHeight = pdf.getTextDimensions(formulaLines.join('\n')).h;
          currentY += formulaHeight + lineSpacing;

          // Título Fórmula de Cálculo
          const titleFormula = 'Fórmula de cálculo';
          pdf.setTextColor(105, 27, 49);
          pdf.setFontSize(fontSizetext);
          pdf.setFont('Helvetica', 'normal');
          pdf.text(titleFormula, marginX, currentY);

          const titleFormulaH = pdf.getTextDimensions(titleFormula).h;
          currentY += titleFormulaH + lineSpacing;

          pdf.setTextColor(0, 0, 0);
          // endregion
          
          
          // Generar Tabla con los datos correspondientes
          const headers = ['Variable', 'Número Absoluto', 'Documento/Liga y Ubicación', 'Observación'];
          const data = [
            [elementVar.dV1, maTrim, elementVar.fV1, 'Anexo 1 - '+ obs1], // Fila 1
            [elementVar.dV2, metaAlTotal, elementVar.fV2, 'Anexo 2 - ' + obs2] // Fila 2
          ];


          

          // Estilos de la tabla 
          const tableStartY = currentY;
          (pdf as any).autoTable({
            head: [headers],
            body: data,
            startY: tableStartY,
            theme: 'grid', // Asegura que las líneas estén visibles
            tableLineColor: [105, 105, 105], // Color de las líneas (en RGB, aquí un gris oscuro)
            tableLineWidth: 0.5, // Grosor de las líneas
            headStyles: {
              fillColor: [87, 87, 87],
              textColor: [255, 255, 255], // Texto blanco
              fontSize: 10, // Tamaño de fuente
              halign: 'center', // Alineación horizontal
              cellPadding: 2, // Padding en las celdas
            },
            bodyStyles: {
              textColor: [0, 0, 0],
              fontSize: 9, // Tamaño de fuente para las celdas
              halign: 'center', // Alineación horizontal
              cellPadding: 1,
              fontStyle: "italic", // Solo un valor
              font: "times"  // Fuente personalizada
          },          
            margin: { top: 10, left: 35, right: 35 },
          });
          
    
          currentY = (pdf as any).lastAutoTable.finalY + 70; // Posicionar después de la tabla


          // region Firmas

          let espaceFirmas = marginX;
          this.firmas.forEach(element => {
              const nombre = element.cNombre + ' ' + element.cPaterno + ' ' + element.cMaterno;
              const sizeNombre = pdf.getTextDimensions(nombre).w;

              pdf.setTextColor(163, 163, 163);
              pdf.setFontSize(8);
              pdf.text(nombre, espaceFirmas, currentY);

              const puesto = element.cPuesto;
              const sizePuesto = pdf.getTextDimensions(puesto).w;
              
              // Calcular la posición X para centrar el puesto bajo el nombre
              const centroNombre = espaceFirmas + (sizeNombre / 2);
              const posPuesto = centroNombre - (sizePuesto / 2);

              pdf.text(puesto, posPuesto, currentY + 4);
              espaceFirmas += sizeNombre + (pdfWidth / this.firmas.length);
          });

          currentY += 13;


          pdf.setTextColor(0, 0, 0);
          const widthPagina = pdf.getTextDimensions('pagina '+ (i + 1)).w;
          pdf.text('pagina '+ (i + 1), (pdfWidth - widthPagina) - 20, currentY )

          
          // endregion
    
          // Si no es la última iteración, agregar nueva página
          if (i < this.datos.length - 1) {
            pdf.addPage(); // Agregar nueva página
          }
        }
    
        
        
        // Generar el PDF
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        
        if (newTab) {
          newTab.location.href = url; // Actualizar la ubicación cuando el PDF esté listo
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
        }        
      } catch (error) {
        console.error('Error al generar el PDF:', error);
      }
    }
    
    /**
     * Permite crear el pdf de las mir del proyecto
     * @param trimestre 
     */
    async generarPdfSeguimiento( trimestre: number): Promise<void>{
      try{
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

        this.firmas = await new Promise<any[]>((resolve, reject) => {
          this.firmasService.getFirmasProyecto(this.idProyecto).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          )
        })

        this.datosProyecto = await new Promise<any[]>((resolve, reject) => {
          this.proyectoData.getMirProyecto(this.idArea).subscribe(
            (data) => resolve(data),
            (error) => reject(error)
          );
        });

        this.firmasService.getFirmasProyecto(this.idProyecto).subscribe(data => {
          this.firmas = data;
        });

        
        let trimTitle = '';

        const pdf = new jsPDF({
          orientation: 'l', // 'portrait' para vertical, 'landscape' para horizontal
          unit: 'mm',              // Establece las unidades en milímetros
          format: [216, 356]       // Medidas del tamaño oficio en mm [ancho, alto]
        });

        // Definir las longitudes de la hoja Oficio de manera horizontal
        const achoHoja = 356;
        const altoHoja = 216;


        // Bucle para recorres todos los elementos de la consulta para poder reportar en el pdf
        for(let i = 0; i<this.datosProyecto.length; i++){
          // Variables requeridas dentro de la funcion para los calculos dependuiendo del trimestre
          let tipoIndicador = '';
          let metaProgramada = 0;
          let metaProgramadaAnual = 0;
          let metaAlcanzada = 0;
          let avanceTrimestral = 0;
          let avanceAnual = 0;
          let cuasa ='';
          let efecto = '';


        // Switch para determinar el trimestre actual y los dato dependiendo de este mismo

          switch(trimestre){

            // Datos Primer Trimestre
            case 1:
              trimTitle = 'Primer Trimestre ' + this.year;
              cuasa = this.datosProyecto[i].Cuausa1 ?? '';
              efecto = this.datosProyecto[i].Efecto1 ?? '';
              metaProgramada = this.datosProyecto[i].m1_p ?? 0;
              metaAlcanzada = this.datosProyecto[i].MetaAlcanzadaTrim1 ?? 0;

              metaProgramadaAnual = this.datosProyecto[i].ma_p;   

              if(metaProgramada === 0){
                avanceTrimestral = 0;
                avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
              }else{
                avanceTrimestral = parseFloat(((metaAlcanzada / metaProgramada) * 100).toFixed(2));

                if(this.datosProyecto[i].cMeta === 'Constante'){
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2)) ;

                } else if(this.datosProyecto[i].cMeta === 'Acumulada'){
                  metaProgramadaAnual = this.datosProyecto[i].m1_p + this.datosProyecto[i].m2_p + this.datosProyecto[i].m3_p + this.datosProyecto[i].m4_p;   
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));

                } else if(this.datosProyecto[i].cMeta === 'Especial'){
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramada) * 100).toFixed(2));
                }
                else if(this.datosProyecto[i].cMeta === 'Especial'){
                  avanceAnual = (this.datosProyecto[i].MetaAlcanzadaTrim1 / metaProgramadaAnual) * 100;
                }
              }
              break;

            // Datos Segundo Trimestre
            case 2:
              trimTitle = 'Segundo Trimestre ' + this.year;
              cuasa = this.datosProyecto[i].Cuausa2 ?? '';
              efecto = this.datosProyecto[i].Efecto2 ?? '';
              metaProgramada = this.datosProyecto[i].m2_p;
              metaAlcanzada = this.datosProyecto[i].MetaAlcanzadaTrim1 ?? 0  +  this.datosProyecto[i].MetaAlcanzadaTrim2 ?? 0 ;
              metaProgramadaAnual = this.datosProyecto[i].ma_p;   

              if(metaProgramada === 0){
                avanceTrimestral = 0;
                avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
              }else{
                avanceTrimestral = parseFloat(((metaAlcanzada / metaProgramada) * 100).toFixed(2));

                if(this.datosProyecto[i].cMeta === 'Constante'){
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2)) ;

                } else if(this.datosProyecto[i].cMeta === 'Acumulada'){
                  metaProgramadaAnual = this.datosProyecto[i].m1_p + this.datosProyecto[i].m2_p + this.datosProyecto[i].m3_p + this.datosProyecto[i].m4_p;   
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
                }
                else if(this.datosProyecto[i].cMeta === 'Especial'){
                  avanceAnual = (this.datosProyecto[i].MetaAlcanzadaTrim2 / metaProgramadaAnual) * 100;
                }
              }
              break;
            
            // Datos Tercer Trimestre
            case 3:
              trimTitle = 'Tercer Trimestre ' + this.year;
              cuasa = this.datosProyecto[i].Cuausa3 ?? '';
              efecto = this.datosProyecto[i].Efecto3 ?? '';
              metaProgramada = this.datosProyecto[i].m3_p;
              metaAlcanzada = this.datosProyecto[i].MetaAlcanzadaTrim1 ?? 0 +  this.datosProyecto[i].MetaAlcanzadaTrim2 ?? 0  + this.datosProyecto[i].MetaAlcanzadaTrim3 ?? 0 ;
              metaProgramadaAnual = this.datosProyecto[i].ma_p;   

              if(metaProgramada === 0){
                avanceTrimestral = 0;
                avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
              }else{
                avanceTrimestral = parseFloat(((metaAlcanzada / metaProgramada) * 100).toFixed(2));

                if(this.datosProyecto[i].cMeta === 'Constante'){
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2)) ;

                } else if(this.datosProyecto[i].cMeta === 'Acumulada'){
                  metaProgramadaAnual = this.datosProyecto[i].m1_p + this.datosProyecto[i].m2_p + this.datosProyecto[i].m3_p + this.datosProyecto[i].m4_p;   
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
                }
                else if(this.datosProyecto[i].cMeta === 'Especial'){
                  avanceAnual = (this.datosProyecto[i].MetaAlcanzadaTrim3 / metaProgramadaAnual) * 100;
                }
              }
              break

            // Datos Cuarto Trimestre
            case 4:
              trimTitle = 'Cuarto Trimestre ' + this.year;
              cuasa = this.datosProyecto[i].Cuausa4 ?? '';
              efecto = this.datosProyecto[i].Efecto4 ?? '';
              metaProgramada = this.datosProyecto[i].m4_p;
              metaAlcanzada = this.datosProyecto[i].MetaAlcanzadaTrim1 ??0 +  this.datosProyecto[i].MetaAlcanzadaTrim2 ?? 0 + this.datosProyecto[i].MetaAlcanzadaTrim3 ?? 0 +  this.datosProyecto[i].MetaAlcanzadaTrim2 ?? 0; 
              metaProgramadaAnual = this.datosProyecto[i].ma_p;   

              if(metaProgramada === 0){
                avanceTrimestral = 0;
                avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
              }else{
                avanceTrimestral = parseFloat(((metaAlcanzada / metaProgramada) * 100).toFixed(2));

                if(this.datosProyecto[i].cMeta === 'Constante'){
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2)) ;

                } else if(this.datosProyecto[i].cMeta === 'Acumulada'){
                  metaProgramadaAnual = this.datosProyecto[i].m1_p + this.datosProyecto[i].m2_p + this.datosProyecto[i].m3_p + this.datosProyecto[i].m4_p;   
                  avanceAnual = parseFloat(((metaAlcanzada / metaProgramadaAnual) * 100).toFixed(2));
                }
                else if(this.datosProyecto[i].cMeta === 'Especial'){
                  avanceAnual = (this.datosProyecto[i].MetaAlcanzadaTrim4 / metaProgramadaAnual) * 100;
                }
              }
              break;
            // Datos Anuales
            case 5:
              metaProgramada = this.datosProyecto[i].ma_p;
              break;
          }

          // Switch para definir el tipo de indicador que es cada elemento de la consulta 
          switch(this.datosProyecto[i].idNivelIndicador){
            case 1:
              tipoIndicador = 'Fin';
              break;
            case 2:
              tipoIndicador = 'Propósito'
              break;
            case 3:
              tipoIndicador = 'Componente';
              break;
            case 4:
              tipoIndicador = 'Actividad'
              break;
          }

          let currentY = 5; 

          // Agregar Encabezado con Logo
          const logoUrl = '/img/encabezadosPDF/encabezadosed1.jpg'; // Ruta relativa del logo
          const logo = new Image();
          logo.src = logoUrl;
    
          await new Promise((resolve, reject) => {
            logo.onload = () => {
              const logoWidth = 270;
              const logoHeight = 28;
              const x = ((achoHoja - logoWidth) / 2) - 16; // Centrar la imagen
              pdf.addImage(logo, 'JPEG', x, currentY, logoWidth, logoHeight);
              resolve(true);
            };
            logo.onerror = reject;
          });
    
          currentY += 28 + 5; // Altura del logo + margen inferior dinámico
    
    
          // TITULO UNIDAD OPERATIVA
          const title = this.cUnidadOperante || "Título por Defecto";
          pdf.setFontSize(9);
          pdf.setFont('Helvetica', 'bold');
          const textWidth = pdf.getTextWidth(title);
          const textX = (achoHoja - textWidth) / 2; // Centrar el título
          pdf.text(title, textX, currentY);
    
          
          //Agregar trimestre actual
          const titleTrim = trimTitle || '';
          pdf.setFontSize(10)
          pdf.setFont('Helvetica', 'bold');
          const textTrimWidth = pdf.getTextWidth(titleTrim);
          const xTrim = (textWidth) + (textTrimWidth) * 5; 
          pdf.text(titleTrim, xTrim, currentY);
    
          currentY += 7; // Incrementar según el tamaño del texto
    

          
          // Generar Tabla con los datos correspondientes
          const headers = ['Nivel', 'Resumen', 'Indicador', 
                            'Fórmula', 'Unidad de Medida', 
                            'Tipo de Cálculo', 'Tipo de Dimensión', 'Programada', 
                            'Reprogramada', 'Alcanzada', 'Avance Trimestral', 
                            'Avance Anual']; // Headers de la tabla
    
          // Datos insertados y dibujados en la tabla
          const data = [
            [tipoIndicador + '\n' + this.datosProyecto[i].numCA,
              this.datosProyecto[i].RN,
              this.datosProyecto[i].Indicador,
              this.datosProyecto[i].formula,
              this.datosProyecto[i].cUniMedida,
              this.datosProyecto[i].cUniMedida,
              this.datosProyecto[i].cDimension,
              metaProgramada,
              metaProgramada,
              metaAlcanzada,
              avanceTrimestral + '%',
              avanceAnual + '%'
            ],
            [{ content: "Causas de las variaciones", colSpan: 2 }, {content: cuasa, colSpan: 10}],
            [{ content: "Efectos de las variaciones", colSpan: 2 }, {content: efecto, colSpan: 10}],
          ];
    
    
          
    
          // Estilos de la tabla 
          const tableStartY = currentY;
          (pdf as any).autoTable({
            head: [headers],
            body: data,
            startY: tableStartY,
            theme: 'grid', // Asegura que las líneas estén visibles
            tableLineColor: [105, 105, 105], // Color de las líneas (en RGB, aquí un gris oscuro)
            tableLineWidth: 0.5, // Grosor de las líneas
            headStyles: {
              fillColor: [87, 87, 87],
              textColor: [255, 255, 255], // Texto blanco
              fontSize: 9, // Tamaño de fuente
              halign: 'center', // Alineación horizontal
              cellPadding: 2, // Padding en las celdas
            },
            bodyStyles: {
              textColor: [0, 0, 0],
              fontSize: 10, // Tamaño de fuente para las celdas
              halign: 'center',
              valign: 'middle',
              cellPadding: 2,
              fontStyle: "italic", // Solo un valor
              font: "times"  // Fuente personalizada
          },          
            margin: { top: 10, left: 10, right: 10 },
          });
    
          // Colocar firmas

          let margenIzquierdo = 10; // Margen izquierdo
          let margenDerecho = 10; // Margen derecho
          let anchoDisponible = achoHoja - margenIzquierdo - margenDerecho; // Ancho disponible entre los márgenes
          let espacioEntreFirmas = anchoDisponible / this.firmas.length; // Espacio horizontal para cada firma
          let poscionFirmasY = altoHoja - 20; // Posición Y para las firmas

          this.firmas.forEach((element, index) => {
            // Datos de la firma
            const nombre = `${element.cNombre} ${element.cPaterno} ${element.cMaterno}`;
            const puesto = element.cPuesto;

            // Calcular posición X del centro del espacio asignado para cada firma
            const espacioFirmaInicio = margenIzquierdo + (index * espacioEntreFirmas);
            const centroFirma = espacioFirmaInicio + (espacioEntreFirmas / 2);

            // Tamaño del texto
            const sizeNombre = pdf.getTextWidth(nombre);
            const sizePuesto = pdf.getTextWidth(puesto);

            // Calcular posiciones ajustadas para que el texto esté centrado
            const nombreX = centroFirma - (sizeNombre / 2);
            const puestoX = centroFirma - (sizePuesto / 2);

            // Dibujar el nombre
            pdf.setTextColor(163, 163, 163);
            pdf.setFontSize(8);
            pdf.text(nombre, nombreX, poscionFirmasY);

            // Dibujar el puesto
            pdf.text(puesto, puestoX, poscionFirmasY + 4);
            pdf.setTextColor(0, 0, 0);
          });


            
          
          if (i < this.datosProyecto.length - 1) {
            pdf.addPage(); // Agregar nueva página
          } // Posicionar después de la tabla
        } // Fin bucle


        
        // Generar el PDF
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        
        if (newTab) {
          newTab.location.href = url; // Actualizar la ubicación cuando el PDF esté listo
        } else {
          console.error('No se pudo abrir una nueva pestaña.');
        }
      }catch (error) {
        console.error('Error al generar el PDF:', error);
      }
            
    }

    async generarPdfResulIndicador(){

      const pdf = new jsPDF('p', 'mm', 'a4'); // PDF en formato A4 Vertical

      this.pdfGenerator.addHeader(pdf,this.cUnidadOperante, 'Primer Trimestre', '/img/encabezadosPDF/encabezadosed3.jpg');

      this.pdfGenerator.generateBlob(pdf);
    }
}
