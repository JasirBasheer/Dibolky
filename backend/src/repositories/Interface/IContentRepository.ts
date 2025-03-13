import { IReviewBucket } from "../../types/common.types"

export interface IContentRepository {
    saveContent(details: Partial<IReviewBucket>): Promise<IReviewBucket>
    getContentById(orgId: string, contentId: string): Promise<IReviewBucket | null>
    getContentsByUserId(orgId: string, user_id: string): Promise<IReviewBucket[] | null>
    changeContentStatus(orgId: string, contentId: string, status: string): Promise<IReviewBucket | null>
    getAllScheduledContents(orgId: string, user_id: string): Promise<IReviewBucket[]>
    reScheduleContent(orgId:string,content_id:string,date:string):Promise<IReviewBucket>
}