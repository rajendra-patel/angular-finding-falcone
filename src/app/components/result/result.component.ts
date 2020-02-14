import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  result: {status: string, planet: string, totalTimeTaken: number};

  constructor(private dataService: DataService, private router: Router) {
    this.result = {status: "", planet: "", totalTimeTaken: -1};
   }

  ngOnInit() {
    this.result = this.dataService.result;
    // this.result.planet = this.dataService.result.planet;
    // this.result.totalTimeTaken = this.dataService.result.totalTimeTaken;
    console.log("Data Service Result ",this.dataService.getResult());
  }
  retry(){
    this.dataService.resetData();
    this.router.navigate(["findfalcon"]);
  }


}