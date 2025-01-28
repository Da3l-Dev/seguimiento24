import { NgModule } from "@angular/core";
import { VistaAdminComponent } from "./vista-admin/vista-admin.component";
import { MatrizSeguimientoModule } from "../matriz/matriz-seguimiento.module";
import { NavComponent } from "../matriz/nav/nav.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    VistaAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatrizSeguimientoModule,
    BrowserAnimationsModule,
    ButtonModule,
    FormsModule,
    AutoCompleteModule,
  ],
  exports: [
  ],
  bootstrap: [VistaAdminComponent]
})

export class AdminSeguimientoModule{


}