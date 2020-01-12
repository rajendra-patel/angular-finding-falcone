import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  constructor(private http: Http, private httpClient: HttpClient) {
    this.vehicleArr = [];
  }

  async httpGetRequest(){
    let result = await this.httpClient.get<VehiclePrototype>(environment.vehiclesEndPointUrl).toPromise();
    return result;
  }
  async getVehicles(){ //: Observable<VehiclePrototype[]>
    // let vehiclePrototypeList = await this.httpClient.get<VehiclePrototype>(environment.vehiclesEndPointUrl).toPromise();
    let returningVehicles: Vehicle[];
    if(this.vehicleArr.length == 0){
      let result = await this.httpGetRequest();
      console.log("Result Fetched",result);
      await this.parseResponse(result);
      // promise.then(
      //   res => {
      //       console.log("Response from httpClient",res);
      //       returningVehicles = this.parseResponse(res);
      //     }
      //   ).catch(
      //     res => console.log(res)
      //   );
      //   console.log("returning Vehicles"+returningVehicles);
      // return returningVehicles;
    }
    console.log("Get Vehicles inside Vehicle Service  "+this.vehicleArr);
    return await this.vehicleArr;
    // console.log("Async-Await Vehicle List: ", vehiclePrototypeList);
    // return this.parseResponse(vehiclePrototypeList);
  }

  getVehicleDetails() {
    return this.http.get(environment.vehiclesEndPointUrl);
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
    console.log(this.vehicleArr);
    return this.vehicleArr;
  }
}