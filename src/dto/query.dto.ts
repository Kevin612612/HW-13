import { IsEnum, IsNumberString, IsString, Min, isString } from "class-validator";
enum SortDirectionEnum {'asc', 'desc'}

export class QueryDTO {
  @IsString()
  sortBy: string;

  @IsEnum(SortDirectionEnum)
  sortDirection: string;

  @IsNumberString()
  @Min(1)
  pageNumber: string;

  @IsString()
  searchNameTerm: string;

  @Min(1)
  pageSize: string;
}

