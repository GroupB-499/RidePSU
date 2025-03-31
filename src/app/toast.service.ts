import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  show(message: string, type: ToastType = ToastType.INFO) {
    switch (type) {
      case ToastType.SUCCESS:
        this.toastr.success(message, "Success");
        break;
      case ToastType.ERROR:
        this.toastr.error(message, "Error");
        break;
      case ToastType.WARNING:
        this.toastr.warning(message, "Warning");
        break;
      case ToastType.INFO:
      default:
        this.toastr.info(message, "Info");
        break;
    }
  }
}
