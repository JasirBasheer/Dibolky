import { IReviewBucket } from "../../shared/types/agency.types";

export interface IContentRepositroy {
    saveContent(details: Partial<IReviewBucket>): Promise<IReviewBucket | null>
    getContentById(orgId:string,contentId: string): Promise<IReviewBucket | null>
    changeContentStatus(orgId:string,contentId: string, status: string): Promise<IReviewBucket | null> 
}