import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CostsTypes, PlacesTypes } from '@shared/enums';
import { ICost } from '@shared/interfaces';
import { IPackagePrice } from '@shared/interfaces/package-prices.interface';
import { Model, Types } from 'mongoose';
import { PicnicPackage, PicnicPackageDocument } from 'src/common/database/schemas/picnic-packages.schema';
import { Place, PlacesDocument } from 'src/common/database/schemas/places.schema';
import { Cost, CostDocument } from 'src/common/database/schemas/production-cost.schema';
import { PicnicPackageDto } from 'src/common/models/picnic-package.dto';
import { FilesService } from 'src/modules/files/files.service';

@Injectable()
export class PicnicPackageService {
  private readonly logger = new Logger(PicnicPackageService.name);

  constructor(
    @InjectModel(PicnicPackage.name)
    private readonly packageModel: Model<PicnicPackageDocument>,
    @InjectModel(Cost.name)
    private readonly costModel: Model<CostDocument>,
    @InjectModel(Place.name)
    private readonly placeModel: Model<PlacesDocument>,
    private filesService: FilesService,
  ) { }

  async findPackages(query?: string): Promise<PicnicPackageDto[]> {
    const isPublic = !query || query !== 'full'
    this.logger.log('[findPackages]', `public: ${isPublic}`);
    try {
      const packages = await this.packageModel.find().populate('productionCostIds').lean().exec();
      const courtesyCosts = await this.costModel.find({ type: CostsTypes.GIFTS }).lean().exec();
      const basePlace = await this.placeModel.findOne({ type: PlacesTypes.BASIC, zone: 0 }).lean().exec();
      const baseTransportCost = basePlace?.transportationCost || 0;
      return packages.map((pkg) => {
        const minGuests = pkg.minGuests || 2;

        const baseCost = this.calculatePackageBaseCost(
          pkg,
          courtesyCosts as unknown as Cost[],
          baseTransportCost,
          minGuests,
        );
        const minPrice = this.calculatePriceFromBaseCost(
          baseCost,
          pkg.expensesPercent,
          pkg.profitPercent,
        );
        const {
          profitPercent,
          expensesPercent,
          productionCostIds,
          ...publicPackageData
        } = pkg;

        const productionCosts = productionCostIds as unknown as ICost[]
        return {
          ...publicPackageData,
          minPrice, // 👈 Nuevo campo retornado con el precio mínimo
          ...(
            isPublic ? {} : {
              baseCost,
              profitPercent,
              expensesPercent,
              productionCostIds: productionCosts.map(cost => cost.name)
            })
        } as PicnicPackageDto;
      }) as unknown as PicnicPackageDto[];
    } catch (err) {
      this.logger.error(` - Error finding Packages: ${err.message}`, err.stack);
      throw new Error('Error al consultar paquetes');
    }
  }

  /**
   * Agrupa los precios por rangos de invitados que comparten el mismo costo final
  */
  // async calculatePricesRange(packageId: string): Promise<PackagePriceGroup[]> {
  async findPackagePrices(id: string, isPrivate: boolean): Promise<IPackagePrice[]> {
    this.logger.log('[findPackages]', `public: ${!isPrivate}`);

    try {
      const picnicPackage = await this.packageModel.findById(id).populate('productionCostIds').lean().exec();
      const courtesyCosts = await this.costModel.find({ type: CostsTypes.GIFTS }).lean().exec();
      const basePlace = await this.placeModel.findOne({ type: PlacesTypes.BASIC, zone: 0 }).lean().exec();
      const baseTransportCost = basePlace?.transportationCost || 0;
      const minGuests = picnicPackage.minGuests || 2;
      const maxGuests = picnicPackage.maxGuests || 10;
      const groupedPrices: IPackagePrice[] = [];
      let currentGroup: IPackagePrice | null = null;

      for (let guests = minGuests; guests <= maxGuests; guests++) {
        const baseCost = this.calculatePackageBaseCost(
          picnicPackage,
          courtesyCosts as unknown as Cost[],
          baseTransportCost,
          guests,
        );
        const price = this.calculatePriceFromBaseCost(
          baseCost,
          picnicPackage.expensesPercent,
          picnicPackage.profitPercent,
        );
        if (!currentGroup || currentGroup.price !== price) {
          if (currentGroup) {
            groupedPrices.push(currentGroup);
          }
          currentGroup = {
            minGuests: guests,
            maxGuests: guests,
            price,
            ...(isPrivate ? { baseCost } : {}),
          };
        } else {
          currentGroup.maxGuests = guests;
        }
      }
      if (currentGroup) {
        groupedPrices.push(currentGroup);
      }
      return groupedPrices;
    } catch (err) {
      this.logger.error(` - Error finding Packages: ${err.message}`, err.stack);
      throw new Error('Error al consultar paquetes');
    }
  }

