import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { baseUrl } from '../configs';

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
  private static rtlPluginInitialized = false; // Ensure the plugin is only loaded once

  ngOnInit() {
    // Initialize the map
    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA",
      container: 'map',
      style: this.style,
      zoom: 15,
      center: [this.lng, this.lat]
    });
    if (!MapsComponent.rtlPluginInitialized) {
      (mapboxgl as any).setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        () => {
          console.log('RTL Plugin Loaded');
        },
        true // This forces reloading, but we already prevent multiple calls
      );
      MapsComponent.rtlPluginInitialized = true; 
    }
    // Fetch locations from the backend
    this.fetchLocations();
  }

  fetchLocations() {
    this.http.get(`${baseUrl}/api/locations`,{headers: new HttpHeaders({
                          'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                        })}).subscribe(
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