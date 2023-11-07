import { Test, TestingModule } from '@nestjs/testing';
import { CatResolver } from './cat.resolver';
import { CatService } from './cat.service';

describe('CatResolver', () => {
  let resolver: CatResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatResolver, CatService],
    }).compile();

    resolver = module.get<CatResolver>(CatResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
