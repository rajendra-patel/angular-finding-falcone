import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable()
export class FindFalconService {

  resultResponse:any;
  constructor(private http:Http){}
  findFalcone(planetNames:string[], vehicleNames:string[]) {
      
       let headers = new Headers({'Accept': 'application/json','Content-Type': 'application/json'});
       let tkn:string = sessionStorage.getItem("token");
          let body = JSON.stringify({token: tkn, planet_names: planetNames, vehicle_names: vehicleNames});
          console.log('BOdy is ***************');
          console.log(body);
          return this.http.post(environment.findEndPointUrl,body, {headers: headers})
              .toPromise()
           .then(this.extractData)
           .catch(this.handleError); 
  }
  private extractData(res: Response) {
      let body = res.json();
      console.log('response Data in service ' + JSON.stringify(res.json()));
      return body || { };
  }
 private handleError (error: Response | any) {
      let errMsg: string;
      if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
          errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Promise.reject(errMsg);
  }

}