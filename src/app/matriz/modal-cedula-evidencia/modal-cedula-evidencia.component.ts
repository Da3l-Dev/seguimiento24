import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Variables } from '../model/variables.model';
import { UserService } from '../../services/user.service';
import { forkJoin, from } from 'rxjs';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { Indicador } from '../model/indicador.model';
import { ToastrService } from 'ngx-toastr';
import { FilesServicesService } from '../../services/files-services.service';
import * as bootstrap from 'bootstrap';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';
import { error } from 'console';
import { ConfirmationService } from '../../services/confirmation.service';
import { DialogConfirm } from '../model/dialogCofirm.model';

@Component({
  selector: 'app-modal-cedula-evidencia',
  templateUrl: './modal-cedula-evidencia.component.html',
  styleUrls: ['./modal-cedula-evidencia.component.scss']
})
export class ModalCedulaEvidenciaComponent implements OnInit {
  idArea: number = 0;
  variablesModel: Variables | null = null;
  indicador: Indicador | null = null;
  metasAlcanzadas: metasAlcanzadas | null = null;
  trimActivo: any[] = [];
  datosConfirmDialog: DialogConfirm | null = null;
  trimestre: number = 0;
  messageError: string = '';
  nuevoDocumento: File | null = null;
  descripcionEvidencia: string = '';
  year: number = 2024;

  ruta: String = "";

  constructor(
    private proyectoServiceData: DatosProyectosService,
    private userServiceData: UserService,
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private confirmDialog : ConfirmationService,
    private fileService: FilesServicesService,
    private confirmDialogService: ConfirmationService
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario
    this.userServiceData.getUserData().subscribe((user) => {
      if (user) {
        this.idArea = user.idArea;
      }
    });

    // Obtener datos compartidos del Indicador
    this.sharedDataService.indicadorModel$.subscribe((data) => {
      this.indicador = data;
    });

    
    // Obtener los trimestres activos
    forkJoin({
      trimActivo: this.proyectoServiceData.getTrimActivo(this.idArea),
    }).subscribe(
      (result) => {
        this.trimActivo = result.trimActivo;
      },
      (error) => {
        console.error('Error al cargar los datos:', error);
        this.toastr.error(
          'No se pudieron cargar los datos de trimestres activos',
          'Error', {
            positionClass: 'toast-bottom-right'
          }
        );
      }
    );

    // Configurar eventos del modal
    this.setupModalEvents();
  }

  setupModalEvents(): void {
    const modal = document.getElementById('cedulaEvidenciaDos');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
        this.closeCollapse();
      });
      modal.addEventListener('shown.bs.modal', () => {
        this.closeCollapse(); // Asegura que siempre inicie cerrado
      });
    }
  }


  closeCollapse(): void {
    const collapseElement = document.getElementById('CollapseCedula');
    if (collapseElement) {
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
      collapseInstance.hide();
    }
  }

  setTrimestre(trim: number): void {
    this.trimestre = trim;
    this.obtenerRuta();
    console.log(`Trimestre seleccionado: ${this.trimestre}`);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log("file: " + file)
    if (file) {
      this.nuevoDocumento = file;
    }
  }

  limpiarFormulario(): void {
    this.nuevoDocumento = null;
    this.descripcionEvidencia = '';
    this.messageError = '';
    this.trimestre = 0;
    (document.getElementById('nuevoDocumento') as HTMLInputElement).value = ''; // Limpia el input de archivo
  }

  subirArchivoEvidencia(): void {
    let subirArchivo = true;
    if (!this.nuevoDocumento && !this.descripcionEvidencia) {
      this.messageError = 'Debe seleccionar un archivo y una descripcion.';
      return;
    }

    if (!this.nuevoDocumento) {
      this.messageError = 'Debes agregar un archivo.';
      return;
    }

    if (!this.descripcionEvidencia) {
      this.messageError = 'La descripción es obligatoria.';
      return;
    }

    if (!this.indicador) {
      this.toastr.error('No se encontraron datos del indicador.', 'Error', {
        positionClass: 'toast-bottom-right'
      });
      return;
    }

    const formData = new FormData();

    this.confirmDialog.open('¿Estas seguro de que quieres guardar el archivo?');

    this.sharedDataService.confirmDialog$.subscribe(data => {
      if(data){
        if (data.confirm && data.cancel === false && subirArchivo) {

          // Crear FormData
          formData.append('idEjercicio', this.year.toString());
          formData.append('idRamo', this.indicador?.idRamo?.toString() || '');
          formData.append('idFuenteFinan', this.indicador?.idFuenteFinan?.toString() || '');
          formData.append('idPrograma', this.indicador?.idPrograma?.toString() || '');
          formData.append('idArea', this.idArea.toString());
          formData.append('idIndicador', this.indicador?.idIndicador?.toString() || '');
          formData.append('idTrimestre', this.trimestre.toString());
          formData.append('rutaFiles', this.nuevoDocumento?? "");
          formData.append('descripcion', this.descripcionEvidencia);

          // Enviar FormData
          this.fileService.subirArchivoEvidencia(formData).subscribe(
            (response) => {
              this.toastr.success('Archivo subido exitosamente', 'Éxito', {
                positionClass: 'toast-bottom-right'
              });
              console.log(response);
              this.limpiarFormulario();

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

          subirArchivo = false;
        }
      }
    });
  }

  obtenerRuta() : void{
    // Crear el objeto con los parámetros necesarios
    const params = {
      idEjercicio: this.year.toString(),
      idIndicador: this.indicador?.idIndicador?.toString() || '',
      idArea: this.idArea.toString(),
      idPrograma: this.indicador?.idPrograma?.toString() || '',
      idTrimestre: this.trimestre.toString()
    };

    this.fileService.obtenerEvidenciaRuta(params).subscribe(
      response => {
        this.ruta = response.ruta;
      },
      (error) => {
        this.ruta = "";
      }

  )
  }

  eliminarArchivo(): void {
    let eliminar = true;
    this.confirmDialog.open('¿Estás seguro de eliminar el archivo del trimestre ' + this.trimestre + '?');
  
    
    this.sharedDataService.confirmDialog$.subscribe(data => {
      if (data) {
        if (data.confirm && data.cancel === false && eliminar) {
          eliminar = false;
          const params = {
            idEjercicio: this.year.toString(),
            idIndicador: this.indicador?.idIndicador?.toString() || '',
            idArea: this.idArea.toString(),
            idPrograma: this.indicador?.idPrograma?.toString() || '',
            idTrimestre: this.trimestre.toString()
          };
        
          this.fileService.eliminarRutaEvidencia(params).subscribe(response => {
            this.toastr.success('Archivo Eliminado exitosamente', 'Éxito', {
              positionClass: 'toast-bottom-right'
            });

            this.obtenerRuta();
          }, error => {
            console.error('Error al eliminar archivo:', error);
          });

          
          
        } else if (data.cancel && data.confirm === false) {
          console.log('El archivo NO ha sido eliminado');
        }
      }
    });
  }
  
}
