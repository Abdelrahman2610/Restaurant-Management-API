import { ApiProperty }  from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FollowRestaurantDto {
    @ApiProperty({
        example: '507f1f77bcf86cd799439011',
        description: 'Restaurant ID in the format of a MongoDB ObjectID',
    })
    @IsMongoId({ message: 'Restaurant ID format must be a valid MongoDB ObjectID' })
    restaurantId!: string;
}