import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Variables } from '../model/variables.model';
import { UserService } from '../../services/user.service';
import { forkJoin } from 'rxjs';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { Indicador } from '../model/indicador.model';
import { ToastrService } from 'ngx-toastr';
import { FilesServicesService } from '../../services/files-services.service';
import * as bootstrap from 'bootstrap';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';

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
  trimestre: number = 0;
  messageError: string = '';
  nuevoDocumento: File | null = null;
  descripcionEvidencia: string = '';
  year: number = new Date().getFullYear();

  constructor(
    private proyectoServiceData: DatosProyectosService,
    private userServiceData: UserService,
    private sharedDataService: SharedDataService,
    private toastr: ToastrService,
    private fileService: FilesServicesService
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

    // Crear FormData
    const formData = new FormData();
    formData.append('idEjercicio', this.year.toString());
    formData.append('idRamo', this.indicador.idRamo?.toString() || '');
    formData.append('idFuenteFinan', this.indicador.idFuenteFinan?.toString() || '');
    formData.append('idPrograma', this.indicador.idPrograma?.toString() || '');
    formData.append('idArea', this.idArea.toString());
    formData.append('idIndicador', this.indicador.idIndicador?.toString() || '');
    formData.append('idTrimestre', this.trimestre.toString());
    formData.append('rutaFiles', this.nuevoDocumento);
    formData.append('descripcion', this.descripcionEvidencia);

    // Enviar FormData
    this.fileService.subirArchivo(formData).subscribe(
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
  }
}
