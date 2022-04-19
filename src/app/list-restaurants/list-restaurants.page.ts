import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-list-restaurants',
  templateUrl: './list-restaurants.page.html',
  styleUrls: ['./list-restaurants.page.scss'],
})
export class ListRestaurantsPage implements OnInit {
  //variables declared
  search: string;

  keys = [];
  restaurants = [];
  constructor(private router:Router) {}

  ngOnInit() {
    //function calls when the page initializes
    this.getRestaurants();

  }


  async getRestaurants() {
    //reading data from the storage
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
    this.list()
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

  getRating(currRestaurant: any) {
    if (currRestaurant.ratings.length == 0) {
      return 0
    }
    const sum = currRestaurant.ratings.reduce((prev, curr) => {
      return prev + curr
    })

    return sum / currRestaurant.ratings.length
  }


}
