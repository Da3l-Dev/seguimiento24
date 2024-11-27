import { Component, OnInit } from '@angular/core';
import { SharedDataService } from '../../services/shared-data.service';
import { Indicador } from '../model/indicador.model';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { UserService } from '../../services/user.service';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-modal-mir-firmada',
  templateUrl: './modal-mir-firmada.component.html',
  styleUrl: './modal-mir-firmada.component.scss'
})
export class ModalMirFirmadaComponent implements OnInit{
  idArea: number = 0;
  datosIndicador: Indicador | null = null;
  trimActivo: any[] = [];
  trimestre: number = 0;
  nuevoDocumento: File | null = null;


  constructor(
    private sharedDataService: SharedDataService,
    private datosProyectoService: DatosProyectosService,
    private userServiceData: UserService
  ){}

  ngOnInit(): void {
    this.setupModalEvents();
  }

  setupModalEvents(): void {
    const modal = document.getElementById('MirFirmada');
    if (modal) {
      modal.addEventListener('hidden.bs.modal', () => {
      this.closeCollapse();
      });

      // Cargar los datos cuando el modal se ha iniciado
      modal.addEventListener('shown.bs.modal', () => {
        
        this.cargarDatos();
        this.closeCollapse()
      });
    }
  }

  cargarDatos() :void{

    this.userServiceData.getUserData().subscribe((user) => {
      if (user) {
        this.idArea = user.idArea;
      }
    });

    this.datosProyectoService.getTrimActivo(this.idArea).subscribe( data =>{
      this.trimActivo = data;
    });

    this.sharedDataService.indicadorModel$.subscribe(data =>{
      this.datosIndicador = data;
    });

  }

  setTrimestre(trim: number): void {
    this.cargarDatos();
    this.trimestre = trim;
    console.log(`Trimestre seleccionado: ${this.trimestre}`);
  }

  closeCollapse(): void {
    const collapseElement = document.getElementById('CollapseMIR');
    if (collapseElement) {
      const collapseInstance = bootstrap.Collapse.getInstance(collapseElement) || new bootstrap.Collapse(collapseElement, { toggle: false });
      collapseInstance.hide();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    console.log("file: " + file)
    if (file) {
      this.nuevoDocumento = file;
    }
  }


}
