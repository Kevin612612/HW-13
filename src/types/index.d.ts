import { BlogDataType } from "./blog"
import { UserDataType } from "./users"


//expanding type Request
declare global {
    declare namespace Express {
        export interface Request {
            user: UserDataType | undefined,
            blog: BlogDataType | undefined,
            post: PostDataType | undefined,
            useragent: string | string[] | undefined,
            device: any,
            bot: any,
            resultClient: any,
            resultOs: any,
            result: any,
        }
    }
}


//APIErrorResult
export type errors = { errorsMessages: fieldError[] }
type fieldError = { message: string, field: string }