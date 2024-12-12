import { Component, OnInit } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { SharedDataService } from '../../services/shared-data.service';
import { DialogConfirm } from '../model/dialogCofirm.model';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {

  message: string = "";
  dialogConfirmModel: DialogConfirm | null = null;

  constructor(
    private sharedData: SharedDataService,
    private confirmDialogService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.sharedData.confirmDialog$.subscribe(data => {
      this.dialogConfirmModel = data;
      this.message = data?.message ?? "";  // Actualiza el mensaje
    });
  }

  confirm(): void {
    
    if (this.dialogConfirmModel) {
      
      const updatedDialogConfirm: DialogConfirm = {
        ...this.dialogConfirmModel, 
        confirm: true,    
        cancel: false     
      };
      
      this.confirmDialogService.close();
      this.sharedData.setDataDialogConfirm(updatedDialogConfirm);
    }
  }

  cancel(): void {
    
    if (this.dialogConfirmModel) {
      const updatedDialogConfirm: DialogConfirm = {
        ...this.dialogConfirmModel, 
        confirm: false,   
        cancel: true      
      };

      // Pasamos el objeto actualizado al servicio
      this.confirmDialogService.close();
      this.sharedData.setDataDialogConfirm(updatedDialogConfirm);
    }
  }
}
