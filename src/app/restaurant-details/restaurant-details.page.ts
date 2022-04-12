import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Restaurant from '../models/Restaurant';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.page.html',
  styleUrls: ['./restaurant-details.page.scss'],
})
export class RestaurantDetailsPage implements OnInit {

  restaurant: Restaurant
  constructor(private route: ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.restaurant = JSON.parse(params['data'])
    })
  }

  deleteRestaurant() {
    Storage.remove({ key: this.restaurant.id })
    this.router.navigate(['/tabs/tab2']).then(() => {
      window.location.reload()
    })
  }
    
}
