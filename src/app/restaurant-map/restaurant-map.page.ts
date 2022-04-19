import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapacitorGoogleMaps } from '@capacitor-community/capacitor-googlemaps-native';
import { LatLng } from '@capacitor-community/capacitor-googlemaps-native/dist/esm/types/common/latlng.interface';
import { Geolocation } from '@capacitor/geolocation';
import Restaurant from '../models/Restaurant';

@Component({
  selector: 'app-restaurant-map',
  templateUrl: './restaurant-map.page.html',
  styleUrls: ['./restaurant-map.page.scss'],
})
export class RestaurantMapPage implements OnInit {
  //initialize variables
  loading:boolean = true;
  restaurant: Restaurant;
  restaurantCoords: any;
  directions: boolean
  title: string
  geocodeRes: any = { lat: 0, lng: 0 };
  userCoords: any = {
    coords: {
      latitude: 0,
      longitude: 0
    }
  }
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  @ViewChild('map') mapView: ElementRef;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.restaurant = JSON.parse(params['data']);
      if (params['directions']) {
        this.directions = true
        this.title = "Directions"
      } else {
        this.title = this.restaurant.name + " Location"
      }
    });
    this.getGeocode();
  }

  async getGeocode() {
    await this.geocoder(this.restaurant.address);
  }

  ionViewDidEnter() {
    if (this.directions) {
      this.createMap(true)
    } else {
      this.createMap();
    }
    this.loading = false
  }

  createMap(drawDirections?:boolean) {
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

      if (drawDirections) {
        this.showCurrentPosition(true);
      } else {
        this.showCurrentPosition()
      }
    });
  }

  async showCurrentPosition(directions?:boolean) {
    Geolocation.requestPermissions().then(async (premission) => {
      const coordinates = await Geolocation.getCurrentPosition();
      this.userCoords = coordinates

      CapacitorGoogleMaps.addMarker({
        latitude: this.geocodeRes.lat,
        longitude: this.geocodeRes.lng,
        title: this.restaurant.name,
        snippet: this.restaurant.address.street,
      });

      if (directions) {
        CapacitorGoogleMaps.addMarker({
          latitude: coordinates.coords.latitude,
          longitude: coordinates.coords.longitude,
          title: "Your current location",
          snippet: `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`,
        });

        const points: LatLng[] = [
          {
            latitude: this.userCoords.coords.latitude,
            longitude: this.userCoords.coords.longitude
          },
          {
            latitude: this.geocodeRes.lat,
            longitude: this.geocodeRes.lng
          }
        ];

        CapacitorGoogleMaps.addPolyline({
          points,
          color: '#ff00ff',
          width: 2
        })

        CapacitorGoogleMaps.setCamera({
          latitude: (this.geocodeRes.lat + this.userCoords.coords.latitude) / 2,
          longitude: (this.geocodeRes.lng + this.userCoords.coords.longitude) / 2,
          zoom: 2,
          bearing: 0,
        });
      } else {


        CapacitorGoogleMaps.setCamera({
          latitude: this.geocodeRes.lat,
          longitude: this.geocodeRes.lng,
          zoom: 12,
          bearing: 0,
        });
      }

    })
  }

  drawDirections() {

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
