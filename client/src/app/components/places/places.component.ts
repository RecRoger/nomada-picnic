import { Component, inject } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { MapsService } from '../../services/maps.service';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-places',
  standalone: true,
  imports: [GoogleMap, MapMarker, MatExpansionModule],
  templateUrl: './places.component.html',
  styleUrl: './places.component.scss'
})
export class PlacesComponent {
  public readonly mapService: MapsService = inject(MapsService)

  places = [
    {
      name: "Plaza Dorrego",
      address: "Humberto 1º 400, C1065 Cdad. Autónoma de Buenos Aires, Argentina",
      url: "https://turismo.buenosaires.gob.ar/es/atractivo/plaza-dorrego",
    },
    {
      name: "Torre Monumental",
      address: "Av. Dr. José María Ramos Mejía 1315, C1104 Cdad. Autónoma de Buenos Aires, Argentina",
      url: "https://maps.google.com/?cid=3866694582117803022",
    },
    {
      name: "Plaza de Mayo",
      address: "Av. Hipólito Yrigoyen s/n, C1087 Cdad. Autónoma de Buenos Aires, Argentina",
      url: "http://www.turismo.buenosaires.gob.ar/es/atractivo/plaza-de-mayo",
    },
    {
      name: "Museo Histórico Nacional del Cabildo y la Revolución de Mayo",
      address: "Bolívar 65, C1066 Cdad. Autónoma de Buenos Aires, Argentina",
      url: "https://cabildonacional.cultura.gob.ar/",
    },
    {
      name: "Museo de Ciencias Naturales Bernardino Rivadavia",
      address: "Av. Patricias Argentinas 480, C1405 Cdad. Autónoma de Buenos Aires, Argentina",
      url: "http://www.macnconicet.gob.ar/",
    },
  ];

  mapOptions: google.maps.MapOptions = {
    center: { lat: 37.7749, lng: -122.4194 },
    zoom: 12,
  };

  markers = [
    { position: { lat: 37.7749, lng: -122.4194 }, label: 'San Francisco' },
    { position: { lat: 37.8044, lng: -122.2711 }, label: 'Oakland' }
  ];
}
