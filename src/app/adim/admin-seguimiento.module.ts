import { NgModule } from "@angular/core";
import { VistaAdminComponent } from "./vista-admin/vista-admin.component";
import { MatrizSeguimientoModule } from "../matriz/matriz-seguimiento.module";
import { NavComponent } from "../matriz/nav/nav.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    VistaAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatrizSeguimientoModule,
    BrowserAnimationsModule,
  ],
  exports: [
  ],
  bootstrap: [VistaAdminComponent]
})

export class AdminSeguimientoModule{

}