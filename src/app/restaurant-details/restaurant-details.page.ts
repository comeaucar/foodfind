import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Restaurant from '../models/Restaurant';
import { Storage } from '@capacitor/storage';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-restaurant-details',
  templateUrl: './restaurant-details.page.html',
  styleUrls: ['./restaurant-details.page.scss'],
})
export class RestaurantDetailsPage implements OnInit {
//variable initialized

  showEditRatings = false
  showSuccess = false
  ratings = []
  rating: number
  restaurant: Restaurant
  constructor(private route: ActivatedRoute, private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.restaurant = JSON.parse(params['data'])
    })
    this.ratings = this.restaurant.ratings
  }

  deleteRestaurant() {
    //deletes reastaurant
    Storage.remove({ key: this.restaurant.id })
    this.router.navigate(['/tabs/tab2']).then(() => {
      window.location.reload()
    })
  }

  goBack() {
    this.router.navigate(['/tabs/tab2'])
  }

  addRating() {
    //adds rating for the restaurant
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
    // show the location of restaurant
    this.router.navigate(['/restaurant-map', { data: JSON.stringify(this.restaurant) }]).then(() => {
      window.location.reload()
    })
  }

  getDirections() {
    //shows directions to restaurant
    this.router.navigate(['/restaurant-map', { data: JSON.stringify(this.restaurant), directions: JSON.stringify({ res: true }) }]).then(() => {
      window.location.reload()
    })
  }

  editRatings() {
    //toggles rating editing
    this.showEditRatings = !this.showEditRatings
  }

  removeRating(index: number) {
    //remove or edit the rating of restaurant
    this.ratings.splice(index, 1)
    this.restaurant.ratings = this.ratings
    Storage.set({
      key: this.restaurant.id,
      value: JSON.stringify(this.restaurant)
    })
  }

  async shareRestaurant(restaurant:any) {
    // share the restaruant
    await Share.share({
      title: "Check out this restaurant",
      text: `${restaurant.name}, ${restaurant.description}, ${restaurant.address.street}, ${restaurant.address.city} - ${restaurant.address.postal_code}`,
      dialogTitle: "Share this restaurant"
    })
  }

  editRestaurant(restaurant: any) {
    //edit the restaurant
    let sendRes = JSON.stringify(restaurant)
    this.router.navigate(['/add-restaurant', {data:sendRes, edit: true}])
  }
}
