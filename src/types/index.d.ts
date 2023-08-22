import { UserDataType } from "./users"
import { BlogDataType } from "./blog"
import { PostDataType } from "./post"


//expanding type Request
declare global {
    namespace Express {
        export interface Request {
            user: UserDataType | undefined | null,
            blog: BlogDataType | undefined | null,
            post: PostDataType | undefined | null,
            useragent: string | string[] | undefined,
            device: any,
            bot: any,
            resultClient: any,
            resultOs: any,
            result: any,
            userId: string,
        }
    }
}


//APIErrorResult
export type errors = { errorsMessages: fieldError[] }
type fieldError = { message: string, field: string }

//Page Type Schema
export type PageTypeSchema<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};