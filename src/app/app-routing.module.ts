import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { HelloComponent } from './components/hello/hello.component';
import { HomeComponent } from './components/home/home.component';
import { FindFalconComponent } from './components/findfalcon/findfalcon.component';
import { PlanetComponent } from './components/planet/planet.component';
import { ResultComponent } from './components/result/result.component';

const routes: Routes = [
  // { path: '', component: HelloComponent }
  { path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'findfalcon', component: FindFalconComponent },
  { path: 'result', component: ResultComponent },

  // { path: 'planets', component: PlanetComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }