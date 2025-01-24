import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from '../../services/admin-services.service';

@Component({
  selector: 'app-vista-admin',
  templateUrl: './vista-admin.component.html',
  styleUrl: './vista-admin.component.scss',
})
export class VistaAdminComponent implements OnInit {

  constructor( private adminService: AdminServicesService){}
  
  ngOnInit(): void {
    this.adminService.getAllAreas().subscribe( data => {
      console.log(data);
    })
  }
}
