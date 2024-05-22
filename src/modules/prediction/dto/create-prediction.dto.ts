import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreatePredictionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsObject()
  @IsNotEmpty()
  predictionResult: {
    caries: number;
    gingivitis: number;
    ulcer: number;
  };

  @IsString()
  @IsNotEmpty()
  filePath: string;
}
