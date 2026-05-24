import { 
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpCode,
    HttpStatus,
 } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from '../restaurants/dto/create-user.dto';
import { FollowRestaurantDto } from '../restaurants/dto/follow.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly userSrevice: UsersService
    ){}

    //POST/users
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation(
        {
            summary: 'Create a new user'
        }
    )
    @ApiBody({
        type: CreateUserDto
    })
    @ApiResponse({
        status: 201,
        description: 'User created successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Validation error'
    })
    create(@Body() dto: CreateUserDto){
        return this.userSrevice.create(dto);
    }

    //Post/users/:userId/follow
    @Post(':userId/follow')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Follow a restaurant',
        description: 'Creates a follow relationsip between user and restaurant.'
    })
    @ApiParam({
        name: 'userId',
        description: 'ID of the user who wants to follow the restaurant',
    })
    @ApiBody({
        type: FollowRestaurantDto,
    })
    @ApiResponse({
        status: 201,
        description: 'Now user follow the restaurant'
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    @ApiResponse({
        status: 409,
        description: 'User already follows this restaurant'
    })
    followRestaurant(
        @Param('userId') userId: string,
        @Body() dto: FollowRestaurantDto){
        return this.userSrevice.followRestaurant(userId, dto);
        }

    //GET/users/:userId/recommendations
    @Get(':userId/recommendations')
    @ApiOperation({
        summary: ' Get restaurant recommendations for a user',
        description: 'Get restaurant recommendations for a user based on their favorite cuisines and similar users\' preferences.'
    })
    @ApiParam({
        name: 'userId',
        description: 'ID of the user to get recommendations for',
    })
    @ApiResponse({
        status: 200,
        description: 'Recommendations retrieved successfully',
        schema: {
            example: {
                similarUsers: [
                    {
                        _id: '...',
                        fullName: ' Ahmed Mohamed',
                        favoriteCuisines: ['Fried']
                    }
                ],
                recommendedRestaurants: [
                    {
                        _id: '...',
                        name: 'Al Baraka',
                        slug: 'al-baraka',
                    }
                ]
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    getRecommendations(@Param('userId') userId: string){
        return this.userSrevice.getRecommendations(userId);
    }
}
