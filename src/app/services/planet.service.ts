import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { Observable } from 'rxjs';

import { Planet } from '../models/planet';
import { environment } from '../../environments/environment';

interface PlanetPrototype {
  name:string;
  distance:number;
}
@Injectable()
export class PlanetService {
  private planetArr: Planet[];
  
  constructor(private httpClient: HttpClient) {
    this.planetArr = [];
  }

  async httpGetRequest(){
    return await this.httpClient.get<PlanetPrototype>(environment.planetsEndPointUrl).toPromise();
  }

  async requestPlanets(){
    if(this.planetArr.length == 0){
      let result = await this.httpGetRequest();
      console.log("Result Fetched ",result);
      await this.parseResponse(result);
    }
    console.log("Reached Request Planets in Planet Service "+ " \n Returning Planet Array "+this.planetArr);
    return await this.planetArr;
  }

  parseResponse(res: any) {
    if(this.planetArr.length === 0){
      let dummy: Planet;
      for (let i = 0; i < res.length; i++) {
        dummy = new Planet();
        dummy.setData(-1, "", -1);
        dummy.id = i;
        dummy.name = res[i].name;
        dummy.distance = parseInt(res[i].distance);
        this.planetArr.push(dummy);
      }
    }
    return this.planetArr;
  }
}