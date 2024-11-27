import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Seguimiento } from '../model/seguimiento.model';

@Component({
  selector: 'app-modal-seguimiento-evaluacion',
  templateUrl: './modal-seguimiento-evaluacion.component.html',
  styleUrl: './modal-seguimiento-evaluacion.component.scss'
})
export class ModalSeguimientoEvaluacionComponent implements OnInit {

  constructor(
    private sharedDataService : SharedDataService,
  ){}

  tituloIndicador: string = "";
  seguimientoData: Seguimiento | null = null;

  resumenNarrativo: string = "";
  indicadorFormula: string = "";
  meta: string = "";
  justificacionCE: string = "";
  medioVerificacion: string = "";
  hallazgoEncontrado: string ="";
  mejora: string= ""

  tabData = [
    { id: 1, label: "ENE - MAR" },
    { id: 2, label: "ABR - JUN" },
    { id: 3, label: "JUL - SEP" },
    { id: 4, label: "OCT - DIC" },
  ];

  ngOnInit(): void {
    const modal = document.getElementById('modalSeguimientoEval');
    if (modal) {
      modal.addEventListener('show.bs.modal', () => {
        this.sharedDataService.indicadorModel$.subscribe(data => {
          this.tituloIndicador = data?.indicador?? "";
        });
      });
    }
  }

  

  seguimientoSelect(idSelected: number, periodo: string) :void{
    this.sharedDataService.seguimientoModel$.subscribe(data => {
      this.seguimientoData = data;
    });

    console.table(this.seguimientoData);

    switch(idSelected){
      case 1:
        this.resumenNarrativo = this.seguimientoData?.RS1?? "";
        this.indicadorFormula = this.seguimientoData?.IS1?? "";
        this.meta = this.seguimientoData?.MS1?? "";
        this.justificacionCE = this.seguimientoData?.JS1?? "";
        this.medioVerificacion = this.seguimientoData?.MDS1?? "";
        this.hallazgoEncontrado = this.seguimientoData?.MDS1?? "";
        this.mejora = this.seguimientoData?.MJS1?? "";
        break;
      case 2:
        this.resumenNarrativo = this.seguimientoData?.RS2?? "";
        this.indicadorFormula = this.seguimientoData?.IS2?? "";
        this.meta = this.seguimientoData?.MS2?? "";
        this.justificacionCE = this.seguimientoData?.JS2?? "";
        this.medioVerificacion = this.seguimientoData?.MDS2?? "";
        this.hallazgoEncontrado = this.seguimientoData?.MDS2?? "";
        this.mejora = this.seguimientoData?.MJS2?? "";
        break;

      case 3:
        this.resumenNarrativo = this.seguimientoData?.RS3?? "";
        this.indicadorFormula = this.seguimientoData?.IS3?? "";
        this.meta = this.seguimientoData?.MS3?? "";
        this.justificacionCE = this.seguimientoData?.JS3?? "";
        this.medioVerificacion = this.seguimientoData?.MDS3?? "";
        this.hallazgoEncontrado = this.seguimientoData?.MDS3?? "";
        this.mejora = this.seguimientoData?.MJS3?? "";
        break;

      case 4:
        this.resumenNarrativo = this.seguimientoData?.RS4?? "";
        this.indicadorFormula = this.seguimientoData?.IS4?? "";
        this.meta = this.seguimientoData?.MS4?? "";
        this.justificacionCE = this.seguimientoData?.JS4?? "";
        this.medioVerificacion = this.seguimientoData?.MDS4?? "";
        this.hallazgoEncontrado = this.seguimientoData?.MDS4?? "";
        this.mejora = this.seguimientoData?.MJS4?? "";
        break;

      default:
        
        break;

    }
  }
}
