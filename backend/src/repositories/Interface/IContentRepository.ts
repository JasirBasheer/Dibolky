import { IBucket } from "../../types/common.types"

export interface IContentRepository {
    saveContent(details: Partial<IBucket>): Promise<IBucket>
    getContentById(orgId: string, contentId: string): Promise<IBucket | null>
    getContentsByUserId(orgId: string, user_id: string): Promise<IBucket[] | null>
    changeContentStatus(orgId: string, contentId: string, status: string): Promise<IBucket | null>
    getAllScheduledContents(orgId: string, user_id: string): Promise<IBucket[]>
    reScheduleContent(orgId: string, content_id: string, date: string): Promise<IBucket>
}