import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { CustomValidation } from 'src/validation/validation';
enum SortDirectionEnum {
  'asc',
  'desc',
}

export class QueryDTO {
  @IsOptional()
  @IsString()
  sortBy: string;

  @IsOptional()
  @IsEnum(SortDirectionEnum)
  sortDirection: string;

  @IsOptional()
  @Validate(CustomValidation, { message: 'pageNumber is too short!' })
  pageNumber: string;

  @IsOptional()
  @IsString()
  searchNameTerm: string;

  @IsOptional()
  @Validate(CustomValidation, { message: 'pageNumber is too short!' })
  pageSize: string;
}
