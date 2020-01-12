import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from "@angular/http";
import { HttpClientModule } from '@angular/common/http';
import {MatSelectModule} from '@angular/material/select';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppComponent } from './app.component';
import { HelloComponent } from './components/hello/hello.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { PlanetComponent } from './components/planet/planet.component';
import { PlanetService } from './services/planet.service';
import { VehicleService } from './services/vehicle.service';
import { TokenService } from './services/token.service';
import { FindFalconService } from './services/findfalcon.service';
import { FindFalconComponent } from './components/findfalcon/findfalcon.component';
import { DataService } from './services/data.service';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { ResultComponent } from './components/result/result.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule, HttpModule, HttpClientModule, MatSelectModule, BrowserAnimationsModule ],
  declarations: [ AppComponent, HelloComponent, HeaderComponent, HomeComponent, PlanetComponent, FindFalconComponent, VehicleComponent, ResultComponent ],
  bootstrap:    [ AppComponent ],
  providers: [DataService, PlanetService, VehicleService, TokenService, FindFalconService]
})
export class AppModule { }
