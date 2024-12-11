import { Injectable } from '@angular/core';
import { ComponentFactoryResolver, ApplicationRef, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalConfirmationComponent } from '../matriz/modal-confirmation/modal-confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  private confirmSubject = new Subject<boolean>();  // El Subject para emitir la respuesta

  constructor(
    private resolver: ComponentFactoryResolver, 
    private appRef: ApplicationRef,
    private injector: Injector,
    private toastr: ToastrService
  ) { }

  open(message: string) {
    // Creamos la instancia del componente del modal
    const factory = this.resolver.resolveComponentFactory(ModalConfirmationComponent);
    const componentRef = factory.create(this.injector);
    
    // Pasamos el mensaje al modal
    componentRef.instance.message = message;

    // Añadimos el componente al DOM
    this.appRef.attachView(componentRef.hostView);
    const domElem = componentRef.location.nativeElement;
    document.body.appendChild(domElem);

    // Suscribimos al evento de confirmación
    componentRef.instance.onConfirm.subscribe((confirmed: boolean) => {
      this.confirmSubject.next(confirmed);
      this.close(componentRef);
    });
    
    // Abrir el modal de Bootstrap dinámicamente
    setTimeout(() => componentRef.instance.open(), 0); // Usamos setTimeout para asegurarnos que el DOM se haya actualizado
  }

  close(componentRef: any) {
    // Cerrar y destruir el modal
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  getConfirmation(): Subject<boolean> {
    return this.confirmSubject;
  }
}
