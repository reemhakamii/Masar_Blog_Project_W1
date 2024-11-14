import { Transform } from 'class-transformer';

export class PaginationDto {
  @Transform(({ value }) => Number(value))
  page: number;

  @Transform(({ value }) => Number(value))
  limit: number;

  searchTerm?: string;
}