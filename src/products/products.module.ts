import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),
  MulterModule.register({
    storage: diskStorage({
      destination: './uploads', // Rasmlar shu yerga saqlanadi
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname)); // Foydalanuvchining rasm nomini generatsiya qilish
      },
    }),
  }),
],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
