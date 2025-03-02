import { IReviewBucket } from "../../shared/types/common.types"

export interface IContentRepository {
    saveContent(details: Partial<IReviewBucket>): Promise<IReviewBucket>
    getContentById(orgId:string,contentId: string): Promise<IReviewBucket | null>
    getContentsByUserId(orgId:string,user_id: string): Promise<IReviewBucket[] | null>
    changeContentStatus(orgId:string,contentId: string, status: string): Promise<IReviewBucket | null> 
}