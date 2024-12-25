import { IsString, Matches } from "class-validator";

export class GetPresignedUrlDto {
  @IsString()
  @Matches(/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]{2,5}$/, { message: 'Filename must be formatted as <filename>.<extension>' })
  fileName: string;
  
  @IsString()
  contentType: string;
}