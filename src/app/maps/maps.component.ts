import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent {
  map: mapboxgl.Map | undefined;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat: number = 24.736220649456065;
  lng: number = 46.7013209;

  ngOnInit() {
     this.map = new mapboxgl.Map({
        accessToken: "pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA",
        container: 'map',
        style: this.style,
        zoom: 15,
        center: [this.lng, this.lat]
      });
  }
}
