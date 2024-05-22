import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prediction } from './entities/prediction.entity';
import { UserService } from '../user/user.service';
import { CreatePredictionDto } from './dto/create-prediction.dto';
import { DomainService } from './domain/domain.service';

@Injectable()
export class PredictionService {
  private readonly pythonServiceUrl = process.env.PYTHON_SERVICE_URL;
  constructor(
    @InjectRepository(Prediction)
    private predictionRepository: Repository<Prediction>,
    private readonly userService: UserService,
    private readonly domainService: DomainService,
  ) {}

  async predict(image: Buffer): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', image, 'image.jpg');
      const response = await axios.post(
        this.pythonServiceUrl || 'http://localhost:8000/predict/',
        formData,
        {
          headers: formData.getHeaders(),
        },
      );

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Prediction failed: ${error.response?.data || error.message}`,
      );
    }
  }

  async savePrediction(data: CreatePredictionDto): Promise<Prediction> {
    return this.domainService.createRepositoryService.create(data);
  }

  async getPredictionsByUserId(userId: string): Promise<Prediction[]> {
    return this.predictionRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }
}