  async create(pkg: PicnicPackageDto, file: Express.Multer.File): Promise<PicnicPackageDto> {
    this.logger.log('[create]', pkg.name);
    try {
      if (file) {
        const fileUrl = await this.filesService.saveFiles(
          [file],
          pkg.name.replaceAll(' ', '-'),
          'packages',
        );
        pkg.image = fileUrl[0]
      } else {
        pkg.image = undefined
      }
      const createPackage = new this.packageModel(pkg);
      const newPackage = (await createPackage.save()) as unknown as PicnicPackageDto;
      this.logger.log('[place created]')

      return newPackage
    } catch (err) {
      this.logger.error(` - Error creating Package: ${err.message}`, err.stack);
      throw new Error('Error al crear el paquete');
    }
  }

  async update(id: string, pkg: Partial<PicnicPackageDto>, file?: Express.Multer.File): Promise<PicnicPackageDto> {
    this.logger.log(`[update]`, `id: ${id}`);
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`El ID '${id}' no es un ObjectId válido`);
      }
      if (file) {
        const fileUrl = await this.filesService.saveFiles(
          [file],
          pkg.name.replaceAll(' ', '-'),
          'packages',
        );
        pkg.image = fileUrl[0]
      } else {
        pkg.image = undefined
      }
      const updatedPackage = await this.packageModel
        .findByIdAndUpdate(id, { $set: pkg }, { new: true })
        .exec();

      if (!updatedPackage) {
        throw new NotFoundException(`Paquete de picnic con ID '${id}' no encontrado`);
      }
      this.logger.log('[package updated]')

      return { ...updatedPackage, productionCostIds: [] };
    } catch (err) {
      this.logger.error(` - Error updateing Package: ${err.message}`, err.stack);
      throw new Error('Error al guardar el paquete');
    }
  }

  async delete(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`El ID '${id}' no es un ObjectId válido`);
    }
    const result = await this.packageModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Paquete de picnic con ID '${id}' no encontrado`);
    }
    return true;
  }

  /**
   * 1. Calcula únicamente el COSTO BASE DIRECTO (Producción + Cortesía + Transporte)
   * para un número determinado de invitados.
   */
  private calculatePackageBaseCost(
    pkg: any,
    courtesyCosts: Cost[],
    transportCost: number,
    guestsCount: number,
  ): number {
    // A. Sumar costos de producción aplicables según guestsCoverage
    const applicableProductionCosts = (pkg.productionCostIds || []).filter(
      (cost: Cost) => !cost.guestsCoverage || guestsCount >= cost.guestsCoverage,
    );

    const sumProductionCosts = applicableProductionCosts.reduce((acc, cost) => {
      const provider = cost.providerCost || 0;
      const production = cost.productionCost || 0;
      return acc + provider + production;
    }, 0);

    // B. Sumar costos de cortesía aplicando el multiplicador según el guestsCoverage
    const sumCourtesyCosts = courtesyCosts.reduce((acc, cost) => {
      const provider = cost.providerCost || 0;
      const production = cost.productionCost || 0;
      const unitCost = provider + production;

      // Si no tiene definido guestsCoverage o es <= 0, se aplica 1 sola vez
      if (!cost.guestsCoverage || cost.guestsCoverage <= 0) {
        return acc + unitCost;
      }

      // Calculamos cuántas unidades/lotes se necesitan para cubrir a los invitados
      const multiplier = Math.ceil(guestsCount / cost.guestsCoverage);

      return acc + unitCost * multiplier;
    }, 0);

    const transportTotalCost = transportCost * (pkg.extraTransport && guestsCount > pkg.extraTransport ? 1.8 : 1)

    // C. Retornar Subtotal Directo (sin porcentajes)
    return sumProductionCosts + sumCourtesyCosts + transportTotalCost;
  }

  /**
   * 2. Toma un costo base y aplica los porcentajes de gastos generales (OPEX)
   * y margen de ganancia para calcular el PRECIO FINAL.
   */
  private calculatePriceFromBaseCost(
    baseCost: number,
    expensesPercent: number = 0,
    profitPercent: number = 0,
  ): number {
    // D. Aporte a Gastos Generales (OPEX)
    // OJO - Este porcentaje se lo sumamos al picnic para pagar los gastos
    const overheadAmount = baseCost * (expensesPercent / 100);

    // E. Costo Total Real
    // OJO - Este porcentaje se lo sumamos de ganancia
    const totalCost = baseCost + overheadAmount;

    // F. Precio Final con Margen de Ganancia
    const finalPrice = totalCost * (1 + profitPercent / 100);

    return Math.round(finalPrice);
  }

}