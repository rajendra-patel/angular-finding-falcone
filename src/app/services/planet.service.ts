import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Planet } from '../models/planet';
import { environment } from '../../environments/environment';

@Injectable()
export class PlanetService {

  planetList: Planet[] = [];
  constructor(public http: Http) {}
  parseResponse(res: any) {
    if(this.planetList.length === 0){
      let dummy: Planet;
      for (let i = 0; i < res.length; i++) {
        dummy = new Planet();
        dummy.setData(-1, "", -1);
        dummy.id = i;
        dummy.name = res[i].name;
        dummy.distance = parseInt(res[i].distance);
        this.planetList.push(dummy);
      }
    }
    return this.planetList;
  }
  getPlanetDetails() {
    return this.http.get(environment.planetsEndPointUrl);
  }
}