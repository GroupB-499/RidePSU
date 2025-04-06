import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-assign-driver-modal',
  templateUrl: './assign-driver-modal.component.html',
  styleUrls: ['./assign-driver-modal.component.css']
})
export class AssignDriverModalComponent {
  availableTimes: string[] = [];
  selectedFromTime!: string;
  selectedToTime!: string;
  selectedTransport!: string;

  transportTypes = ['golf car', 'shuttle bus'];

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.generateTimeSlots();
  }

  generateTimeSlots(): void {
    let startHour = 8;
    let startMinute = 0;
    while (startHour < 18 || (startHour === 18 && startMinute === 0)) {
      const formattedTime = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      this.availableTimes.push(formattedTime);

      startMinute += 10;
      if (startMinute >= 60) {
        startMinute = 0;
        startHour++;
      }
    }
  }

  submit(): void {
    const data = {
      from: this.selectedFromTime,
      to: this.selectedToTime,
      transport: this.selectedTransport,
    };

    this.activeModal.close(data);
  }
}
