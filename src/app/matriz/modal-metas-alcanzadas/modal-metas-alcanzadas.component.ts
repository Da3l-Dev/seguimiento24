import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { UserService } from '../../services/user.service';
import { elementAt, forkJoin, from } from 'rxjs';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { Indicador } from '../model/indicador.model';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';
import { MetaProgramas } from '../model/metasProgramadas.model';
import { Variables } from '../model/variables.model';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-modal-metas-alcanzadas',
  templateUrl: './modal-metas-alcanzadas.component.html',
  styleUrls: ['./modal-metas-alcanzadas.component.scss']
})
export class ModalMetasAlcanzadasComponent implements OnInit {
  constructor(
    private proyectoServiceData: DatosProyectosService,
    private userServiceData: UserService,
    private sharedDataService: SharedDataService,
    private toastr: ToastrService
  ) {}

 
  idArea: number = 0;
  year: number = new Date().getFullYear();
  trimActivo: any[] = [];
  logrosArea: any[] = [];
  trimestre: number = 0;
  indicador: Indicador | null = null;
  variables: Variables | null = null;
  metasAlcanzadas: metasAlcanzadas | null = null;
  metasProgramadas: MetaProgramas | null = null;
  

  // Variables para poder indentificar que valores puedo caragar
  logro: number = 0;
  ob1 : string = '';
  ob2 : string = '';
  causa: string = '';
  efecto: string = '';
  messageError: string = '';
  messageErrorGlobal : string = '';
  messageinfo: string = '';
  

  ngOnInit(): void {


    
    // Obtener datos del usuario
    this.userServiceData.getUserData().subscribe((user) => {
      if (user) {
        this.idArea = user.idArea;
      }
    });

    // Obtener los trimestres activos
   
    // Configurar eventos para el modal
    this.setupModalEvents();
  }

  setupModalEvents(): void {
    const modal = document.getElementById('ingresarMetasAlcanzadas');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.messageinfo = "";
        this.closeCollapse();
      });

      // Cargar los datos cuando el modal se ha iniciado
      modal.addEventListener('shown.bs.modal', () => {
        forkJoin({
          trimActivo: this.proyectoServiceData.getTrimActivo(this.idArea),
        }).subscribe(
          (result) => {
            this.trimActivo = result.trimActivo;
          },
          (error) => {
            console.error('Error al cargar los datos:', error);
            this.toastr.error('No se pudieron cargar los datos de trimestres activos', 'Error');
          }
        );
        
        this.cargarDatos();
        
        this.closeCollapse(); // Asegura que siempre inicie cerrado
      });
    }
  }

  cargarDatos():void{
    
    // Obtener datos compartidos del Indicador
    this.sharedDataService.indicadorModel$.subscribe((data) => {
      this.indicador = data;
    });

    this.sharedDataService.metasProgModel$.subscribe((data) => {
      this.metasProgramadas = data;
    })

    this.sharedDataService.variablesModel$.subscribe((data) => {
      this.variables = data;
    })

    this.sharedDataService.metasAlcanzadasModel$.subscribe(metas => {
      this.metasAlcanzadas = metas;
    });
    
  }

  closeCollapse(): void {
    const collapseElement = document.getElementById('collapseMetas');
    if (collapseElement) {
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });

      collapseInstance.hide();

    }else{
    }
  }

  setTrimestre(trim: number): void {
    this.obtenerLogros(this.year,this.idArea, trim, this.indicador?.idIndicador?? 0);
    this.trimestre = trim; 
  }


  obtenerLogros (idEjercicio:number ,idArea: number, idTrimestre: number, idIndicador: number) :void{

    
    this.proyectoServiceData.getLogros(this.year, idArea, idTrimestre, idIndicador).subscribe( (logros) =>{      
      if(logros){
        this.messageinfo ="";
        this.logrosArea = logros;
        this.logrosArea.forEach(logro => {
          this.logro = logro.logro ?? 0;
          this.causa = logro.causa ?? '';
          this.efecto = logro.efecto ?? '';
          this.ob1 = logro.obs1 ?? "";
          this.ob2 = logro.obs2 ?? "";
        });
      }
    }, (error) => {

      if (error.status === 404) {
        console.error("Error 404: ", error.error.message);
        
        this.messageinfo = 'El trimesre actual fue activado. Suba las metas alcanzadas para este trimestre';
        
        // Reiniciar las variables para que no se mantengan datos residuales
        this.logro = 0;
        this.causa = '';
        this.efecto = '';
        this.ob1 = '';
        this.ob2 = '';
        
      } else {
        // En caso de otros errores (por ejemplo, 500), mostramos un error general
        console.error("Error desconocido:", error);
        this.toastr.error('Hubo un problema al obtener los logros', 'Error', {
          positionClass: 'toast-bottom-right'
        });
      }
    });
  }

  subirMetasProgramadas() :void{
    if(!this.causa && !this.efecto && !this.ob1 && !this.ob2){
      this.messageErrorGlobal = "Recuerda agregar informacion en todos los campos";
    } else if (!this.causa){
      this.messageError = "Es obligatorio describir una causa";
    } else if (!this.efecto){
      this.messageError = "Es Obligatorio describir un efecto"
    } else if (!this.ob1 || this.ob2) {
      this.messageError = "Es obligatorio escribir una observacion"
    }

    if (!this.indicador) {
      this.toastr.error('No se encontraron datos del indicador.', 'Error', {
        positionClass: 'toast-bottom-right'
      });
      return;
    }




    // Crear FormData
    const formData = new FormData();
    formData.append('idEjercicio', this.year.toString());
    formData.append('idRamo', this.indicador.idRamo?.toString() || '');
    formData.append('idFuenteFinan', this.indicador.idFuenteFinan?.toString() || '');
    formData.append('idPrograma', this.indicador.idPrograma?.toString() || '');
    formData.append('idArea', this.idArea.toString());
    formData.append('idIndicador', this.indicador.idIndicador?.toString() || '');
    formData.append('idTrimestre', this.trimestre.toString());
    formData.append('logro', this.logro.toString());
    formData.append('causa', this.causa);
    formData.append('efecto', this.efecto);
    formData.append('obs1', this.ob1);
    formData.append('obs2', this.ob2);

    

    if (this.metasAlcanzadas) {
      switch (this.trimestre){
        case 1:
          this.metasAlcanzadas.M1 = this.logro;
          break;
        case 2:
          this.metasAlcanzadas.M2 = this.logro;
          break;
        case 3:
          this.metasAlcanzadas.M3 = this.logro;
          break;
        case 4:
          this.metasAlcanzadas.M4 = this.logro;
          break;
        default:
          this.metasAlcanzadas.M1 = 0;
          break;
      }
      this.sharedDataService.setMetasAlcanzadasModel(this.metasAlcanzadas);
    }
    

  

    this.proyectoServiceData.subirLogro(formData).subscribe(
      (response) => {
        this.toastr.success("Datos guardados exitosamente", 'Éxito', {
          positionClass: 'toast-bottom-right'
        });

        console.log(response);

        const modal = document.getElementById('cedulaEvidenciaDos');
        if (modal) {
          let bootstrapModal = bootstrap.Modal.getInstance(modal);
          if (!bootstrapModal) {
            bootstrapModal = new bootstrap.Modal(modal); // Inicializar el modal si no existe
          }
          bootstrapModal.hide();
        }
      },
      (error) => {
        this.toastr.error('Error al subir el archivo', 'Error' , {
          positionClass: 'toast-bottom-right'
        });
        console.error(error);
      }
    );
  }
}
