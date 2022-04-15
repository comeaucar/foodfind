import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RestaurantMapPageRoutingModule } from './restaurant-map-routing.module';

import { RestaurantMapPage } from './restaurant-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RestaurantMapPageRoutingModule
  ],
  declarations: [RestaurantMapPage]
})
export class RestaurantMapPageModule {}
