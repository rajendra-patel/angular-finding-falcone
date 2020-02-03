import { Injectable, OnInit, Optional } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Planet } from '../models/planet';
import { Vehicle } from '../models/vehicle';

import { PlanetService } from './planet.service';
import { VehicleService } from './vehicle.service';
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  noOfDestinations: number[];
  id: number=0;
  planetList: Planet[] = [];
  unselectedPlanets: Planet[] = [];
  selectedPlanets: Planet[] = [];
  vehicleList: Vehicle[] = [];
  unselectedVehicles: Vehicle[] = [];
  selectedVehicles: Vehicle[] = [];
  nullVehicle: Vehicle;
  nullVehicles: Vehicle[] = [];
  timeForDestination: number[] = [0,0,0,0];
  timeTaken:number = 0;
  result: {status: string, planet: string, totalTimeTaken: number};

  constructor(private planetService: PlanetService, private vehicleService: VehicleService, private tokenService: TokenService) {
    this.nullVehicle = new Vehicle();
    this.nullVehicle.setData(-1, "Select Vehicle", -1, -1, -1);
    this.requestData();
    this.result = {status: "", planet: "", totalTimeTaken: -1};
  }

  setNoOfDestinations(noOfDestinations: number[]){
    this.noOfDestinations = noOfDestinations;
  }

  async requestData(requestedObject?: String) {
    let requestedData: any;
    switch(requestedObject) {
      case "Planets": {
        this.planetList = await this.planetService.requestPlanets();
        requestedData = await this.planetList;
        break;
      }
      case "Vehicles": {
        this.vehicleList = await this.vehicleService.requestVehicles();
        requestedData = await this.vehicleList;
        break;
      }
      case "UnselectedPlanets": {
        this.unselectedPlanets = await this.planetList.slice();
        requestedData = await this.unselectedPlanets;
        break;
      }
      case "UnselectedVehicles": {
        this.unselectedVehicles = await this.vehicleList.slice();
        requestedData = await this.unselectedVehicles;
        break;
      }
      default: {
        this.planetList = await this.planetService.requestPlanets();
        this.vehicleList = await this.vehicleService.requestVehicles();
        this.tokenService.requestToken();
        break;
      }
    }
    return await requestedData;
  }
  getPlanets(){
  /*
    let planets: Planet[];
    if(this.planetList.length === 0) {
      console.log("reRequesting planets");
      planets = await this.requestData("Planets");
      this.planetList = planets;
    }
  */
    return this.planetList;
  }

  getVehicles(){
  /*
    let vehicles: Vehicle[];
    if(this.vehicleList.length === 0){
      console.log("reRequesting vehicles");
      vehicles = await this.requestData("Vehicles");
      this.vehicleList = vehicles;
    }
  */
    return this.vehicleList;
  }

  getRemainingVehicles(){
    return this.unselectedVehicles;
  }

  getRemainingPlanets(){
    return this.unselectedPlanets;
  }

  isRequestedDataValid(){
    return !(this.planetList.length == 0 && this.vehicleList.length == 0);
  }

  initializeSelectedPlanets(){
    let planet = new Planet();
    planet.setData(-1, "Select Planet", -1);
    this.noOfDestinations.forEach(dest => this.selectedPlanets.push(planet));
    return this.selectedPlanets;
  }

  initializeSelectedVehicles(){
    console.log(this.noOfDestinations.length);
    this.noOfDestinations.forEach(dest => this.nullVehicles.push(this.nullVehicle));
    console.log(this.nullVehicles);
    this.selectedVehicles = this.nullVehicles.slice();
    return this.selectedVehicles;
  }

  initializeSelectedPlanet(){
    let element = new Planet();
    element.setData(-1, "Select Planet", -1);
    return element;
  }

  initializeSelectedVehicle(){
    let element = new Vehicle();
    element.setData(-1, "Select Vehicle", -1, -1, -1);
    // return element;
    console.log("inside initialize vehicle");
  }

  initializeUnselectedPlanets(){
    this.unselectedPlanets = this.planetList.slice();
    return this.unselectedPlanets;
  }

  initializeUnselectedVehicles(){
    //
    console.log("********************************Initializing Unselected Vehicles***********************************")
    this.vehicleList.forEach(vehicle => {
      let uSVehicle = new Vehicle();
      uSVehicle.setVehicle(vehicle);
      this.unselectedVehicles.push(uSVehicle)
    });
    console.log("Unselected Vehicles ="+this.unselectedVehicles);
    return this.unselectedVehicles;
  }
  initializeTimeForDestination(){
      this.timeForDestination = [0,0,0,0];
      return this.timeForDestination;
  }

  initializeTimeTaken(){
    this.timeTaken=0;
    return this.timeTaken;
  }

  retrieveSelectedPlanet(selectedPlanet: Planet){ //DEBUG HERE planetList not initialized
    let planetFound: Planet;
    let foundPlanet: boolean = false;
    this.planetList.forEach(planet => {                     // change planetList to remainingPlanets
      if(selectedPlanet.id === planet.id){
        foundPlanet = true;
        planetFound = planet;
        return;
      }
    });
    if(foundPlanet){
      selectedPlanet.setPlanet(planetFound);
      return selectedPlanet;
    } else {
      let temp = new Planet();
      temp.setData(-1,"Select Planet", -1);
      return temp;
    }
  }

  retrieveSelectedVehicle(selectedVehicle: Vehicle){
    let vehicleFound: Vehicle;
    let foundVehicle: boolean = false;
    console.log("retrievingSelected Vehicle ",selectedVehicle.id);
    this.vehicleList.forEach(vehicle => {                     // change planetList to remainingPlanets
      if(selectedVehicle.id === vehicle.id){
        foundVehicle = true;
        vehicleFound = vehicle;
        return;
      }
    });
    console.log("Found Vehicle ",foundVehicle)
    if(foundVehicle){
      selectedVehicle.setVehicle(vehicleFound);
      return selectedVehicle;
    } else {
      let retVehicle = new Vehicle();
      retVehicle.setVehicle(this.nullVehicle);
      return retVehicle;
    }
  }

  initializeRemainingVehicles(noOfDestinations: number[]){
    let remainingVehicles: Vehicle[] =[];
    let retVehicle = new Vehicle();
    retVehicle.setData(-1, "Select Vehicle", -1, -1, -1);
    noOfDestinations.forEach(dest => remainingVehicles.push(retVehicle));
    return remainingVehicles;
  }

  initializeRemainingPlanets(noOfDestinations: number[]){
    let remainingPlanets: Planet[]=[];
    let retPlanet = new Planet();
    retPlanet.setData(-1, "Select Planet", -1);
    noOfDestinations.forEach(dest => remainingPlanets.push(retPlanet));
    return remainingPlanets;
  }

  assignSelectedVehicle(destId: number,vehicle: Vehicle){
    this.selectedVehicles[destId] = vehicle;
  }

  setResult(result: {status: string, planet: string, totalTimeTaken: number}){
    console.log("Inside Set Result ",result);
    this.result.planet = result.planet;
    this.result.status = result.status;
    this.result.totalTimeTaken = result.totalTimeTaken;
    console.log("Setted Result status",this.result.status);
    console.log("Setted Result planet",this.result.planet);
  }

  getResult(){
    console.log("get resut called ",this.result);
    return this.result;
  }

  resetData(){
    console.log("Resetting All Values");
    console.log("Old unselected Vehicles "+this.unselectedVehicles);
    console.log("Vehicle List "+this.vehicleList);
    this.selectedPlanets.forEach(planet => planet.setData(-1, "Select Planet", -1));
    this.selectedVehicles.forEach(vehicle => vehicle.setVehicle(this.nullVehicle));
/*
    for(let i=0; i<this.vehicleList.length; i++){
      let pushedVehicle = new Vehicle();
      pushedVehicle.setVehicle(this.vehicleList[i]);

      this.unselectedVehicles[i] = pushedVehicle; 
    }
*/
    this.vehicleList.forEach(vehicle => this.unselectedVehicles.find(sVehicle => sVehicle.id == vehicle.id).setVehicle(vehicle));
    this.unselectedPlanets.length=0;
    this.unselectedPlanets.push(...this.planetList);
    console.log("New Unselected Vehicles "+this.unselectedVehicles);
  }
  computeTime(event){
    if(this.selectedVehicles[event.destId].id == -1){
      this.timeForDestination[event.destId] = 0;
    } else {
      this.timeForDestination[event.destId] = 
      (this.selectedPlanets[event.destId].distance / this.selectedVehicles[event.destId].speed);
    }
  }
  getTimeTaken(){
    return this.timeTaken;
  }
  isReadyForExpedition(){
    let validTime = true;
    this.timeForDestination.forEach(time => {
      this.timeTaken += time;
      validTime = (time == 0) ? false : true;
    });
    return validTime;
  }
}