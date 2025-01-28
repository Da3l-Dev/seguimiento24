import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AdminServicesService } from '../../services/admin-services.service';
import ApexCharts from 'apexcharts';

interface AutoCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.component.html',
  styleUrls: ['./vista-admin.component.scss'], // Ojo con la propiedad styleUrls
})
export class VistaAdminComponent implements OnInit {

  areas: any[] = [];
  areaSeleccionada: any;
  areasFiltradas: any[] | undefined;


  constructor(private adminService: AdminServicesService) {}

  // Carga las áreas desde el servicio
  ngOnInit(): void {
    this.adminService.getAllAreas().subscribe((data) => {
      this.areas = data;
    });
  }


  // Filtra las áreas según el texto ingresado
  filtarAreas(event: AutoCompleteEvent): void {
    const filtro: any[] = [];
    const query = this.removerAcentos(event.query.toLowerCase());

    for (let i = 0; i < this.areas.length; i++) {
      const area = this.areas[i];
      const texto = this.removerAcentos(area.cUnidadOperante.toLowerCase());
      if (texto.indexOf(query) !== -1) {
        filtro.push(area.cUnidadOperante);
      }
    }

    this.areasFiltradas = filtro;
  }

  // Método para eliminar acentos de una cadena
  removerAcentos(cadena: string): string {
    return cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
