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
 //sample data
 addresses = [
  {
    street:"819 Gerrard Street East",
    postal_code:"M4M1Y8",
    city:"Toronto"


  },
  {
    street:"64 Edward Street",
    postal_code:"M5G1C9",
    city:"Toronto"


  },
  {
    street:"150 Dundas Street West",
    postal_code:"M5G1C6",
    city:"Toronto"


  },

  ];

  restaurants = [
    {
      id: "1",
      name: "Wynona Toronto",
      address: this.addresses[0],
      description: "Excellent restaurant in downtown Toronto ",
      tags: ["pasta","Italian cusine"],
      ratings : [4,5,4],
    },
    {
      id: "2",
      name: "Monkey sushi",
      address: this.addresses[1],
      description: "Number one Japanese restaurant with fabulous sushi",
      tags: ["sushi","Japanese cuisine","seafood"],
      ratings : [5,5,3],
    },
    {
      id: "3",
      name: "Subway",
      address: this.addresses[2],
      description: "Fast food restaurant",
      tags: ["fast food","bread","downtown"],
      ratings : [2,3,3],
    },
  ];
  //end sample data

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
