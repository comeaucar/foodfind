import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Restaurant from '../models/Restaurant';
import { Storage } from '@capacitor/storage';


@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.page.html',
  styleUrls: ['./restaurant-details.page.scss'],
})
export class RestaurantDetailsPage implements OnInit {


  showSuccess = false
  rating: number
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
    
  addRating() {
    let currRestaurant = new Restaurant(this.restaurant.id, this.restaurant.name, this.restaurant.address, this.restaurant.description, this.restaurant.tags, this.restaurant.ratings)
    if (this.rating <= 5) {
      currRestaurant.addRating(this.rating)
      Storage.set({
        key: this.restaurant.id,
        value: JSON.stringify(currRestaurant)
      })
      this.showSuccess = true
    }
  }

  closeChip() {
    this.showSuccess = false
  }

  showLocation() {
    this.router.navigate(['/restaurant-map', {data: JSON.stringify(this.restaurant)}])
  }
  
  getDirections() {
    this.router.navigate(['/restaurant-map', {data: JSON.stringify(this.restaurant), directions: true}])
  }
  
  
}
