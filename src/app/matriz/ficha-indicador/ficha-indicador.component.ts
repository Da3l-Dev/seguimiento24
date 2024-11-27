
import { Component } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { Offcanvas } from 'bootstrap';
import { SharedDataService } from '../../services/shared-data.service';
import { Indicador } from '../model/indicador.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ficha-indicador',
  templateUrl: './ficha-indicador.component.html',
  styleUrls: ['./ficha-indicador.component.scss']
})
export class FichaIndicadorComponent {

  indicador: Indicador | null = null;

  constructor(
    private sharedDataService: SharedDataService,
    private toastr: ToastrService
  ){}

  // Función para abrir un offcanvas específico y cerrar el otro
  public abrirOffCanvas(nameOffCanvas: string): void {
    this.sharedDataService.indicadorModel$.subscribe(data =>{
      this.indicador = data;
    });

    if (!this.indicador || Object.keys(this.indicador).length === 0) {
      this.toastr.warning('Recuerda seleccionar un indicador.', 'Advertencia', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }else{

      // Obtener el offcanvas que se desea abrir
    const offCanvasToOpen = document.getElementById(nameOffCanvas);
    
    if (offCanvasToOpen) {
      // Crear una nueva instancia de Offcanvas para abrir el deseado
      const modalInstanceToOpen = new Offcanvas(offCanvasToOpen);

      // Antes de abrir el nuevo, verificar si algún otro offcanvas está abierto
      const openOffCanvas = document.querySelector('.offcanvas.show') as HTMLElement;

      // Si hay algún offcanvas abierto, cerrarlo
      if (openOffCanvas && openOffCanvas !== offCanvasToOpen) {
        const bootstrapInstanceToClose = bootstrap.Offcanvas.getInstance(openOffCanvas); // Obtener la instancia de Bootstrap existente
        if (bootstrapInstanceToClose) {
          bootstrapInstanceToClose.hide(); // Cerrar el offcanvas
        }
      }
      
      // Ahora abrir el offcanvas deseado
      modalInstanceToOpen.show();
    }
    }
  }
}
