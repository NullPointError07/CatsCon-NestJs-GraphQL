import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Schema as MongooseSchema } from 'mongoose';
import { UseGuards, UsePipes } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { CurrentUser } from 'src/auth/dto/current-user';
import { FileValidationPipe } from 'src/pipes/file-validation.pipe';
import { UpdateCatInput } from './dto/update-cat.input';

@Resolver(() => Cat)
export class CatResolver {
  constructor(private readonly catService: CatService) {}

  @Mutation(() => Cat)
  @UseGuards(JwtAuthGuard)
  @UsePipes(new FileValidationPipe(['mp4'], 10 * 1024 * 1024, 'catVideo'))
  createCat(
    @Args('createCatInput') createCatInput: CreateCatInput,
    @CurrentUser() user: any,
  ): Promise<Cat> {
    return this.catService.createCat(createCatInput, user._id);
  }

  @Query(() => [Cat], { name: 'catsAll' })
  findAll() {
    return this.catService.findAll();
  }

  @Query(() => Cat, { name: 'findCatById' })
  findCatById(
    @Args('catId', { type: () => String })
    id: MongooseSchema.Types.ObjectId,
  ) {
    return this.catService.findCatById(id);
  }

  @Mutation(() => Cat, { name: 'updateCatFromCatDoc' })
  updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput) {
    return this.catService.updateCat(updateCatInput._id, updateCatInput);
  }

  @Mutation(() => Cat, { name: 'deleteCatFromCatDoc' })
  async deleteCat(
    @Args('userId', { type: () => String }) id: MongooseSchema.Types.ObjectId,
  ): Promise<Cat> {
    return await this.catService.deleteCat(id);
  }
}
