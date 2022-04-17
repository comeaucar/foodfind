import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { Geolocation } from '@capacitor/geolocation';
import Restaurant from '../models/Restaurant';

@Component({
  selector: 'app-restaurant-map',
  templateUrl: './restaurant-map.page.html',
  styleUrls: ['./restaurant-map.page.scss'],
})
export class RestaurantMapPage implements OnInit {
  loading:boolean = true;
  restaurant: Restaurant;
  restaurantCoords: any;
  geocodeRes: any = { lat: 0, lng: 0 };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  @ViewChild('map') mapView: ElementRef;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.restaurant = JSON.parse(params['data']);
    });
    this.getGeocode();
  }

  async getGeocode() {
    await this.geocoder(this.restaurant.address);
  }

  ionViewDidEnter() {
    this.createMap();
    this.loading = false
  }

  createMap() {
    const boundingRect =
      this.mapView.nativeElement.getBoundingClientRect() as DOMRect;

    CapacitorGoogleMaps.create({
      width: Math.round(boundingRect.width),
      height: Math.round(boundingRect.height),
      x: Math.round(boundingRect.x),
      y: Math.round(boundingRect.y),
      zoom: 5,
      latitude: 0,
      longitude: 0,
    });

    CapacitorGoogleMaps.addListener('onMapReady', async () => {
      CapacitorGoogleMaps.setMapType({
        type: 'normal', 
      });

      this.showCurrentPosition();
    });
  }

  async showCurrentPosition() {
    Geolocation.requestPermissions().then(async (premission) => {
      const coordinates = await Geolocation.getCurrentPosition();

      
      CapacitorGoogleMaps.addMarker({
        latitude: this.geocodeRes.lat,
        longitude: this.geocodeRes.lng,
        title: this.restaurant.name,
        snippet: this.restaurant.address.street,
      });

      
      CapacitorGoogleMaps.setCamera({
        latitude: this.geocodeRes.lat,
        longitude: this.geocodeRes.lng,
        zoom: 12,
        bearing: 0,
      });

      
    })
  }

  ionViewDidLeave() {
    CapacitorGoogleMaps.close();
  }

  geocoder(address?: any) {
    this.http
      .get(
        `https://geocode.search.hereapi.com/v1/geocode?q=${address.street}+${address.postal_code}&apiKey=48WXbaJspJTDAqZy5wD2VA-PlYzIwooyqu1b64TV7lc`
      )
      .subscribe(
        (res: any) => {
          console.log(res?.items[0].position);
          this.geocodeRes = res?.items[0].position;
        },
        (error) => {
          console.log('Error');
        },
        () => {
          console.log('request complete');
        }
      );
  }
}
