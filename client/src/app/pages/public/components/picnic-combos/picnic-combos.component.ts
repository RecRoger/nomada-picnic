import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ApiImageUrlPipe } from '@pipes/api-image-url.pipe';
import { PackagesService } from '@services/packages.service';
import { IPicnicPackage } from '@shared/interfaces';
import { map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-picnic-combos',
  imports: [AsyncPipe, MatIconModule, DecimalPipe, CurrencyPipe, ApiImageUrlPipe],
  templateUrl: './picnic-combos.component.html',
  styleUrl: './picnic-combos.component.scss'
})
export class PicnicCombosComponent implements OnInit {
  protected readonly packageService = inject(PackagesService);

  public packagesList$: Observable<IPicnicPackage[]> = this.packageService.getPackages()
    .pipe(map(list => list.sort((a, b) => (a.minPrice || 0) - (b.minPrice || 0))));

  ngOnInit(): void { }
}
