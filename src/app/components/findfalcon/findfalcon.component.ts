import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';

import { Planet } from "../../models/planet";
import { Vehicle } from "../../models/vehicle";
import { PlanetService } from "../../services/planet.service";
import { VehicleService } from "../../services/vehicle.service";
import { DataService } from "../../services/data.service";
import { FindFalconService } from "../../services/findfalcon.service";


@Component({
  selector: "app-findfalcon",
  templateUrl: "./findfalcon.component.html",
  styleUrls: ["./findfalcon.component.css"]
})
export class FindFalconComponent implements OnInit {
  private vehicleImage = new Array<string>(4);
  private planetImage = new Array<string>(6);

  private noOfDestinations = [0, 1, 2, 3]; //new Array<number>(4);
  private planetList: Planet[] = [];
  private vehicleList: Vehicle[] = [];
  private selectedPlanetsId: number[] = [-1, -1, -1, -1];
  private selectedPlanets: Planet[];
  private selectedVehiclesId: number[] = [-1, -1, -1, -1];
  private selectedVehicles: Vehicle[] = [];
  private unselectedPlanets: Planet[] = [];
  private unselectedVehicles: Vehicle[] = [];
  private currentSelectedPlanet: Planet;
  private currentSelectedVehicle: Vehicle;
  private previousSelectedVehicle: Vehicle;
  private DisabledVehicles: Boolean[] = [false, false, false, false];
  private disabledVehiclesList: Boolean[][] = [[false, false, false, false],[false, false, false, false],[false, false, false, false],[false, false, false, false]];
  private timeForDestination: number[] = [0,0,0,0];
  private timeTaken: number = 0;
  private isReadyForExpedition:boolean = false;

  constructor(
    private dataService: DataService,
    private planetService: PlanetService,
    private vehicleService: VehicleService,
    private findFalconService: FindFalconService,
    private router : Router
  ) {
    console.log(this.noOfDestinations);
  }

  ngOnInit() {
    this.vehicleImage[0]= "https://drive.google.com/uc?id=1p2H4ZNStNsJKWjVwxbT1rBZ3TTkmn0Ee";
    this.vehicleImage[1]="https://drive.google.com/uc?id=1GeKRE7tzcutzuOW3p4NY4MmK6FawP-V7";
    this.vehicleImage[2]="https://drive.google.com/uc?id=18hRMjIZ6WSjQO1r4Ux4h-1V7jWgr8JY0";
    this.vehicleImage[3]="https://drive.google.com/uc?id=1XeZbiK8cZ1Ik6X96D26_z8KS61JWE7Eq";

    this.planetImage[0]="https://drive.google.com/uc?id=1XDTO_uBtqumjjvlqKyZgnw0m4vdtsAJx";
    this.planetImage[1]="https://drive.google.com/uc?id=1_v8LcwWnVQZW3wZ7frwc2Dh8Rf9CgFw-";
    this.planetImage[2]="https://drive.google.com/uc?id=1VdPijp0G5Pyh2XIqjnIFVufxOQe0H21f";
    this.planetImage[3]="https://drive.google.com/uc?id=1JUGnnF9GuVSBT71gHftdtfbPYRtTOY3X";
    this.planetImage[4]="https://drive.google.com/uc?id=14eoclxEmxjOSgZv0vKQ1yx36YCYvmw8D";
    this.planetImage[5]="https://drive.google.com/uc?id=1Y7IFbswgN0fh5Bi-y8TfihabTYc04Rw6";

    this.dataService.setNoOfDestinations(this.noOfDestinations);
    this.timeForDestination = this.dataService.initializeTimeForDestination();
    this.timeTaken = this.dataService.initializeTimeTaken();
    this.selectedVehicles = this.dataService.initializeSelectedVehicles();
    this.selectedPlanets = this.dataService.initializeSelectedPlanets();
    this.previousSelectedVehicle = new Vehicle();
    this.previousSelectedVehicle.setData(-1, "select Vehicle", -1, -1, -1);
    this.retrieveData();
  }

  async ngAfterViewInit() {
    if(this.planetList.length == 0 && this.vehicleList.length == 0){
      this.planetList = await this.dataService.requestData("Planets");
      this.unselectedPlanets = await this.dataService.requestData("UnselectedPlanets");
      this.vehicleList = await this.dataService.requestData("Vehicles");
      this.unselectedVehicles = await this.dataService.requestData("UnselectedVehicles");
    }
    console.log(" unselectedPlanets :",this.unselectedPlanets);
    console.log(" unselectedVehicles :",this.unselectedVehicles);
  }
  retrieveData(){
    // Retrieving Planet Data
    this.planetList = this.dataService.getPlanets();
    this.unselectedPlanets = this.dataService.initializeUnselectedPlanets();

    // Retrieving Vehicle Data
    this.vehicleList = this.dataService.getVehicles();
    this.unselectedVehicles = this.dataService.initializeUnselectedVehicles();

  }
  onSelectPlanet(event: any) {
    console.log("Final Evenet ", event);
    this.selectedPlanetsId[event.destId] = event.planet.id;
    this.selectedPlanets[event.destId] = event.planet;
    console.log("selectedPlanets After Updating "+this.selectedPlanets);
  
    this.unselectedPlanets.length = 0;
    this.unselectedPlanets.push(...this.planetList.filter(sPlanet => !this.selectedPlanets.some(selPlanet=>selPlanet.id==sPlanet.id)));
    console.log("updated unselectedPlanets "+this.unselectedPlanets);
    console.log("vehicle list onplanetselect "+this.unselectedVehicles);
    this.processSelectedVehicleValidity(event);
    this.processDisabledVehicles(event);
    this.computeTime(event);
  }

