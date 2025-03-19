import { Controller, Get } from '@nestjs/common';
import { PlacesService } from 'server/modules/places/places.service';

@Controller({ version: '1' })
export class PlacesController {
  constructor(private readonly placesService: PlacesService) { }

  @Get()
  findPlaces() {
    return this.placesService.findAll()
  }
}
