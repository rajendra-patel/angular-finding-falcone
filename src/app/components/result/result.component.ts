import { Component, OnInit } from '@angular/core';
import { DataService } from "../../services/data.service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  result: {status: string, planet: string, totalTimeTaken: number};

  constructor(private dataService: DataService) {
    this.result = {status: "", planet: "", totalTimeTaken: -1};
   }

  ngOnInit() {
    this.result = this.dataService.result;
    // this.result.planet = this.dataService.result.planet;
    // this.result.totalTimeTaken = this.dataService.result.totalTimeTaken;
    console.log("Data Service Result ",this.dataService.getResult());
  }

}