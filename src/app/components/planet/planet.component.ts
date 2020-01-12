import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormsModule, FormControl } from "@angular/forms";

import { Planet } from "../../models/planet";
import { Vehicle } from "../../models/vehicle";

import { PlanetService } from "../../services/planet.service";
import { VehicleService } from "../../services/vehicle.service";
import { TokenService } from "../../services/token.service";
import { FindFalconService } from "../../services/findfalcon.service";
import { DataService } from "../../services/data.service";

@Component({
  selector: "app-planet",
  templateUrl: "./planet.component.html",
  styleUrls: ["./planet.component.css"]
})
export class PlanetComponent implements OnInit {
  @Input('id') destId: number;
  @Input() unselectedPlanets: Planet[];
  @Output() onSelectPlanet: EventEmitter<{destId: number, planet: Planet}> = new EventEmitter();
  selectedPlanet: Planet;

  constructor(
    private planetService: PlanetService,
    private vehicleService: VehicleService,
    private tokenSvc: TokenService,
    private falconSvc: FindFalconService,
    private dataService: DataService
  ) {
    // this.unselectedPlanets = [];
  }

  ngOnInit() {
    this.selectedPlanet = this.dataService.initializeSelectedPlanet();
  }

  onSelectingPlanet(event: any){
    console.log(" Selected Planet Id :" + this.selectedPlanet.id + " Event :" + event);
    this.selectedPlanet = this.dataService.retrieveSelectedPlanet(this.selectedPlanet);
    let emittedObject = { destId: this.destId, planet: this.selectedPlanet };
    console.log("Emitted Object ", emittedObject);
    this.onSelectPlanet.emit(emittedObject);
    console.log(" Selected Planet Id :" + this.selectedPlanet.id + " Event :" + event);
  }
}
