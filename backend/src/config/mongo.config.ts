import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

const options = {};

export const getMongoDbConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  const uri = configService.get<string>('MONGO_URI');

  if (!uri) {
    throw new Error('MONGO_URI is not defined in the environment variables');
  }

  return {
    uri,
    ...options,
  };
};
