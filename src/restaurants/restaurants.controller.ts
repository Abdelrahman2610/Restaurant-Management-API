import { 
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { ListRestaurantsDto, NearbyRestaurantsDto } from './dto/query-restaurant.dto';
import { Restaurant } from './restaurant.schema';

@ApiTags('restaurants')

@Controller('restaurants')
export class RestaurantsController {
    constructor(
        private readonly restaurantService: RestaurantsService
    ){}

    //POST/restaurants
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new restaurant',
        description: 'Create a new restaurant with English & Arabic names, a unique Slug,' +
        '1 to 3 cuisine types and geographic location.'
    
    })
    @ApiBody({ type: CreateRestaurantDto })
    @ApiResponse({
        status: 201,
        description: 'The restaurant has been successfully created.',
        type: Restaurant,
    })
    @ApiResponse({
        status: 409,
        description: 'Slug existed already'
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error',
    })

    create(@Body() dto: CreateRestaurantDto) {
        return this.restaurantService.create(dto);
    }

    //GET/restaurants
    @Get()
    @ApiOperation({
        summary: 'List of all the restaurants',
        description: 'Returns all restaurants.'
    })
    @ApiResponse({
        status: 200,
        description: 'List of restaurants',
        type: [Restaurant],
    })
    findAll(@Query() query: ListRestaurantsDto) {
        return this.restaurantService.findall(query);
    }

    //Get/restaurants/nearby
    @Get('nearby')
    @ApiOperation({
        summary: 'Find nearby restaurants',
        description: 'Returns restaurants within the given radius. Results are sorted by the nearest first.'
    })
    @ApiResponse({
        status: 200,
        description: 'List of nearby restaurants sorted by distance',
        type: [Restaurant],
    })
    findNearby(@Query() query: NearbyRestaurantsDto) {
        return this.restaurantService.findNearby(
            query.latitude,
            query.longitude,
            query.radius,
        );
    }

    //GET/restaurants/:idOrSlug
    @Get(':idOrSlug')
    @ApiOperation({
        summary: 'Get restaurant either by ID or Slug',
        description: 'Returns the restaurants that matches the objectID or the unique slug.'
    })
    @ApiParam({
        name: 'idOrSlug',
        description: 'Either the objectID or the unique slug of the restaurant',
        examples: {
            byId: {
                summary: 'Find restaurant by ID',
                value: '6650a1b2c3d4e5f6a7b8c9' 
            },
            bySlug: { 
                summary: 'Find restaurant by slug',
                 value: 'the-golden-fork' 
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'The restaurant matching the details provided',
        type: Restaurant,
    })
    @ApiResponse({
        status: 404,
        description: 'Restaurant not found for the given details provided',
    })
    findOne(@Param('idOrSlug') idOrSlug: string) {
        return this.restaurantService.findOne(idOrSlug);
    }
}
