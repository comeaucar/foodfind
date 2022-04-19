import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Address from '../models/Address';
import Restaurant from '../models/Restaurant';
import { Storage } from '@capacitor/storage';
import { ActivatedRoute, Router } from '@angular/router';
import { InputValidationService } from '../services/input-validation.service';

@Component({
  selector: 'app-add-restaurant',
  templateUrl: './add-restaurant.page.html',
  styleUrls: ['./add-restaurant.page.scss'],
})
export class AddRestaurantPage implements OnInit {
  //Form elements to add a restaurant
  restaurantForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    tag: new FormControl(''),
    street: new FormControl('', Validators.required),
    postal_code: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
  });
//variables initalized
  tags = [];
  invalidPostalCode = false
  emptyField = false
  isEdit: boolean = false
  editRestaurant: any

  async submitRestaurant() {
    //validation check
    if ((this.restaurantForm.value.name || this.restaurantForm.value.description || this.restaurantForm.value.street || this.restaurantForm.value.city) === '') {
      this.emptyField = true
      return
    } else if (!this.validationService.validatePostalCode(this.restaurantForm.value.postal_code)) {
      this.invalidPostalCode = true
      return
    }
    let keys = []
    //Address object initialized with value
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
    //A new restaurant object is created with form values
    let newRestaurant = new Restaurant(
      "restaurant-" + (keys.length + 1).toString(),
      this.restaurantForm.value.name,
      newAddress,
      this.restaurantForm.value.description,
      this.tags,
      []
    );
    //restaurant is stored to the database
    await Storage.set({
      key: 'restaurant-' + (keys.length + 1).toString(),
      value: JSON.stringify(newRestaurant),
    });

    this.router.navigate(['/tabs/tab2']).then(() => {
      window.location.reload()
    })
  }

  async submitEditRestaurant() {
    if ((this.restaurantForm.value.name || this.restaurantForm.value.description || this.restaurantForm.value.street || this.restaurantForm.value.city) === '') {
      this.emptyField = true
      return
    } else if (!this.validationService.validatePostalCode(this.restaurantForm.value.postal_code)) {
      this.invalidPostalCode = true
      return
    }

    let newAddress = new Address(
      this.restaurantForm.value.street,
      this.restaurantForm.value.postal_code,
      this.restaurantForm.value.city
    );

    let newRestaurant = new Restaurant(
      this.editRestaurant.id,
      this.restaurantForm.value.name,
      newAddress,
      this.restaurantForm.value.description,
      this.tags,
      this.editRestaurant.ratings
    );

    await Storage.set({
      key: this.editRestaurant.id,
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

  constructor(private router:Router, private validationService: InputValidationService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['edit']) {
        this.isEdit = true
        this.editRestaurant = JSON.parse(params['data'])
        this.tags = this.editRestaurant.tags
        this.restaurantForm.patchValue({
          name: this.editRestaurant.name,
          description: this.editRestaurant.description,
          street: this.editRestaurant.address.street,
          city: this.editRestaurant.address.city,
          postal_code: this.editRestaurant.address.postal_code
        })
        }
    })
  }

  removeTag(index) {
    this.tags.splice(index,1)
  }
}
