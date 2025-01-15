import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Variables } from '../model/variables.model';
import { Indicador } from '../model/indicador.model';
import { ModalCausaEfectoComponent } from "../modal-causa-efecto/modal-causa-efecto.component";
import { ModalSeguimientoEvaluacionComponent } from "../modal-seguimiento-evaluacion/modal-seguimiento-evaluacion.component";
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  // Asginar modelo para poder obtener los datos
  indicadorModel: Indicador | null = null;

  constructor(private sharedDataService: SharedDataService){ }


  ngOnInit(): void {
    this.sharedDataService.indicadorModel$.subscribe((data) => {
      this.indicadorModel = data;
    });
  }

}
