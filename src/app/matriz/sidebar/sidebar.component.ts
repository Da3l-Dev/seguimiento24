import { Component, Renderer2 } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { Router } from '@angular/router';
import { Variables } from '../model/variables.model';
import { SharedDataService } from '../../services/shared-data.service';
import { MetaProgramas } from '../model/metasProgramadas.model';
import { Seguimiento } from '../model/seguimiento.model';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';
import { Indicador } from '../model/indicador.model';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FilesServicesService } from '../../services/files-services.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  // Asignacion de los modelos para poder asignar datos
  proyectoModel: Indicador | null = null;
  variablesModel: Variables | null = null;
  metasProgramadasModel: MetaProgramas | null= null;
  metasAlcanzadasModel: metasAlcanzadas | null= null;
  seguimientoModel: Seguimiento | null = null;

  // Iniciacion de arreglos para poder obtener datos desde el servicio
  proyectoData: any[] = [];
  variableData: any[] = [];
  metasProgData: any[] = [];
  metasAlcanzadasData: any[] = [];
  seguimientoData: any[] = [];
  rutasMirArea: any[] = [];

  cUnidadOperante: string = '';
  idArea: number = 0;
  programaArea: number = 0;
  year: number = new Date().getFullYear();

  selectedComponenteId: number | null = null;
  selectedIndicadorId: number | null = null;
  loading: boolean | undefined;
  serverStatus: string | undefined;

  constructor(
    private userService: UserService,
    private datosService: DatosProyectosService,
    private renderer: Renderer2,
    private filesService: FilesServicesService,
    private sharedata: SharedDataService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true; // Indicador de carga para bloquear la interacción

    
    this.userService.getUserData().subscribe(user => {
      if (user) {
        this.cUnidadOperante = user.cUnidadOperante;
        this.idArea = user.idArea;
        this.obtenerRutasMir();
      }
    });

    // Utilizar forkJoin para esperar a que todas las llamadas HTTP se completen
    this.toastr.info("Permite que todos los datos carguen correctamente","Cargando datos",{
      progressBar: true,
      timeOut:1800,
      positionClass: 'toast-bottom-right'
    });
    forkJoin({
      proyectoData: this.datosService.getDataProyects(this.idArea, this.year),
      variableData: this.datosService.getVariables(this.idArea, this.year),
      metasProgData: this.datosService.getMetasProg(this.idArea, this.year),
      seguimientoData: this.datosService.getSeguimiento(this.idArea),
      metasAlcanzadasData: this.datosService.getMetasAlcanzadas(this.idArea)
    }).subscribe(
      (result) => {
        
        // Asignar los datos recibidos a las propiedades del componente
        this.proyectoData = result.proyectoData;
        this.variableData = result.variableData;
        this.metasProgData = result.metasProgData;
        this.seguimientoData = result.seguimientoData;
        this.metasAlcanzadasData = result.metasAlcanzadasData;
  
        this.loading = false; 
        this.serverStatus = 'Activo'; 
        this.toastr.success( "Bienvenido al Seguimiento Siplaneva","Datos cargados", {
          positionClass: 'toast-bottom-right'
        });

      },
      (error) => {
        console.error('Error al cargar los datos:', error);
        this.loading = false;
        this.serverStatus = 'Desactivado';  // Permitir interacción incluso si hay un error
      }
    );
  }

  // Función para filtrar y asignar datos al modelo
  setDataArea(idNivelIndicador: number, idComponente: number | null = null, idActividad: number | null = null): void {
    // Filtro para poder indetificar el elemento entre distintos indicadores
    const nivelMap: Record<number, () => any> = {
      1: () => this.proyectoData.find((element) => element.idNivelIndicador === 1),
      2: () => this.proyectoData.find((element) => element.idNivelIndicador === 2),
      3: () => this.proyectoData.find((element) => element.idNivelIndicador === 3 && element.idComponente === idComponente),
      4: () => this.proyectoData.find((element) => element.idNivelIndicador === 4 && element.idActividad === idActividad && element.idComponente === idComponente),
    };
    
    const elementoSeleccionado = nivelMap[idNivelIndicador]?.();
  
    if (elementoSeleccionado) {
      this.asignarModeloDataProject(elementoSeleccionado, idNivelIndicador);
    } else {
      console.log(`No se encontró el elemento con idNivelIndicador: ${idNivelIndicador}, idComponente: ${idComponente}, idActividad: ${idActividad}`);
    }
  }
  
  
  // Función para asignar valores al modelo del proyecto
  asignarModeloDataProject(element: any, idIndicador: number): void {
    // element en este caso es el array que tiene los datos (proyectoData) seleccionados
    let tipo: string;

    // Otorgar o clasificar a que tipo de indicador pertenece
    switch (idIndicador) {
      case 1:
        tipo = 'FIN';
        break;
      case 2:
        tipo = 'PROPOSITO';
        break;
      case 3:
        tipo = 'COMPONENTE';
        break;
      case 4:
        tipo = 'ACTIVIDAD';
        break;
      default:
        console.log(`Tipo de indicador no válido: ${idIndicador}`);
        return;
    }

    // Asignar datos del proyecto
    this.proyectoModel = {
      idIndicador: element.idIndicador, // Nota este id indica el numero de de elemento 1,2,3,4,5
      idRamo: element.idRamo,
      idFuenteFinan: element.idFuenteFinan,
      idPrograma: element.idPrograma,
      visualizar: 1,
      tipo: tipo,
      item: idIndicador,
      proyecto: element.idProyecto,
      rn: element.RN,
      indicador: element.Indicador,
      numca: element.numCA,
      mv: element.MV,
      supuestos: element.supuestos,
      formula: element.formula,
      defindicador: element.defIndicador,
      umedida: element.cUniMedida,
      umedible: element.cUniMedible,
      cdm: element.idDM,
      csi: element.idSI,
      ccm: element.idCM,
      cfm: element.idFM,
    };

    // Buscar los datos de las variables por medio del idIndicador y asignar datos a su modelo
    const variableElement = this.variableData.find((variable) => variable.idIndica === element.idIndicador);
    
    this.variablesModel = {
      idIndicador: variableElement.idIndica,
      descripcionV1: variableElement.dV1,
      valorV1: variableElement.vV1,
      fuenteV1: variableElement.fV1,
      descripcionV2: variableElement.dV2,
      valorV2: variableElement.vV2,
      fuenteV2: variableElement.fV2
    };
    
    // Buscar arreglo de metas programadas que pertece a indicador y asignar valores al model
    const metasProgramadas = this.metasProgData.find((metasP) => metasP.idIndica === element.idIndicador);

    this.metasProgramadasModel = {
      idIndicador: metasProgramadas.idIndica,
      m1_p: metasProgramadas.m1_p,
      m2_p: metasProgramadas.m2_p,
      m3_p: metasProgramadas.m3_p,
      m4_p: metasProgramadas.m4_p,
      suma_mp: (metasProgramadas.m1_p + metasProgramadas.m2_p + metasProgramadas.m3_p + metasProgramadas.m4_p),
      ma_p: metasProgramadas.ma_p,
      alb: metasProgramadas.alb,
      vlb: metasProgramadas.vlb,
      plb: metasProgramadas.plb,
    };

  
    // Buscar el arreglo del seguimiento del indicador
    const seguimiento = this.seguimientoData.find((seguimiento) => seguimiento.idIndica === element.idIndicador);
    

    this.seguimientoModel = {
      // Asignar resumen 
      RS1: seguimiento.resumenTrim1,
      RS2: seguimiento.resumenTrim2,
      RS3: seguimiento.resumenTrim3,
      RS4: seguimiento.resumenTrim4,
      // Asignar indicadores
      IS1: seguimiento.indicadorTrim1,
      IS2: seguimiento.indicadorTrim2,
      IS3: seguimiento.indicadorTrim3,
      IS4: seguimiento.indicadorTrim4,
      // Asignar metas
      MS1: seguimiento.metaTrim1,
      MS2: seguimiento.metaTrim2,
      MS3: seguimiento.metaTrim3,
      MS4: seguimiento.metaTrim4,
      // Asignar Justificacion 
      JS1: seguimiento.justificaTrim1,
      JS2: seguimiento.justificaTrim2,
      JS3: seguimiento.justificaTrim3,
      JS4: seguimiento.justificaTrim4,
      // Asignar medios
      MDS1: seguimiento.mediosTrim1,
      MDS2: seguimiento.mediosTrim2,
      MDS3: seguimiento.mediosTrim3,
      MDS4: seguimiento.mediosTrim4,
      // Asignar hallazgos
      HS1: seguimiento.hallazgosTrim1,
      HS2: seguimiento.hallazgosTrim2,
      HS3: seguimiento.hallazgosTrim3,
      HS4: seguimiento.hallazgosTrim4,
      // Asignar mejoras
      MJS1: seguimiento.mejoraTrim1,
      MJS2: seguimiento.mejoraTrim2,
      MJS3: seguimiento.mejoraTrim3,
      MJS4: seguimiento.mejoraTrim4,
      // Asignar evaluador
      ES1: seguimiento.evaluadorTrim1,
      ES2: seguimiento.evaluadorTrim2,
      ES3: seguimiento.evaluadorTrim3,
      ES4: seguimiento.evaluadorTrim4,
    }

    // Buscar el arreglo de metas alcanzadas que pertenecen al indicador
    const metasAlcanzadas = this.metasAlcanzadasData.find((metasA) => metasA.idIndica === element.idIndicador);

    this.metasAlcanzadasModel = {
      idIndica: metasAlcanzadas.idIndica,
      // Asignar Metas por trimestre
      M1: metasAlcanzadas.MetaAlcanzadaTrim1,
      M2: metasAlcanzadas.MetaAlcanzadaTrim2,
      M3: metasAlcanzadas.MetaAlcanzadaTrim3,
      M4: metasAlcanzadas.MetaAlcanzadaTrim4,
      // Asignar causas
      C1: metasAlcanzadas.Causa1,
      C2: metasAlcanzadas.Causa2,
      C3: metasAlcanzadas.Causa3,
      C4: metasAlcanzadas.Causa4,
      C5: metasAlcanzadas.Causa5,
      // Asignar Efectos
      E1: metasAlcanzadas.Efecto1,
      E2: metasAlcanzadas.Efecto2,
      E3: metasAlcanzadas.Efecto3,
      E4: metasAlcanzadas.Efecto4,
      E5: metasAlcanzadas.Efecto5,
      // Asignar Evidencias
      EV1: metasAlcanzadas.Evidencia1,
      EV2: metasAlcanzadas.Evidencia2,
      EV3: metasAlcanzadas.Evidencia3,
      EV4: metasAlcanzadas.Evidencia4,
      // Asignar Rutas
      R1: metasAlcanzadas.Ruta1,
      R2: metasAlcanzadas.Ruta2,
      R3: metasAlcanzadas.Ruta3,
      R4: metasAlcanzadas.Ruta4,
      // Asignar Observaciones 1
      OB1_1: metasAlcanzadas.Obs1_1,
      OB1_2: metasAlcanzadas.Obs1_2,
      OB1_3: metasAlcanzadas.Obs1_3,
      OB1_4: metasAlcanzadas.Obs1_4,
      // Asignar Observaciones 2
      OB2_1: metasAlcanzadas.Obs2_1,
      OB2_2: metasAlcanzadas.Obs2_2,
      OB2_3: metasAlcanzadas.Obs2_3,
      OB2_4: metasAlcanzadas.Obs2_4,

      // Obtener meta anual
      la: (metasAlcanzadas.MetaAlcanzadaTrim1 ?? 0) +
          (metasAlcanzadas.MetaAlcanzadaTrim2 ?? 0) +
          (metasAlcanzadas.MetaAlcanzadaTrim3 ?? 0) +
          (metasAlcanzadas.MetaAlcanzadaTrim4 ?? 0),
    }

    // Compartir los modelos de datos para usar en otros componentes
    this.sharedata.setProyectoModel(this.proyectoModel);
    this.sharedata.setVariablesModel(this.variablesModel);
    this.sharedata.setMetasProgModel(this.metasProgramadasModel);
    this.sharedata.setSeguimientoModel(this.seguimientoModel);
    this.sharedata.setMetasAlcanzadasModel(this.metasAlcanzadasModel);
  }

  selectComponent(idIndicador: number, idComponente: number | null = null, idActividad: number | null = null): void {
    this.selectedIndicadorId = idIndicador;
    this.selectedComponenteId = idComponente;
    this.setDataArea(idIndicador, idComponente, idActividad);
  }

  cambiarEstilos(tipoIndicador: string): void {
    const elementos = ['F', 'P', 'C', 'A'];
  
    elementos.forEach((id) => {
      const elemento = document.querySelector(`#${id}`) as HTMLElement;
      if (elemento) {
        const color = id === tipoIndicador ? '#575757' : '#691B31';
        this.renderer.setStyle(elemento, 'backgroundColor', color);
      }
    });
  }  

  obtenerRutasMir() : void{
    this.filesService.obtenerRutasMirArea(this.idArea).subscribe(data => {
      if(data){
        this.rutasMirArea = data;
      }else{
        console.error('Error no se encotraron rutas');
      }
    });
  }
}