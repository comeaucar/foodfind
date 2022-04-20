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
  directions: boolean = false
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
      if (params['directions'] && JSON.parse(params['directions']).res === true) {
        console.log("is directions")
        this.directions = true
        this.title = "Directions"
      } else {
        this.directions = false
        this.title = this.restaurant.name + " Location"
      }
    });
    this.getGeocode();
  }

  async getGeocode() {
    await this.geocoder(this.restaurant.address);
  }

  ionViewDidEnter() {
    this.loading = false
    if (this.directions) {
      this.createMap(true)
    } else {
      this.createMap();
    }
    
  }

  createMap(drawDirections?:boolean) {
    const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
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

      if (drawDirections === true) {
        this.showCurrentPosition(true);
      } else {
        this.showCurrentPosition()
      }
    });
  }

  async showCurrentPosition(directions?: boolean) {
    if (directions === true) {
      Geolocation.requestPermissions().then(async (premission) => {
        const coordinates = await Geolocation.getCurrentPosition();
        this.userCoords = coordinates

          CapacitorGoogleMaps.addMarker({
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
            title: "Your current location",
            snippet: `${coordinates.coords.latitude}, ${coordinates.coords.longitude}`,
          });
        
          CapacitorGoogleMaps.addMarker({
            latitude: this.geocodeRes.lat,
            longitude: this.geocodeRes.lng,
            title: this.restaurant.name,
            snippet: this.restaurant.address.street,
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
        

      })
    } else {
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
    }
  }

  goBack() {
    this.router.navigate(['/restaurant-details', {data: JSON.stringify(this.restaurant)}])
  }

  ionViewDidLeave() {
    CapacitorGoogleMaps.clear();
    CapacitorGoogleMaps.close();
    this.directions = false
  }

  geocoder(address?: any) {
    this.http
      .get(
        `https://geocode.search.hereapi.com/v1/geocode?q=${address.street}+${address.postal_code}&apiKey=48WXbaJspJTDAqZy5wD2VA-PlYzIwooyqu1b64TV7lc`
      )
      .subscribe(
        (res: any) => {
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
