import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PredictionService } from './prediction.service';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('prediction')
@ApiBearerAuth('access-token')
@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + extname(file.originalname);
        cb(null, `${uniqueSuffix}`);
      },
    }),
  }))
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
  async predict(@UploadedFile() file: Express.Multer.File, @Req() req): Promise<any> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.id;
    console.log('userId', userId);
    const imageBuffer = file.buffer;
    console.log('imageBuffer', imageBuffer);

    const result = await this.predictionService.predict(imageBuffer);

    await this.predictionService.savePrediction(userId, result, imageBuffer);

    return result;
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get predictions by user ID' })
  @ApiResponse({ status: 200, description: 'Return prediction results.' })
  async getPredictions(@Param('userId') userId: string): Promise<any> {
    const predictions = await this.predictionService.getPredictionsByUserId(userId);
    return predictions;
  }
}
