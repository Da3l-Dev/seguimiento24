import { AfterViewInit, Component, ElementRef, inject, TemplateRef } from '@angular/core';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {

  constructor(private el: ElementRef) {} // Combina las inyecciones en un solo constructor

  // Metodo antes de que inicie la vista para mostrar el modal
  ngAfterViewInit(): void {
    this.showModal(); 
  }

  // Funcion para mostrar el modal de mensajes del SIPLANEVA
  showModal(): void {
    const modalElement = this.el.nativeElement.querySelector('#myModal');
    const myModal = new bootstrap.Modal(modalElement, {
      keyboard: false
    });
    myModal.show();
  }    
}
