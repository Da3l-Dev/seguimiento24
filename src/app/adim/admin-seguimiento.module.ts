import { NgModule } from "@angular/core";
import { VistaAdminComponent } from "./vista-admin/vista-admin.component";
import { MatrizSeguimientoModule } from "../matriz/matriz-seguimiento.module";
import { NavComponent } from "../matriz/nav/nav.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    VistaAdminComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatrizSeguimientoModule,
  ],
  exports: [
  ],
  bootstrap: [VistaAdminComponent]
})

export class AdminSeguimientoModule{

}