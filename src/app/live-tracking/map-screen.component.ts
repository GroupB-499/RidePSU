import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { AuthService } from '../auth-service.service';
import { baseUrl } from '../configs';
import { ToastService, ToastType } from '../toast.service';
import { WebSocketService } from '../websocket.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComplaintsComponent } from '../complaints/complaints.component';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.css']
})
export class MapScreenComponent implements OnInit, OnDestroy {
  map: mapboxgl.Map | undefined;
  driverMarker: mapboxgl.Marker | undefined;
  booking: any;
  locations: any[] = [];
  isDriver: boolean = false;
  isRideActive: boolean = false;
  interval: any;
  routeLayerId = "routeLayer";
  eta: string = 'Calculating...';
  private apiUrl = `${baseUrl}/api`;
  private static rtlPluginInitialized = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private wsService: WebSocketService,private toast: ToastService,
      private modalService: NgbModal,
  ) { }
  customDelayTime: number = 0;
  delayTimer = 0;

  ngOnInit() {

    this.initializeMap();
    this.fetchUserRole();
    this.fetchLocations();
    this.wsService.connect();
  }

  
  delayBooking() {
    if (!this.delayTimer || this.delayTimer < 1) {
      this.toast.show("Please enter a valid delay time (1-60 minutes).", ToastType.ERROR);
      return;
    }
  
    console.log(this.booking.id);
    this.wsService.sendMessage({ 
      type: "ride_delayed", 
      title: "Ride has been delayed",
      userId: this.authService.getUserInfo().userId,
      delayTime: this.delayTimer,
      scheduleId:this.booking.id,
    });
  
    this.updateDelayTime(this.booking.id, this.delayTimer);
  
    const interval = setInterval(() => {
      this.delayTimer--;
      if (this.delayTimer <= 0) {
        clearInterval(interval);
      }
    }, 60000);
  }

  getUserById(userId: string) {
    return this.http.get(`${this.apiUrl}/get-user-by-id/${userId}`,{headers: new HttpHeaders({
                      'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                    })});
  }

  calculateETA() {
    if (!this.booking || !this.booking.date || !this.booking.time) {
      this.eta = 'N/A';
      return;
    }

    // Convert booking date & time into a single Date object
    const bookingDateTime = new Date(`${this.booking.date}T${this.booking.time}:00`);

    // Get current time
    const now = new Date();

    // Calculate remaining time in milliseconds
    const remainingMs = bookingDateTime.getTime() - now.getTime();

    if (remainingMs <= 0) {
      this.eta = '00:00';
      return;
    }

    // Convert milliseconds to HH:MM format
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));

    this.eta = `${hours.toString().padStart(2, '0')} hours ${minutes.toString().padStart(2, '0')} minutes`;
  }
  initializeMap() {
    this.map = new mapboxgl.Map({
      accessToken: "pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA",
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 15,
      center: [46.7013209, 24.736220649456065]
    });

    if (!MapScreenComponent.rtlPluginInitialized) {
      (mapboxgl as any).setRTLTextPlugin(
        'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
        () => { console.log('RTL Plugin Loaded'); },
        true
      );
      MapScreenComponent.rtlPluginInitialized = true;
    }
  }

  fetchUserRole() {
    this.isDriver = this.authService.getUserInfo().role === 'driver';
  }

  fetchLatestBooking() {
    const userId = this.authService.getUserInfo().userId;

    const endpoint = this.isDriver
      ? `${baseUrl}/api/get-upcoming-driver-booking/${userId}`
      : `${baseUrl}/api/get-upcoming-booking/${userId}`;

    this.http.get(endpoint, {headers: new HttpHeaders({
                      'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
                    })}).subscribe(
      (response: any) => {
        this.booking = response.booking;
        console.log("Latest Booking:", this.booking);
        if(!this.isDriver){
          this.getUserById(this.booking.driverId).subscribe({
            next: (driverResponse: any) => {
              this.booking.driverName = driverResponse.user.name;
              console.log("Driver Name:", this.booking.driverName);
            },
            error: (error) => {
              console.error('Error fetching driver details:', error);
            }
          });
        }
        
        this.drawRoute(null, null);
        this.calculateETA();


        if (!this.isDriver) {
          this.trackDriver();
        }
      },
      (error) => {
        this.toast.show("No upcoming booking found!", ToastType.ERROR);
        console.error('Error fetching booking:', error);
      }
    );
  }

  fetchLocations() {
    this.http.get(`${baseUrl}/api/locations`,{headers: new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'  // ✅ Bypasses Ngrok security page
    })}).subscribe(
      (response: any) => {
        this.locations = response.locations;
        this.addMarkersToMap();
        this.fetchLatestBooking();
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

      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${placeName}</h3>`))
        .addTo(this.map!);
    });
  }

  async drawRoute(lat: any, lng: any) {
    if (!this.map || !this.booking) return;

    const pickupLocation = this.locations.find(loc => loc.placeName === this.booking.pickup);
    const dropoffLocation = this.locations.find(loc => loc.placeName === this.booking.dropoff);

    if (!pickupLocation || !dropoffLocation) {
      console.error("Pickup or drop-off location not found in locations list");
      return;
    }

    var start;
    if (lat === null || lng === null) {
      start = [pickupLocation.longitude, pickupLocation.latitude];

    } else {
      start = [lng, lat];

    }

    const end = [dropoffLocation.longitude, dropoffLocation.latitude];
    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=pk.eyJ1IjoiaGFzaGlyMTIiLCJhIjoiY2x3NTg1YWNoMWRxeDJpbXV0dXU3dDMxMiJ9.WrBZRJ6L6AnAGPJmr10leA`;

    try {
      const response: any = await this.http.get(directionsUrl).toPromise();
      const route = response.routes[0].geometry;

      if (this.map.getLayer(this.routeLayerId)) {
        this.map.removeLayer(this.routeLayerId);
        this.map.removeSource("route");
      }

      this.map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route
        }
      });

      this.map.addLayer({
        id: this.routeLayerId,
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#ff5733", "line-width": 5 }
      });
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }

  startRide() {
    this.isRideActive = true;
    this.trackDriverLocation();
    this.wsService.sendMessage({ type: "ride_started",userId: this.authService.getUserInfo().userId, scheduleId: this.booking.id});
  }

  stopRide() {
    this.isRideActive = false;
    clearInterval(this.interval);
    this.wsService.sendMessage({ type: "ride_ended",userId: this.authService.getUserInfo().userId, scheduleId: this.booking.id});
  }
  openComplaintModal() {
    const userInfo = this.authService.getUserInfo();

    const modalRef = this.modalService.open(ComplaintsComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.userId = userInfo.userId;
    modalRef.componentInstance.username = userInfo.name;
  }

  trackDriverLocation() {
    // Clear any existing interval to prevent overlap
    if (this.interval) {
      clearInterval(this.interval);
    }


    this.interval = setInterval(() => {
      console.log("Tracking driver location...");

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Driver location:", latitude, longitude);

          // Send location via WebSocket
          this.wsService.sendMessage({
            type: "driver_location",
            userId: this.authService.getUserInfo().userId,
            date: this.booking.date,
            time: this.booking.time,
            lat: latitude,
            lng: longitude
          });

          // Update or create marker
          if (!this.driverMarker) {
            this.driverMarker = new mapboxgl.Marker({ color: 'blue' })
              .setLngLat([longitude, latitude])
              .addTo(this.map!);
          } else {
            this.driverMarker.setLngLat([longitude, latitude]);
          }
          this.drawRoute(latitude, longitude);
        },
        (error) => {
          // Detailed error handling
          switch (error.code) {
            case 1:
              console.error("Permission denied by user.");
              break;
            case 2:
              console.error("Position unavailable. Possible causes: GPS signal weak or hardware issue.");
              break;
            case 3:
              console.error("Request timed out.");
              break;
            default:
              console.error("Unknown geolocation error:", error.message);
          }
        },
        {
          enableHighAccuracy: true, // High accuracy for precise tracking
          timeout: 15000,           // Increased timeout to 15 seconds
          maximumAge: 2000          // Allow 1-second-old cached position
        }
      );
    }, 5000);
  }
  async updateDelayTime(scheduleId: string, delayTime: number): Promise<boolean> {
    try {
      this.http.post<void>(`${baseUrl}/api/update-delay-time`, { scheduleId, delayTime }).subscribe({next: (response:any)=>{
        console.log(response.message);

      }, error:(error)=>{
        console.log(error);
      }});
      return true;
    } catch (error) {
      console.error('Error updating delay time:', error);
      return false;
    }
  }

  trackDriver() { // passsenger listening to web socket stream to get latest location
    console.log("tracking driver ");
    this.wsService.messages.subscribe((data: any) => {
      console.log(data);
      console.log(data.userId == this.booking.driverId);
      if (data.lat && data.lng && data.userId === this.booking.driverId && data.date === this.booking.date && data.time === this.booking.time) {
        if (!this.driverMarker) {
          console.log("Marker added!");

          this.driverMarker = new mapboxgl.Marker({ color: 'red' })
            .setLngLat([data.lng, data.lat])
            .addTo(this.map!);

        } else {
          this.driverMarker.setLngLat([data.lng, data.lat]);
        }
        this.drawRoute(data.lat, data.lng);
      }
    });


  }

  ngOnDestroy() {
    this.wsService.disconnect();
    clearInterval(this.interval);
  }
}
