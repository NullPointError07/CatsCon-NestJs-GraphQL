import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CatsService } from './cats.service';
import { Cat } from './entities/cat.entity';
import { CreateCatInput } from './dto/create-cat.input';
// import { UpdateCatInput } from './dto/update-cat.input';

@Resolver(() => Cat)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Mutation(() => String, { name: 'createImage' })
  createCat(@Args('createCatInput') createCatInput: CreateCatInput) {
    console.log('cat input test', createCatInput);
    // return 'hello';
    return this.catsService.createCat(createCatInput);
  }

  @Query(() => [Cat], { name: 'cats' })
  findAll() {
    return this.catsService.findAll();
  }

  @Query(() => Cat, { name: 'cat' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.catsService.findOne(id);
  }

  // @Mutation(() => Cat)
  // updateCat(@Args('updateCatInput') updateCatInput: UpdateCatInput) {
  //   return this.catsService.update(updateCatInput.id, updateCatInput);
  // }

  @Mutation(() => Cat)
  removeCat(@Args('id', { type: () => Int }) id: number) {
    return this.catsService.remove(id);
  }
}
