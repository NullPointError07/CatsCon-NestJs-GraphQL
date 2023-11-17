import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
import { Schema as MongooseSchema } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guards';
import { CurrentUser } from 'src/auth/dto/current-user';
// import { UpdateCatInput } from './dto/update-cat.input';

@Resolver(() => Cat)
export class CatResolver {
  constructor(private readonly catService: CatService) {}

  @Mutation(() => Cat)
  @UseGuards(JwtAuthGuard)
  createCat(
    @Args('createCatInput') createCatInput: CreateCatInput,
    @CurrentUser() user: any,
  ): Promise<Cat> {
    console.log('what is user', user);

    return this.catService.createCat(createCatInput, user._id);
  }

  @Query(() => [Cat], { name: 'cat' })
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

  // @Mutation(() => Cat)
  // updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput) {
  //   return this.catService.update(updateCatInput.id, updateCatInput);
  // }

  @Mutation(() => Cat)
  removeCat(@Args('id', { type: () => Int }) id: number) {
    return this.catService.remove(id);
  }
}
