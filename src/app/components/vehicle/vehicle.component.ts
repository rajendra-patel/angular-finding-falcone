import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { Vehicle } from "../../models/vehicle";

import { VehicleService } from "../../services/vehicle.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {
  @Input('DisabledVehicles') disabledVehicles: Boolean[];
  @Input('id') destId: number;
  selectedVehicle: Vehicle;
  previousSelectedVehicle: Vehicle;
  @Input() unselectedVehicles: Vehicle[];
  @Output() onSelectVehicle: EventEmitter<{destId: number, vehicle: Vehicle, previousSelectedVehicle: Vehicle}> = new EventEmitter();

  constructor(private dataService : DataService) { }

  ngOnInit() {
    console.log("before data service exec");
    // this.unselectedVehicles = this.dataService.initializeSelectedVehicle();
    this.selectedVehicle = new Vehicle();
    this.selectedVehicle.setData(-1, "Select Vehicle", -1, -1,-1);
    this.previousSelectedVehicle = new Vehicle();
    this.previousSelectedVehicle.setData(-1, "Select Vehicle", -1, -1,-1);
    // this.dataService.initializeSelectedVehicle();
  }
  onSelectingVehicle(event: any){
    console.log(" Selected Vehicle :" + this.selectedVehicle + " Event :" + event);
    this.selectedVehicle = this.dataService.retrieveSelectedVehicle(this.selectedVehicle);
    let emittedObject = { destId: this.destId, vehicle: this.selectedVehicle, previousSelectedVehicle: this.previousSelectedVehicle };
    console.log("Emitted Object ", emittedObject);
    this.onSelectVehicle.emit(emittedObject);
    console.log(" Selected Vehicle Id :" + this.selectedVehicle.id + " Event :" + event);
    this.previousSelectedVehicle.setVehicle(this.selectedVehicle);
  }

  isVehicleDisabled(event: any){
    return this.disabledVehicles[event] || this.unselectedVehicles[event].totalNumber == 0;
  }
}