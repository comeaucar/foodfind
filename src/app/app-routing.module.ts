import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
//link (routes) for the pages
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'add-restaurant',
    loadChildren: () => import('./add-restaurant/add-restaurant.module').then( m => m.AddRestaurantPageModule)
  },
  {
    path: 'list-restaurants',
    loadChildren: () => import('./list-restaurants/list-restaurants.module').then( m => m.ListRestaurantsPageModule)
  },
  {
    path: 'restaurant-details',
    loadChildren: () => import('./restaurant-details/restaurant-details.module').then( m => m.RestaurantDetailsPageModule)
  },
  {
    path: 'restaurant-map',
    loadChildren: () => import('./restaurant-map/restaurant-map.module').then( m => m.RestaurantMapPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
