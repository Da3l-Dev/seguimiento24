import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { NavComponent } from './nav/nav.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { NavMainComponent } from './nav-main/nav-main.component';
import { RouterModule } from '@angular/router';
import { CardMetasComponent } from './card-metas/card-metas.component';
import { CardAvanceGraficaComponent } from './card-avance-grafica/card-avance-grafica.component';
import { ListaBotonesComponent } from './lista-botones/lista-botones.component';
import { ModalCedulaEvidenciaComponent } from './modal-cedula-evidencia/modal-cedula-evidencia.component';
import { FormsModule } from '@angular/forms';
import { ModalMetasAlcanzadasComponent } from './modal-metas-alcanzadas/modal-metas-alcanzadas.component';
import { ModalMirFirmadaComponent } from './modal-mir-firmada/modal-mir-firmada.component';
import { Modal } from 'bootstrap';
import { ModalCausaEfectoComponent } from './modal-causa-efecto/modal-causa-efecto.component';
import { ModalSeguimientoEvaluacionComponent } from './modal-seguimiento-evaluacion/modal-seguimiento-evaluacion.component';
import { FichaIndicadorComponent } from './ficha-indicador/ficha-indicador.component';
import { ModalConfirmationComponent } from './modal-confirmation/modal-confirmation.component';
import { ModalReducirFileComponent } from './modal-reducir-file/modal-reducir-file.component';
import { ModalFirmasComponent } from './modal-firmas/modal-firmas.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavComponent,
    SidebarComponent,
    NavMainComponent,
    CardMetasComponent,
    CardAvanceGraficaComponent,
    ListaBotonesComponent,
    ModalCedulaEvidenciaComponent,
    ModalMetasAlcanzadasComponent,
    ModalMirFirmadaComponent,
    ModalCausaEfectoComponent,
    ModalSeguimientoEvaluacionComponent,
    FichaIndicadorComponent,
    ModalConfirmationComponent,
    ModalReducirFileComponent,
    ModalFirmasComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    MainLayoutComponent,
    NavComponent,
    SidebarComponent,
    NavMainComponent,
    CardMetasComponent,
    CardAvanceGraficaComponent,
    ListaBotonesComponent,
    ModalCedulaEvidenciaComponent,
    ModalMetasAlcanzadasComponent,
    ModalMirFirmadaComponent,
    ModalCausaEfectoComponent,
    ModalSeguimientoEvaluacionComponent,
    FichaIndicadorComponent,
    ModalConfirmationComponent,
    ModalFirmasComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MatrizSeguimientoModule {}
