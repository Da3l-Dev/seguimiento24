import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';
import { FirmasServiceService } from '../../services/firmas-service.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from '../../services/confirmation.service';
import { SharedDataService } from '../../services/shared-data.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-modal-firmas',
  templateUrl: './modal-firmas.component.html',
  styleUrl: './modal-firmas.component.scss'
})
export class ModalFirmasComponent implements OnInit{

    // Aquí agregas los datos para el formulario
    firmaNueva = {
      idProyecto: '',
      cPaterno: '',
      cMaterno: '',
      cNombre: '',
      idCargo: '',
      cCelular: '',
      cTelefono: '',
      cExtension: '',
      cEmail: '',
      cTitulo: '',
      cCargo: '',
      cCurp: '',
    };


  unidadOperante: string = '';
  idProyecto: number = 0;
  firmas: any[] = [];
  catCargos: any[] = [];
  firmaEditar: any = {};

  constructor(
    private userService: UserService,
    private firmasService: FirmasServiceService,
    private toastr: ToastrService,
    private confirmService: ConfirmationService,
    private sharedData: SharedDataService
  ){}


  ngOnInit(): void {
    const modal = document.getElementById('modalFirmas');
    
    if (modal) {
      modal.addEventListener('shown.bs.modal', () => {
        this.cargarFirmas();
        this.firmasService.getCatCargo().subscribe( data => {
          this.catCargos = data;
        });
      });
    }
  }

  // Método para cargar las firmas
cargarFirmas(): void {
  this.userService.getUserData().subscribe(data => {
    this.unidadOperante = data?.cUnidadOperante ?? '';
    this.idProyecto = data?.idProyecto ?? 0;

    // Llamamos al servicio para obtener las firmas
    this.firmasService.getFirmasProyecto(this.idProyecto).subscribe(dataFirmas => {
      this.firmas = dataFirmas;
    });
  });
}


  abrirCollapseAgregarFirma():void{

    const collapseElement = document.getElementById('collapseAgregarFirma');

    if(collapseElement){
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
      
      this.closeCollapse('collapseEditarFirma');
      collapseInstance.show()
    }

  }

  abrirCollapseEditarFirma(index: number): void{
    const collapseElement = document.getElementById('collapseEditarFirma');

    if(collapseElement){
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
      this.closeCollapse('collapseAgregarFirma');
      collapseInstance.show()
    }

    this.firmaEditar = this.firmas[index];

  }


  toUpperCase(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }


  

  closeCollapse(nameCollapse: string): void{

    const collapseElement = document.getElementById(nameCollapse);

        if (collapseElement) {
          const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
          collapseInstance.hide();
        }
  }
  
  agregarFirma(form: NgForm): void {
    let agregarFirma = true;

    this.firmaNueva.idProyecto = this.idProyecto.toString();


    this.confirmService.open("¿Estas seguro de que quieres agregar esta nueva firma?");

    this.sharedData.confirmDialog$.subscribe( response => {
      if(response){
        if(response.confirm && !(response.cancel) && agregarFirma){
          const formData = new FormData();
  
          formData.append('idProyecto', this.idProyecto.toString());
          formData.append('cPaterno', this.firmaNueva.cPaterno);
          formData.append('cMaterno', this.firmaNueva.cMaterno);
          formData.append('cNombre', this.firmaNueva.cNombre);
          formData.append('idCargo', this.firmaNueva.idCargo);
          formData.append('cCelular', this.firmaNueva.cCelular);
          formData.append('cTelefono', this.firmaNueva.cTelefono);
          formData.append('cExtension', this.firmaNueva.cExtension);
          formData.append('cEmail', this.firmaNueva.cEmail);
          formData.append('cTitulo', this.firmaNueva.cTitulo);
          formData.append('cCargo', this.firmaNueva.cCargo);
          formData.append('cCurp', this.firmaNueva.cCurp);
        
          this.firmasService.setFirmaProyecto(formData).subscribe(response => {
            this.toastr.success('Firma creada exitosamente', 'Éxito', {
              positionClass: 'toast-bottom-right'
            });
            this.closeCollapse('collapseAgregarFirma');
            this.cargarFirmas();
            form.resetForm();
            this.limpiarFirmaNueva(); 
            agregarFirma = false;
          }, error => {
            this.toastr.error('Error al crear la firma', 'Error' , {
              positionClass: 'toast-bottom-right'
            })
          });
        }
      }
    });
  }

  editarFirma(): void{
    let editarFirma = true
    Object.keys(this.firmaEditar).forEach(key => {
      if (typeof this.firmaEditar[key] === 'string' && key !== 'cEmail') {
        this.firmaEditar[key] = this.firmaEditar[key].toUpperCase();
      }
    });


    this.confirmService.open('¿Estas seguro actualizar los datos?');

    this.sharedData.confirmDialog$.subscribe(response => {
      if(response){
        if(response.confirm && !(response.cancel) && editarFirma){
          const formData = new FormData();        
          formData.append('idProyecto', this.idProyecto.toString());
          formData.append('cPaterno', this.firmaEditar.cPaterno);
          formData.append('cMaterno', this.firmaEditar.cMaterno);
          formData.append('cNombre', this.firmaEditar.cNombre);
          formData.append('idCargo', this.firmaEditar.idCargo);
          formData.append('cCelular', this.firmaEditar.cCelular);
          formData.append('cTelefono', this.firmaEditar.cTelefono);
          formData.append('cExtension', this.firmaEditar.cExtension);
          formData.append('cEmail', this.firmaEditar.cEmail);
          formData.append('cTitulo', this.firmaEditar.cTitulo);
          formData.append('cCargo', this.firmaEditar.cCargo);
          formData.append('cCurp', this.firmaEditar.cCurp);
        
          this.firmasService.updateFirmaProyecto(formData).subscribe(response => {
            this.toastr.success('Firma actualizada exitosamente', 'Éxito', {
              positionClass: 'toast-bottom-right'
            });
            this.cargarFirmas(); // Actualizamos la lista de firmas
          }, error => {
            this.toastr.error('Error al actualizar firma', 'Error', {
              positionClass: 'toast-bottom-right'
            });
          });
        }
      }
    });

  

  }

  eliminarFirma(index: number): void {
    let eliminarFirma = true;
    this.firmaEditar = this.firmas[index];
  
    const params = {
      idProyecto: this.idProyecto,  // Asegúrate de que `this.idProyecto` tenga un valor
      idCargo: this.firmaEditar.idCargo,
      cCurp: this.firmaEditar.cCurp
    };
  
  
    // Verifica que los valores no sean undefined o vacíos
    if (!params.idProyecto || !params.idCargo || !params.cCurp) {
      console.error('Faltan parámetros requeridos');
      return;
    }

    this.confirmService.open('¿Estas seguro de eliminar esta firma?');

    this.sharedData.confirmDialog$.subscribe(response =>{
      if(response){
        if(response.confirm && !(response.cancel) && eliminarFirma){
          eliminarFirma = false;
          this.firmasService.deleteFirmaProyecto(params).subscribe(
            response => {
              this.cargarFirmas();
              this.toastr.success('Firma eliminada exitosamente', 'Éxito', {
                positionClass: 'toast-bottom-right'
              });
            },
            error => {
              this.toastr.error('Error al eliminar la firma', 'Error', {
                positionClass: 'toast-bottom-right'
              });
            }
          );
        }
      }
    })
  }
  

  limpiarFirmaNueva(): void {
    Object.keys(this.firmaNueva).forEach(key => {
      (this.firmaNueva as any)[key] = '';
    });
  }
  
}
