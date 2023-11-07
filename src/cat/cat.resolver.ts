import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CatService } from './cat.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
// import { UpdateCatInput } from './dto/update-cat.input';

@Resolver(() => Cat)
export class CatResolver {
  constructor(private readonly catService: CatService) {}

  @Mutation(() => Cat)
  createCat(@Args('createCatInput') createCatInput: CreateCatInput) {
    return this.catService.createCat(createCatInput);
  }

  @Query(() => [Cat], { name: 'cat' })
  findAll() {
    return this.catService.findAll();
  }

  @Query(() => Cat, { name: 'cat' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.catService.findOne(id);
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
