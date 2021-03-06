import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from '@angular/router';

import { Planet } from "../../models/planet";
import { Vehicle } from "../../models/vehicle";
import { PlanetService } from "../../services/planet.service";
import { VehicleService } from "../../services/vehicle.service";
import { DataService } from "../../services/data.service";
import { TokenService } from "../../services/token.service";
import { FindFalconService } from "../../services/findfalcon.service";


@Component({
  selector: "app-findfalcon",
  templateUrl: "./findfalcon.component.html",
  styleUrls: ["./findfalcon.component.css"]
})
export class FindFalconComponent implements OnInit {
  private noOfDestinations = [0, 1, 2, 3]; //new Array<number>(4);
  private planetList: Planet[] = [];
  private vehicleList: Vehicle[] = [];
  private selectedPlanetsId: number[] = [-1, -1, -1, -1];
  private selectedPlanets: Planet[] = [];
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
    private tokenService: TokenService,
    private findFalconService: FindFalconService,
    private router : Router
  ) {
    console.log(this.noOfDestinations);
  }

  async ngOnInit() {
    this.selectedVehicles = this.dataService.initializeRemainingVehicles(this.noOfDestinations);
    this.selectedPlanets = this.dataService.initializeRemainingPlanets(this.noOfDestinations);
    this.previousSelectedVehicle = new Vehicle();
    this.previousSelectedVehicle.setData(-1, "select Vehicle", -1, -1, -1);
    // this.unselectedPlanets = this.dataService.getPlanets();
    this.requestPlanets();
    await this.requestVehicles();
    this.requestToken();
  }

  requestPlanets(){
    this.planetService.getPlanetDetails().subscribe(res => {
      res = res.json();
      this.planetList = this.planetService.parseResponse(res);
      console.log("planet List " + this.planetList);
      this.planetList.forEach(planet => this.unselectedPlanets.push(planet));
    });
  }

  async requestVehicles(){
/*
    this.vehicleService.getVehicleDetails().subscribe(res => {
      res = res.json();
      console.log(res);
      this.vehicleList = this.vehicleService.parseResponse(res);
      console.log("vehicle List: " + this.vehicleList);
      this.vehicleList.forEach(vehicle => this.unselectedVehicles.push(vehicle));
    });
    */
    this.vehicleList = await this.vehicleService.getVehicles();
    this.unselectedVehicles = await this.vehicleList.slice();

    console.log("vehicleList in requestVehicles find comp",this.vehicleList);
    console.log("unselected vehicles first init inside find comp"+this.unselectedVehicles);
  }
  requestToken(){
    this.tokenService.getToken();
  }
  async ngAfterViewInit() {
    // this.planetList.forEach(elm => {
    //   this.unselectedPlanets.push(elm);
    // });
    // await this.vehicleList.forEach(vehicle => this.unselectedVehicles.push(vehicle));

    console.log(" unselectedPlanets :",this.unselectedPlanets);
    console.log(" unselectedVehicles :",this.unselectedVehicles);
  }
  addPlanet(event: any) {
    console.log("add Planet Called " + " received data : ");
    console.log(event);
    this.dataService.addPlanet(event.destId, event.planetId);
  }
  onSelectPlanet(event: any) {
    console.log("Final Evenet ", event);
    this.selectedPlanetsId[event.destId] = event.planet.id;
    this.selectedPlanets[event.destId] = event.planet;
    console.log("selectedPlanetsId After Updating ", this.selectedPlanetsId);

    this.unselectedPlanets = [];
    let instArray = this.planetList
      .filter(
        planet =>
          planet.id !== this.selectedPlanetsId.find(id => id == planet.id)
      )
      .slice();
    this.unselectedPlanets = instArray;
    console.log("updated unselectedPlanet", this.unselectedPlanets);
    console.log("vehicle list onplanetselect ", this.unselectedVehicles);
    this.processSelectedVehicleValidity(event);
    this.processDisabledVehicles(event);
    this.computeTime(event);
  }

  onSelectVehicle(event: any) {
    console.log(" Event Received at findfalcon ",event);
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
    this.selectedPlanetsId.forEach(planetId => {
      if(planetId !== -1){
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
      this.selectedVehicles[event.destId].setData(-1, "Select Vehicle", -1 -1 -1);
      this.previousSelectedVehicle.setVehicle(this.selectedVehicles[event.destId]);
    }
  }

  computeTime(event){
    let validTime = true;
    this.timeTaken = 0;
    if(this.selectedVehiclesId[event.destId] == -1){
      this.timeForDestination[event.destId] = 0;
    } else {
    this.timeForDestination[event.destId] = 
      (this.selectedPlanets[event.destId].distance / this.selectedVehicles[event.destId].speed);
    }
    this.timeForDestination.forEach(time => {
      this.timeTaken += time;
      validTime = (time == 0) ? false : true;
    });
    this.isReadyForExpedition = validTime;
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
}
