import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

import { Vehicle } from '../models/vehicle'
import { environment } from '../../environments/environment';

interface VehiclePrototype {
  name:string;
  totalNumber:number;
  maxDistance:number;
  speed:number;
}
@Injectable()
export class VehicleService {
  private vehicleArr: Vehicle[];

  constructor(private httpClient: HttpClient) {
    this.vehicleArr = [];
  }

  async httpGetRequest(){
    return await this.httpClient.get<VehiclePrototype>(environment.vehiclesEndPointUrl).toPromise();
  }

  async requestVehicles(){
    if(this.vehicleArr.length == 0){
      let result = await this.httpGetRequest();
      console.log("Result Fetched "+result);
      await this.parseResponse(result);
    }
    console.log("Reached Request Vehicles in Vehicle Service "+ " \n Returning Vehicle Array "+this.vehicleArr);
    return await this.vehicleArr;
  }

  parseResponse(res: any) {
    if(this.vehicleArr.length == 0){
      let dummy: Vehicle;
      for (let i = 0; i < res.length; i++) {
        dummy = new Vehicle();
        dummy.setData(-1,"select vehicle",99,-1,-1);
        dummy.id = i;
        dummy.name = res[i].name;
        dummy.totalNumber = parseInt(res[i].total_no);
        dummy.maxDistance = parseInt(res[i].max_distance);
        dummy.speed = parseInt(res[i].speed);
        this.vehicleArr.push(dummy);
      }
    }
    return this.vehicleArr;
  }
}