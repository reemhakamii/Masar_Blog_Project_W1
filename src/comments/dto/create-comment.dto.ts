import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsUUID()
  userId: string;

  @IsUUID()
  articleId: string;
}