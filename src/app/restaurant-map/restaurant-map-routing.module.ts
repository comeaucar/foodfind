import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RestaurantMapPage } from './restaurant-map.page';

const routes: Routes = [
  {
    path: '',
    component: RestaurantMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RestaurantMapPageRoutingModule {}
