import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DatosProyectosService } from '../../services/datos-proyectos.service';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../services/shared-data.service';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-lista-botones',
  templateUrl: './lista-botones.component.html',
  styleUrls: ['./lista-botones.component.scss'],
})
export class ListaBotonesComponent implements OnInit {
  idArea: number = 0;
  trimestres = [
    { id: 1, nombre: '1er. Trim', activo: false, registrado: false },
    { id: 2, nombre: '2do. Trim', activo: false, registrado: false },
    { id: 3, nombre: '3er. Trim', activo: false, registrado: false },
    { id: 4, nombre: '4to. Trim', activo: false, registrado: false },
    { id: 5, nombre: 'Anual', activo: false, registrado: false },
  ];
  indicador: any = {};

  constructor(
    private userServiceData: UserService,
    private proyectoServiceData: DatosProyectosService,
    private toastr: ToastrService,
    private sharedDataService: SharedDataService
  ) {}

  ngOnInit(): void {
    // Obtener datos del usuario
    this.userServiceData.getUserData().subscribe((user) => {
      if (user) {
        this.idArea = user.idArea;
        this.cargarTrimestresActivos();
      }
    });

    // Obtener datos del indicador desde SharedDataService
    this.sharedDataService.indicadorModel$.subscribe((data) => {
      this.indicador = data || {};
    });
  }

  private cargarTrimestresActivos(): void {
    this.proyectoServiceData.getTrimActivo(this.idArea).subscribe(
      (response: any) => {
        if (response.length > 0) {
          const trimActivo = response[0];

          // Mapear los datos al array de trimestres
          this.trimestres.forEach((trimestre) => {
            const key = `trim${trimestre.id}`;
            trimestre.activo = trimActivo[key] === 1 || trimActivo.anual === 1;
            if( trimestre.activo){
              trimestre.registrado = trimestre.activo;
              console.log("Trimestre: "+trimestre.registrado);
            }else{
              trimestre.registrado = false;
            }
          });

        } else {
          this.toastr.warning('No se encontraron datos de trimestres activos.', 'Advertencia', {
            positionClass: 'toast-bottom-right',
          });
        }
      },
      (error) => {
        console.error('Error al cargar trimestres activos:', error);
        this.toastr.error('No se pudieron cargar los datos de trimestres activos.', 'Error', {
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }

  public gestionarTrimestre(trimestre: { id: number; nombre: string; activo: boolean; registrado: boolean }): void {
    if (!trimestre.activo) {
      this.toastr.warning(`${trimestre.nombre} no está activo.`, 'Advertencia', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }

    const modalId = trimestre.registrado ? 'metaAlcanzada' : 'metaAlcanzada';
    console.log(modalId);
    this.abrirModal(modalId);
  }

  public abrirModal(nameModal: string): void {
    if (!this.indicador || Object.keys(this.indicador).length === 0) {
      this.toastr.warning('Recuerda seleccionar un indicador.', 'Advertencia', {
        positionClass: 'toast-bottom-right',
      });
      return;
    }

    const modalElement = document.getElementById(nameModal);
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show();
    }
  }
}
