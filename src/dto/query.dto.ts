import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { CustomValidation } from '../validation/customValidation';

enum SortDirectionEnum {
	'asc',
	'desc',
}

enum SortBanEnum {
	'all',
	'banned',
	'notBanned',
}

export class BaseQueryDTO {
	@IsOptional()
	@IsString()
	sortBy: string;

	@IsOptional()
	@IsEnum(SortDirectionEnum)
	sortDirection: string;

	@IsOptional()
	@Validate(CustomValidation, { message: 'pageNumber has to be more than one!' })
	pageNumber: string;

	@IsOptional()
	@Validate(CustomValidation, { message: 'pageSize has to be more than one!' })
	pageSize: string;
}

export class QueryDTO extends BaseQueryDTO {
	@IsOptional()
	@IsString()
	searchNameTerm: string;
}

export class QueryUserDTO extends BaseQueryDTO {
	@IsOptional()
	@IsString()
	searchLoginTerm: string;

	@IsOptional()
	@IsString()
	searchEmailTerm: string;

	@IsOptional()
	@IsEnum(SortBanEnum)
	banStatus: any;
}
