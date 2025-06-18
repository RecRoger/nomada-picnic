import { inject, Injectable } from '@angular/core';
import { COSTS_TYPES } from '@enums/cost-types.enum';
import { PLACES_TYPES } from '@enums/places-types.enum';
import { BudgetData } from '@models/budget.dto';
import { CostDto } from '@models/cost.dto';
import { PlaceDto } from '@models/place.dto';
import { PriceingList, PriceingTransportation } from '@models/priceing.dto';
import { CostsService } from '@services/costs.service';
import { PlacesService } from '@services/places.service';
import { BehaviorSubject, combineLatest, debounceTime, forkJoin, map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private transportationPrice$ = new BehaviorSubject<PriceingTransportation>({});
  private productionPrice$ = new BehaviorSubject<PriceingList>({});
  private giftsPrice$ = new BehaviorSubject<PriceingList>({});

  private readonly costsService = inject(CostsService)

  private readonly placesService = inject(PlacesService)


  private readonly GET_PLACE = (value: BudgetData): string => value?.basics?.place
  private readonly GET_GUESTS = (value: BudgetData): number => value?.basics?.guestsAmount
  private readonly GET_TABLES = (value: BudgetData): number => value?.production?.tableAmount
  private readonly GET_BIG_TABLE_FLAG = (value: BudgetData): boolean => value?.production?.bigTableIndicator


  get totalPrice$(): Observable<number> {
    return combineLatest([
      this.transportationPrice$.asObservable(),
      this.productionPrice$.asObservable(),
      this.giftsPrice$.asObservable()
    ]).pipe(
      debounceTime(500),
      map(([transportationCost, productionPrice]) => {
        return ((transportationCost?.price || 0) + (productionPrice?.listPrice || 0)) || 0
      })
    )
  }



  public checkPrice(values: BudgetData[]): void {
    const [prevValue, currentValue] = values
    this.checkTransportation(prevValue, currentValue)
    this.checkProduction(prevValue, currentValue)
  }

  private checkTransportation(prev: BudgetData, value: BudgetData): void {
    if (this.GET_PLACE(prev) !== this.GET_PLACE(value) ||
      this.GET_GUESTS(prev) !== this.GET_GUESTS(value) ||
      this.GET_TABLES(prev) !== this.GET_TABLES(value) ||
      this.GET_BIG_TABLE_FLAG(prev) !== this.GET_BIG_TABLE_FLAG(value)) {
      this.calculateTransportationPrice(value)
    }
  }
  private calculateTransportationPrice(value: BudgetData): void {
    forkJoin([
      this.placesService.getPlacesCached(PLACES_TYPES.BASIC),
      this.placesService.getPlacesCached(PLACES_TYPES.PUBLIC),
    ]).pipe(
      map(([basicPlaces, publicPlaces]: PlaceDto[][]) => {
        const selectedPlace = publicPlaces.find(place => place._id === value.basics.place)
        const selectedZone = basicPlaces.find(zone => zone.zone === selectedPlace?.zone)
        const extra = value.production.bigTableIndicator || value.production.tableAmount >= 5
        const price = (selectedZone?.transportationCost || 0) * (extra ? 1.8 : 1)
        this.transportationPrice$.next({
          code: selectedPlace?._id,
          name: selectedPlace?.name,
          zone: selectedZone?.zone,
          price,
          extra,
        })
      }),
      take(1)
    ).subscribe(() => console.log('price update - transport'))

  }

  private checkProduction(prev: BudgetData, value: BudgetData): void {
    if (this.GET_GUESTS(prev) != this.GET_GUESTS(value) ||
      this.GET_TABLES(prev) != this.GET_TABLES(value)
    ) {
      this.calculateProductionPrice(value)
    }
  }
  private calculateProductionPrice(value: BudgetData): void {
    this.costsService.getCostsCached(COSTS_TYPES.PRODUCTION)
      .pipe(
        map((productionCosts: CostDto[]) => {
          const costs = productionCosts.filter(cost => !cost.guestsCoverage ||
            Number(value.basics.guestsAmount) >= cost.guestsCoverage)
            .map(cost => ({
              code: cost._id,
              name: cost.name,
              price: Number(cost.finalPrice),
              // amount?: number,
            }))

          this.productionPrice$.next({
            items: costs,
            listPrice: costs.reduce((acc, cost) => acc + cost.price, 0)
          })
        }),
        take(1)
      ).subscribe(() => console.log('price update - production'))

  }
}                                   
