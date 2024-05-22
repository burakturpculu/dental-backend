import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Req,
  UseGuards,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PredictionService } from './prediction.service';
import {
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { extname } from 'path';
import * as fs from 'fs';

@ApiTags('prediction')
@ApiBearerAuth('access-token')
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(16)
            .fill(null)
            .map(() => (Math.random() * 16).toString(36))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiOperation({ summary: 'Predict dental condition from image' })
  @ApiResponse({ status: 200, description: 'Return prediction results.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async predict(@UploadedFile() file: Express.Multer.File, @Req() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    try {
      const userId = req.user.id;
      const filePath = file.path;
      const imageBuffer = fs.readFileSync(filePath);
      const result = await this.predictionService.predict(imageBuffer);
      const createPredictionDto: CreatePredictionDto = {
        userId: userId,
        predictionResult: result,
        filePath: filePath,
      };
      await this.predictionService.savePrediction(createPredictionDto);
      return result;
    } catch (error) {
      console.error('Error during prediction:', error);
      throw new InternalServerErrorException(
        `Prediction failed: ${error.message}`,
      );
    }
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get predictions by user ID' })
  @ApiResponse({ status: 200, description: 'Return prediction results.' })
  async getPredictions(@Param('userId') userId: string): Promise<any> {
    const predictions =
      await this.predictionService.getPredictionsByUserId(userId);
    return predictions;
  }
}
