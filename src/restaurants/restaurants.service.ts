import { 
    Injectable,
    NotFoundException,
    ConflictException
 } from '@nestjs/common';
 import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, Cuisine } from './restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ListRestaurantsDto } from './dto/query-restaurant.dto';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: Model<Restaurant>,
    ) {}

    // Create a new restaurant
    async create (dto: CreateRestaurantDto): Promise<Restaurant> {
        const slug = dto.slug ?? this.generateSlug(dto.nameEn);

        const existing = await this.restaurantModel.findOne({ slug}).lean();
        if (existing) {
            throw new ConflictException(
                `A restaurant with slug "${slug}" already exists. Please choose a different slug or omit it to auto-generate one.`
            );
        }

        const restaurant = new this.restaurantModel({
            nameEn: dto.nameEn,
            nameAr: dto.nameAr,
            slug,
            cuisines: dto.cuisines,
            location: {
                type: 'Point',
                coordinates: [dto.location.longitude,
                    dto.location.latitude
                ],
            },
        });
        return restaurant.save();
    }

    //Cuisine filters
    async findall (query: ListRestaurantsDto): Promise<Restaurant[]> {
        const filter : Record<string, unknown> = {};

        if (query.cuisine) {
            filter.cuisines = query.cuisine;
        }

        return this.restaurantModel.find(filter).lean();
    }

    // Find buy ID or Slug
    async findOne (idOrSlug: string): Promise<Restaurant> {
        const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);

        const filter = isObjectId ? { _id: idOrSlug } : { slug: idOrSlug };

        const restaurant = await this.restaurantModel.findOne(filter).lean();

        if (!restaurant) {
            throw new NotFoundException(
                `Restaurant not found for identifier: "${idOrSlug}".`
            );
        }
        return restaurant;
    }

    //Find nearby restaurants
    async findNearby(
        longitude: number,
        latitude: number,
        radiusMeters: number = 1000,
    ): Promise<Restaurant[]> {
        return this.restaurantModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: radiusMeters,
                },
            },
        }).lean();
     }

     //genrater slug from name
     private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
     }
            
}
