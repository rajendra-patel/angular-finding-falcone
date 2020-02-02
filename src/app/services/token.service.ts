import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import { environment } from '../../environments/environment';

@Injectable()
export class TokenService {

  constructor(private http:Http){}

  requestToken(){
    let headers = new Headers({'Accept': 'application/json'});
    let body = '';
    this.http.post(environment.tokenEndPointUrl,body, {headers: headers})
      .subscribe((res) => {
        res = res.json();
        this.parseResponseToken(res);
        console.log('Token is ************ ' +sessionStorage.getItem("token"));
      });
  }
  private parseResponseToken(res:any){
    console.log(res);
    let token = res.token;
    console.log("token var "+token);
    let strTkn = sessionStorage.getItem("token")
    if(strTkn){
      sessionStorage.setItem("token", token);
    } else {
      if(token){
        sessionStorage.setItem("token", token);
      } else {
        console.log("couldnt get token bad request");
      }
    }
  }

}