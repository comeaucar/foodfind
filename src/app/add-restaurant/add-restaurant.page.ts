import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Address from '../models/Address';
import Restaurant from '../models/Restaurant';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {
  restaurantForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    tag: new FormControl(''),
    street: new FormControl(''),
    postal_code: new FormControl(''),
    city: new FormControl(''),
  });

  tags = [];

  async submitRestaurant() {
    let keys = []
    let newAddress = new Address(
      this.restaurantForm.value.street,
      this.restaurantForm.value.postal_code,
      this.restaurantForm.value.city
    );
    
    await Storage.keys().then((res) => {
      keys = res.keys.filter((e) => {
        return e.split('-')[0] === "restaurant"
      })
    })
    let newRestaurant = new Restaurant(
      "restaurant-" + (keys.length + 1).toString(),
      this.restaurantForm.value.name,
      newAddress,
      this.restaurantForm.value.description,
      this.tags,
      []
    );
    await Storage.set({
      key: 'restaurant-' + (keys.length + 1).toString(),
      value: JSON.stringify(newRestaurant),
    });
    
    this.router.navigate(['/tabs/tab2']).then(() => {
      window.location.reload()
    })
  }

  addTag() {
    this.tags.push(this.restaurantForm.value.tag);
    this.restaurantForm.controls.tag.reset()
  }

  constructor(private router:Router) {}

  ngOnInit() {}
}
