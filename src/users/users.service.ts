import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { Follow } from './follow.schema';
import { CreateUserDto } from '../restaurants/dto/create-user.dto';
import { FollowRestaurantDto } from '../restaurants/dto/follow.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = new this.userModel(dto);
    return user.save();
  }

  async followRestaurant(
    userId: string,
    dto: FollowRestaurantDto,
  ): Promise<Follow> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException(`User not found: ${userId}`);
    }

    try {
      const follow = new this.followModel({
        userId: new Types.ObjectId(userId),
        restaurantId: new Types.ObjectId(dto.restaurantId),});
    return await follow.save();
    }catch(err:any){
      if (err.code === 11000) {
        throw new ConflictException('You are already following this restaurant.');
      }
      throw err;
    }
  }

  async getRecommendations(userId: string): Promise<{
    similarUsers: User[];
    recommendedRestaurants: any[];
  }>{
    const userObjectId = new Types.ObjectId(userId);

    const user = await this.userModel.findById(userObjectId).lean();
    if (!user)
      throw new NotFoundException(`User not found: ${userId}`);

    const results = await this.userModel.aggregate([
      { $match: { _id: userObjectId } },
      {
        $lookup:{
          from: 'users',
          let: { cuisines: '$favoriteCuisines' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $ne: ['$_id', userObjectId] },
                    {
                      $gt: [
                        { $size: { $setIntersection: ['$$cuisines', '$favoriteCuisines'] } },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                fullName: 1,
                favoriteCuisines: 1,}
            },
          ],
          as: 'similarUsers',
        },
      },
      {
        $lookup: {
          from: 'follows',
          localField: 'similarUsers._id',
          foreignField: 'userId',
          as: 'followedByOthers',
        },
      },
      {
        $lookup: {
          from: 'restaurants',
          localField: 'followedByOthers.restaurantId',
          foreignField: '_id',
          as: 'recommendedRestaurants',
        },
      },
      {
        $project: {
          _id: 0,
          similarUsers: 1,
          recommendedRestaurants: 1,
        },
      },
    ]);

  return results[0] ?? {
    similarUsers: [],
    recommendedRestaurants: [],
  };
}
}