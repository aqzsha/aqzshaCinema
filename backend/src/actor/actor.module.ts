import { Module } from '@nestjs/common';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ActorSchema } from './actor.schema';

@Module({
  controllers: [ActorController],
  providers: [ActorService],
  imports: [
    MongooseModule.forFeature([{ name: 'Actor', schema: ActorSchema }]),
  ],
})
export class ActorModule {}
