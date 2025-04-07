import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private modalService: NgbModal) {}

  confirm(title: string = 'Confirm', message: string = 'Are you sure?'): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;

    return modalRef.result.then(
      (result) => result === true,
      () => false
    );
  }
}
