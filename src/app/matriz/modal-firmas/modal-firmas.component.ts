import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';
import { FirmasServiceService } from '../../services/firmas-service.service';


@Component({
  selector: 'app-modal-firmas',
  templateUrl: './modal-firmas.component.html',
  styleUrl: './modal-firmas.component.scss'
})
export class ModalFirmasComponent implements OnInit{

  unidadOperante: string = '';
  idProyecto: number = 0;
  firmas: any[] = [];
  firmaEditar: any [] = [];

  constructor(
    private userService: UserService,
    private firmasService: FirmasServiceService
  ){}


  ngOnInit(): void {
    const modal = document.getElementById('modalFirmas');
    if (modal) {
      
      modal.addEventListener('shown.bs.modal', () => {
        this.userService.getUserData().subscribe(data => {
          this.unidadOperante = data?.cUnidadOperante?? '';
          this.idProyecto = data?.idProyecto?? 0;

          this.firmasService.getFirmasProyecto(this.idProyecto).subscribe(dataFirmas => {
            this.firmas = dataFirmas;
          });
        });
      });
    }
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

    console.table(this.firmaEditar);

  }


  agregarFirma(): void{
  }


  closeCollapse(nameCollapse: string): void{

    const collapseElement = document.getElementById(nameCollapse);

        if (collapseElement) {
          const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
          collapseInstance.hide();
        }
  }
  
}
