import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { CustomValidation } from '../validation/customValidation';

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

export class QueryUserDTO {
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
  searchLoginTerm: string;

  @IsOptional()
  @IsString()
  searchEmailTerm: string;

  @IsOptional()
  @Validate(CustomValidation, { message: 'pageNumber is too short!' })
  pageSize: string;
}
