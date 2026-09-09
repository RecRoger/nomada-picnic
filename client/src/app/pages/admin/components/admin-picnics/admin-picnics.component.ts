import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PicnicEditionDialogComponent } from '@components/picnic-edition-dialog/picnic-edition-dialog.component';
import { PicnicsService } from '@services/picnics.service';
import { PaymentMethods } from '@shared/enums';
import { IPicnicDetail } from '@shared/interfaces/picnic-detail.interface';

const MAT_MODULES = [
  MatIconModule,
  MatButtonModule,
  MatSortModule,
  MatPaginatorModule,
  MatTableModule,
  MatSnackBarModule,
]
@Component({
  selector: 'app-admin-picnics',
  templateUrl: './admin-picnics.component.html',
  styleUrls: ['./admin-picnics.component.scss'],
  imports: [
    CommonModule,
    ...MAT_MODULES,
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: 0, visibility: 'hidden' })),
      state('expanded', style({ height: '*', opacity: 1, visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class AdminPicnicsComponent implements OnInit {
  dataSource = new MatTableDataSource<IPicnicDetail>([]);
  displayedColumns: string[] = ['id', 'eventDate', 'guests', 'place', 'status', 'totalAmount', 'actions'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: IPicnicDetail | null = null;

  // Estado de Paginación y Ordenamiento
  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  sortBy = 'createdAt';
  sortOrder: 'asc' | 'desc' = 'desc';
  isLoading = false;

  public METHODS = PaymentMethods;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  readonly dialog = inject(MatDialog);
  private picnicsService = inject(PicnicsService)
  private snackBar = inject(MatSnackBar)


  ngOnInit(): void {
    this.loadPicnics();
  }

  loadPicnics(): void {
    this.isLoading = true;
    this.picnicsService
      .findAllPicnics({
        page: this.currentPage,
        limit: this.pageSize,
        sortBy: this.sortBy,
        sortOrder: this.sortOrder,
      })
      .subscribe({
        next: (response) => {
          this.dataSource.data = response!.picnics;
          this.totalItems = response!.meta.totalItems;
          this.isLoading = false;
        },
        error: (err) => {
          this.snackBar.open('Error al cargar los picnics', 'Cerrar', { duration: 3000 });
          this.isLoading = false;
        },
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadPicnics();
  }

  onSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.sortBy = sortState.active;
      this.sortOrder = sortState.direction as 'asc' | 'desc';
    } else {
      this.sortBy = 'createdAt';
      this.sortOrder = 'desc';
    }
    this.loadPicnics();
  }

  editPicnic(id: string, picnic: FormData): void {
    this.picnicsService.editPicnic(id, picnic).subscribe(resp => {
      if (resp) {
        this.loadPicnics()
      }
    })
  }

  confirmPicnic(picnic: IPicnicDetail, event: MouseEvent): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(PicnicEditionDialogComponent, {
      data: picnic,
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editPicnic(picnic._id, result)
      }
    });

  }

  deletePicnic(id: string, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar este picnic?')) {
      this.picnicsService.deletePicnic(id).subscribe({
        next: () => {
          this.snackBar.open('Picnic eliminado correctamente', 'Cerrar', { duration: 3000 });
          this.loadPicnics();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el picnic', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }
}
