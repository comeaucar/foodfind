import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRestaurantsPageRoutingModule } from './list-restaurants-routing.module';

import { ListRestaurantsPage } from './list-restaurants.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListRestaurantsPageRoutingModule,
    Ng2SearchPipeModule
  ],
  declarations: [ListRestaurantsPage]
})
export class ListRestaurantsPageModule {}
