import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';
import { ToastrService } from 'ngx-toastr';
import { Indicador } from '../model/indicador.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-modal-causa-efecto',
  templateUrl: './modal-causa-efecto.component.html',
  styleUrl: './modal-causa-efecto.component.scss'
})
export class ModalCausaEfectoComponent implements OnInit{

  constructor(
    private sharedDataService : SharedDataService,
    private toastr: ToastrService
  ){}
  
  ngOnInit(): void {
    const modal = document.getElementById('modalCausasEfectos');
    if (modal) {
      modal.addEventListener('show.bs.modal', () => {
        this.sharedDataService.indicadorModel$.subscribe(data => {
          this.tituloIndicador = data?.indicador?? "";
        });
      });
    }
  }

  metasAlcanzadas: metasAlcanzadas | null = null;
  indicador: Indicador | null = null;
  tituloIndicador: string = "";
  periodo: string = "";
  metaAlcanzada: number = 0;
  causa: string = "";
  efecto: string = "";
  evidencia: string = "";
  ruta: string = "";
  trimSelect: number = 0;

  

  tabData = [
    { id: 1, label: "ENE - MAR" },
    { id: 2, label: "ABR - JUN" },
    { id: 3, label: "JUL - SEP" },
    { id: 4, label: "OCT - DIC" },
    { id: 5, label: "ANUAL" },
  ];
  
  // Funcion para poder otorgar los datos necesarios para el modal
  cuasaEfectoSeleccionado(idSelected: number, periodo: string) :void {
    this.sharedDataService.metasAlcanzadasModel$.subscribe(data => {
      if(data){
        this.metasAlcanzadas = data;
      } else {
        this.toastr.error('Metas Alcanzadas no encontradas', 'Error', {
          positionClass: 'toast-bottom-right'
        });
      }
    });


    switch(idSelected) {
      case 1:
        this.trimSelect = idSelected;
        this.periodo = "Trimestre Enero - Marzo";
        this.metaAlcanzada = this.metasAlcanzadas?.M1 ?? 0;
        this.causa = this.metasAlcanzadas?.C1 ?? "";
        this.efecto = this.metasAlcanzadas?.E1 ?? "";
        this.evidencia = this.metasAlcanzadas?.EV1 ?? "";
        this.ruta = this.metasAlcanzadas?.R1 ?? "";
        console.log(this.ruta);
        break;
      case 2:
        this.trimSelect = idSelected;
        this.periodo = "Trimestre Abril - Junio";
        this.metaAlcanzada = this.metasAlcanzadas?.M2 ?? 0;
        this.causa = this.metasAlcanzadas?.C2 ?? "";
        this.efecto = this.metasAlcanzadas?.E2 ?? "";
        this.evidencia = this.metasAlcanzadas?.EV2 ?? "";
        this.ruta = this.metasAlcanzadas?.R2 ?? "";
        console.log(this.ruta);
        break;
      case 3:
        this.trimSelect = idSelected;
        this.periodo = "Trimestre Julio - Septiembre";
        this.metaAlcanzada = this.metasAlcanzadas?.M3 ?? 0;
        this.causa = this.metasAlcanzadas?.C3 ?? "";
        this.efecto = this.metasAlcanzadas?.E3 ?? "";
        this.evidencia = this.metasAlcanzadas?.EV3 ?? "";
        this.ruta = this.metasAlcanzadas?.R3 ?? "";
        console.log(this.ruta);
        break;
      case 4:
        this.trimSelect = idSelected;
        this.periodo = "Trimestre Octubre - Diciembre";
        this.metaAlcanzada = this.metasAlcanzadas?.M4 ?? 0;
        this.causa = this.metasAlcanzadas?.C4 ?? "";
        this.efecto = this.metasAlcanzadas?.E4 ?? "";
        this.evidencia = this.metasAlcanzadas?.EV4 ?? "";
        this.ruta = this.metasAlcanzadas?.R4 ?? "";
        console.log(this.ruta);
        break;
      case 5:
        this.trimSelect = idSelected;
        this.periodo = periodo;
        this.metaAlcanzada = this.metasAlcanzadas?.M5 ?? 0;
        this.causa = this.metasAlcanzadas?.C5 ?? "";
        this.efecto = this.metasAlcanzadas?.E5 ?? "";
        break;
    }
  }
}
