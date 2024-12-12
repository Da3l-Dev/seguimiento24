import { Injectable } from '@angular/core';
import { ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalConfirmationComponent } from '../matriz/modal-confirmation/modal-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { SharedDataService } from './shared-data.service';
import { DialogConfirm } from '../matriz/model/dialogCofirm.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private confirmSubject = new Subject<boolean>();  // El Subject para emitir la respuesta

  dialogConfirmModel: DialogConfirm | null = null;

  constructor(
    private resolver: ComponentFactoryResolver, 
    private appRef: ApplicationRef,
    private injector: Injector,
    private toastr: ToastrService,
    private sharedData: SharedDataService
  ) { }

  open(message: string) {
    // Crear un nuevo objeto con el mensaje recibido y las propiedades predeterminadas
    const updatedDialogConfirm: DialogConfirm = {
      message: message, // Aseguramos que el mensaje no se pierda
      confirm: false,    // Confirm default value
      cancel: false     // Cancel default value
    };
  
    // Pasamos el nuevo objeto al servicio
    this.sharedData.setDataDialogConfirm(updatedDialogConfirm);
  
    // Inicializamos y mostramos el modal de Bootstrap
    const modalElement = document.getElementById('modalConfirmation');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement); // Inicializamos el modal de Bootstrap
      modalInstance.show();  // Mostramos el modal
    }
  }

  close() {
    const modal = document.getElementById('modalConfirmation');
    if (modal) {
      let bootstrapModal = bootstrap.Modal.getInstance(modal);
      if (!bootstrapModal) {
        bootstrapModal = new bootstrap.Modal(modal); // Inicializar el modal si no existe
      }
      bootstrapModal.hide();
    }
  }

}
