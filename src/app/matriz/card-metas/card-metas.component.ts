import { Component, OnInit } from '@angular/core';
import { MetaProgramas } from '../model/metasProgramadas.model';
import { metasAlcanzadas } from '../model/metasAlcanzadas.model';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-card-metas',
  templateUrl: './card-metas.component.html',
  styleUrl: './card-metas.component.scss'
})
export class CardMetasComponent implements OnInit {
  metaProgramadas: MetaProgramas | null = null;
  metasAlcanzadas: metasAlcanzadas | null = null;

  constructor(private sharedDataService: SharedDataService){}

  ngOnInit(): void {
    this.sharedDataService.metasProgModel$.subscribe((data) => {
      this.metaProgramadas = data;
    });

    this.sharedDataService.metasAlcanzadasModel$.subscribe((data) => {
      this.metasAlcanzadas = data;
    });
  }


  // Métodos para calcular y formatear el porcentaje
  getPorcentaje(avance: number | undefined, programado: number | undefined): string {
    if (!avance || !programado || programado === 0) {
      return '-';
    }
    const porcentaje = (avance / programado) * 100;
    return `${porcentaje.toFixed(2)}%`;
  }  

  // Asignar un color de circulo dependiendo el porcentaje de avance del indicador por trimestre
  getCircleColor(avance: number | undefined, programado: number | undefined): string {
    if (!avance || !programado || programado === 0) {
      return 'gray';
    }
  
    const porcentaje = (avance / programado) * 100;
  
    if (porcentaje < 65) {
      return 'red';
    } else if (porcentaje >= 65 && porcentaje < 85) {
      return 'yellow';
    } else if (porcentaje >= 85 && porcentaje <= 115) {
      return 'green';
    } else {
      return 'purple';
    }
  }  
  
  
}
