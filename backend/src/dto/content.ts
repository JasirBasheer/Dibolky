import { IFiles, IMetadata, IPlatforms } from "@/types";

export interface SaveContentDto{
    orgId: string,
    platform: string,
    platforms: IPlatforms[],
    user_id: string,
    files: IFiles[],
    metadata: IMetadata,
    contentType: string
}