  onSelectVehicle(event: any) {
    console.log("Previous Selected Vehicle "+event.previousSelectedVehicle);
    console.log(" Event Received at findfalcon ",event);
    this.dataService.assignSelectedVehicle(event.destId, event.vehicle);
    this.selectedVehiclesId[event.destId] = event.vehicle.id;
    this.selectedVehicles[event.destId] = event.vehicle;
    this.previousSelectedVehicle = event.previousSelectedVehicle;
    let currentSelectedVehicle = this.unselectedVehicles.find(vehicle => vehicle.id == event.vehicle.id);
    currentSelectedVehicle.totalNumber -=1;
    if(this.previousSelectedVehicle.id !== -1){
      let addToPreviousSelectedVehicle = this.unselectedVehicles.find(vehicle => vehicle.id == this.previousSelectedVehicle.id);
      addToPreviousSelectedVehicle.totalNumber += 1;
    }
    console.log("Selected Vehicles",this.selectedVehiclesId);
/*
    let instArray = this.vehicleList
      .filter(
        vehicle =>
          vehicle.id !== this.selectedVehiclesId.find(id => id == vehicle.id)
      )
      .slice();
    this.unselectedVehicles = instArray;
*/
    this.computeTime(event);
  }




  anyPlanetSelected(){
    let isPlanetSelected: boolean = false;
    this.selectedPlanets.forEach(planet => {
      if(planet.id !== -1){
        isPlanetSelected = true;
        return;
      }
    });
    console.log("Vehicle Component Shown ", isPlanetSelected);
    return isPlanetSelected;
  }

  processDisabledVehicles(event: any){
    this.disabledVehiclesList[event.destId] = [false, false, false, false];
    this.currentSelectedPlanet = event.planet;
    this.unselectedVehicles.forEach(vehicle => {
      if(vehicle.maxDistance < this.currentSelectedPlanet.distance){
        this.disabledVehiclesList[event.destId][vehicle.id] = true;
      }
    });
  }

  processSelectedVehicleValidity(event: any){
    if(this.selectedVehicles[event.destId].id !== -1 && this.selectedPlanets[event.destId].distance > this.selectedVehicles[event.destId].maxDistance){
      let addBackIdx = this.unselectedVehicles.findIndex(vehicle => vehicle.id === this.selectedVehicles[event.destId].id);
      if (addBackIdx !== -1) {
        this.unselectedVehicles[addBackIdx].totalNumber += 1;
      }
      this.selectedVehicles[event.destId].setData(-1, "Select Vehicle", -1, -1, -1);
      this.previousSelectedVehicle.setVehicle(this.selectedVehicles[event.destId]);
    }
  }

  computeTime(event:any){
    this.dataService.computeTime(event);
    this.isReadyForExpedition = this.dataService.isReadyForExpedition();
    this.timeTaken = this.dataService.getTimeTaken();
  }

  getResult() {
    let status: string = '';
    let planetFound: string = '';
    let isSuccess: boolean = false;
    let result: {status: string, planet: string, totalTimeTaken: number} = {status: "", planet: "", totalTimeTaken: -1};
    let planetNames: string[] = this.getPlanetNames(this.selectedPlanets);
    let vehicleNames: string[] = this.getVehicleNames(this.selectedVehicles);
    this.findFalconService.findFalcone(planetNames, vehicleNames).then(res => {
      console.log(JSON.stringify(res));
      status = res.status;
      if (status == "success") {
        result.status = status;
        console.log("Result status "+ result.status);
        result.planet = res.planet_name;
        console.log("Result planet "+ result.planet);
        result.totalTimeTaken = this.timeTaken;
        console.log("Result time "+ result.totalTimeTaken);
        isSuccess = true;
      } else {
        result.status = status;
      }
      console.log("Result Object  ",result);
      this.dataService.setResult(result);
      this.router.navigate(["result"]);
    });

  }

  getPlanetNames(selectedPlanets: Planet[]) {
    let planetNames: string[] = [];
    this.selectedPlanets.forEach(planet => planetNames.push(planet.name));
    console.log("***********Planet Names " + planetNames);
    return planetNames;
  }

  getVehicleNames(selectedVehicles: Vehicle[]) {
    let vehicleNames: string[] = [];
    this.selectedVehicles.forEach(vehicle => vehicleNames.push(vehicle.name));
    console.log("***********Vehicle Names " + vehicleNames);
    return vehicleNames;
  }
  isTimeTakenValid(){
    return this.dataService.getTimeTaken() !== 0;
  }
}
