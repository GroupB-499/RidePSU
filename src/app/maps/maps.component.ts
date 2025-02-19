import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 24.736220649456065;
  lng: number = 46.7013209;
  locations: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Initialize the map
    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA",
      container: 'map',
      style: this.style,
      zoom: 15,
      center: [this.lng, this.lat]
    });

    // Fetch locations from the backend
    this.fetchLocations();
  }

  fetchLocations() {
    this.http.get('http://localhost:3000/api/locations').subscribe(
      (response: any) => {
        this.locations = response.locations;
        this.addMarkersToMap();
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  addMarkersToMap() {
    if (!this.map) return;

    this.locations.forEach(location => {
      const { placeName, latitude, longitude } = location;

      // Create a marker for each location
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${placeName}</h3>`))
        .addTo(this.map!);
    });
  }
}