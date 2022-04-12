import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.page.html',
  styleUrls: ['./list-restaurants.page.scss'],
})
export class ListRestaurantsPage implements OnInit {
  keys = [];
  restaurants = [];
  constructor(private router:Router) {}

  ngOnInit() {
    this.getRestaurants();
  }

  async getRestaurants() {
    await Storage.keys().then((v) => {
      this.keys = v.keys;
    });
    this.keys = this.keys.filter((e) => {
      return e.split('-')[0] === 'restaurant';
    });
    this.keys.map((e) => {
      this.addToArray(e);
    });
  }

  async addToArray(key: string) {
    let result = await Storage.get({ key: key });
    this.restaurants.push(JSON.parse(result.value));
  }

  list() {
    console.log(this.restaurants)
  }

  showDetails(e, restaurant) {
    this.router.navigate(['/restaurant-details', {data: JSON.stringify(restaurant)}])
  }

  addRestaurant() {
    this.router.navigate(['/add-restaurant'])
  }
}
