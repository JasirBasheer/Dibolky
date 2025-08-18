import { IBucket } from "../../types/common"

export interface IContentRepository {
    saveContent(details: Partial<IBucket>): Promise<IBucket>
    getContentById(orgId: string, contentId: string): Promise<IBucket | null>
    getContentsByUserId(orgId: string, filter?: Record<string, unknown>,
    options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }): Promise<{ contents: IBucket[]; totalCount: number; totalPages: number }>
    changeContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>
    changePlatformStatus(orgId: string, contentId: string, platform: string ,status: string): Promise<IBucket | null>
    getAllScheduledContents(orgId: string, user_id: string): Promise<IBucket[]>
    rescheduleContent(orgId: string, contentId: string,platformId:string, date: string): Promise<IBucket>
    deleteScheduledContent(orgId: string,contentId: string,platformId:string):Promise<void>
}