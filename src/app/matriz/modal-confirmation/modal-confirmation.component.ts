import { Component, EventEmitter, Output } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent {

  @Output() onConfirm = new EventEmitter<boolean>(); // Evento para emitir la confirmación
  message: string = '';  // El mensaje que se pasa al modal

  // Método para abrir el modal
  open() {
    const modalElement = document.getElementById('modalConfirmation');
    if (modalElement) {
      const modalInstance = new bootstrap.Modal(modalElement); // Inicializamos el modal de Bootstrap
      modalInstance.show();  // Mostramos el modal
    }
  }

  // Método para cerrar el modal
  close() {
    const modalElement = document.getElementById('modalConfirmation');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();  // Ocultamos el modal
    }
  }

  // Emitir la respuesta de confirmación
  confirm() {
    this.onConfirm.emit(true);  // Emitimos "true" si el usuario confirma
    this.close();  // Cerramos el modal
  }

  // Emitir la respuesta de cancelación
  cancel() {
    this.onConfirm.emit(false);  // Emitimos "false" si el usuario cancela
    this.close();  // Cerramos el modal
  }
}
