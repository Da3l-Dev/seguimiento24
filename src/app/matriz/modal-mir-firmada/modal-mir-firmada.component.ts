import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Indicador } from '../model/indicador.model';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';
import { ConfirmationService } from '../../services/confirmation.service';
import { FilesServicesService } from '../../services/files-services.service';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-modal-mir-firmada',
  templateUrl: './modal-mir-firmada.component.html',
  styleUrl: './modal-mir-firmada.component.scss'
})
export class ModalMirFirmadaComponent implements OnInit{
  idArea: number = 0;
  datosIndicador: Indicador | null = null;
  trimActivo: any[] = [];
  trimestre: number = 0;
  nuevoDocumento: File | null = null;
  year: number = 2024;



  constructor(
    private sharedDataService: SharedDataService,
    private datosProyectoService: DatosProyectosService,
    private userServiceData: UserService,
    private confirmDialog: ConfirmationService,
    private filesService: FilesServicesService,
    private toastr: ToastrService
  ){}

  ngOnInit(): void {
    this.setupModalEvents();
  }

  setupModalEvents(): void {
    const modal = document.getElementById('MirFirmada');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
      this.closeCollapse();
      });

      // Cargar los datos cuando el modal se ha iniciado
      modal.addEventListener('shown.bs.modal', () => {
        
        this.cargarDatos();
        this.closeCollapse()
      });
    }
  }

  cargarDatos() :void{

    this.userServiceData.getUserData().subscribe((user) => {
      if (user) {
        this.idArea = user.idArea;
      }
    });

    this.datosProyectoService.getTrimActivo(this.idArea).subscribe( data =>{
      this.trimActivo = data;
    });

    this.sharedDataService.indicadorModel$.subscribe(data =>{
      this.datosIndicador = data;
    });

  }

  setTrimestre(trim: number): void {
    this.cargarDatos();
    this.trimestre = trim;
    console.log(`Trimestre seleccionado: ${this.trimestre}`);
  }

  closeCollapse(): void {
    const collapseElement = document.getElementById('CollapseMIR');
    if (collapseElement) {
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
      collapseInstance.hide();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log("Archivo seleccionado:", file);
  
    if (file) {
      this.nuevoDocumento = file;
    }
  }
  

  subirArchivoEvidencia(): void{
    let subirMir = true;
    const formData = new FormData();

    this.confirmDialog.open('¿Estas seguro de guardar el archivo?');


    this.sharedDataService.confirmDialog$.subscribe( data => {
      if(data){
        if (data.confirm && data.cancel === false && subirMir) {
          
          this.sharedDataService.indicadorModel$.subscribe( indicador => {
            // Crear FormData
            formData.append('idEjercicio', this.year.toString());
            formData.append('idRamo', indicador?.idRamo?.toString() || '');
            formData.append('idFuenteFinan', indicador?.idFuenteFinan?.toString() || '');
            formData.append('idPrograma', indicador?.idPrograma?.toString() || '');
            formData.append('idArea', this.idArea.toString());
            formData.append('idTrimestre', this.trimestre.toString());
            formData.append('rutaFiles', this.nuevoDocumento?? '');

            this.filesService.subirArchivoMir(formData).subscribe(
              response => {
                this.toastr.success('Archivo subido exitosamente', 'Éxito', {
                  positionClass: 'toast-bottom-right'
                });
                (document.getElementById('nuevoDocumento') as HTMLInputElement).value = '';
              },
              (error) => {
                this.toastr.error('Error al subir el archivo', 'Error' , {
                  positionClass: 'toast-bottom-right'
                });
                console.error(error);
              }
            );

            subirMir = false;
          });
        }
    }
  });

  }

}
