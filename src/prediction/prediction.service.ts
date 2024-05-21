import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { FormData, File as FormDataFile } from 'formdata-node';
import { FormDataEncoder } from 'form-data-encoder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './entities/prediction.entity';
import { UserService } from '../user/user.service';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PredictionService {
  private readonly pythonServiceUrl = process.env.PYTHON_SERVICE_URL;

  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    private readonly userService: UserService,
  ) {}

  async predict(image: Buffer): Promise<any> {
    try {
      const formData = new FormData();
      formData.set('file', new FormDataFile(image, 'image.jpg'));

      const encoder = new FormDataEncoder(formData);

      const response = await axios.post(this.pythonServiceUrl, encoder, {
        headers: {
          ...encoder.headers,
        },
      });

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(`Prediction failed: ${error.response?.data || error.message}`);
    }
  }

  async savePrediction(userId: string, predictionResult: any, imageBuffer: Buffer): Promise<Prediction> {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    // Save image buffer to a file
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join(__dirname, '../../uploads', fileName);
    fs.writeFileSync(filePath, imageBuffer);

    const prediction = this.predictionRepository.create({
      user,
      caries: predictionResult.caries,
      gingivitis: predictionResult.gingivitis,
      ulcer: predictionResult.ulcer,
      filePath,
    });

    return this.predictionRepository.save(prediction);
  }

  async getPredictionsByUserId(userId: string): Promise<Prediction[]> {
    return this.predictionRepository.find({ where: { user: { id: userId } }, relations: ['user'] });
  }
}
