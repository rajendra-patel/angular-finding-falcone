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
  result: {status: string, planet: string, totalTimeTaken: number};

  constructor(private planetService: PlanetService, private vehicleService: VehicleService, private tokenService: TokenService) {
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
      default: {
        this.planetList = await this.planetService.requestPlanets();
        this.vehicleList = await this.vehicleService.requestVehicles();
        this.tokenService.requestToken();
        break;
      }
      return await requestedData;
    }
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
    let vehicle = new Vehicle();
    vehicle.setData(-1, "Select Vehicle", -1, -1, -1);
    this.noOfDestinations.forEach(dest => this.selectedVehicles.push(vehicle));
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
    this.unselectedVehicles = this.vehicleList.slice();
    return this.unselectedVehicles;
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
      retVehicle.setData(-1, "Select Vehicle", -1, -1, -1);
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
  }
}