import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './\buser.repository';
import { User } from './user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    exports: [UserRepository]
})
export class UserModule {}
