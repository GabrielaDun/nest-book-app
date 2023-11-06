import {
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBookDTO {
  @IsNotEmpty()
  @Length(5, 55)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    return parseInt(value, 10);
  })
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  authorId: string;
}
