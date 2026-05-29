import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query(() => String)
  hello() {
    return 'GraphQL is working!';
  }
  
  @Query(() => String)
  status() {
    return 'backend is running';
  }
}