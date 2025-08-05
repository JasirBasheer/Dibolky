import { IProject } from "@/models";
import { IBucket, IBucketWithReason, MappedProjectType } from "@/types";


export class CommonMapper {
  static ProjectDetails(details: {
    projects: IProject[];
    totalCount: number;
    totalPages: number;
  }): { projects: MappedProjectType[]; totalCount: number; totalPages: number } {
    return {
      projects: details.projects.map((project: IProject): MappedProjectType => {
        return {
          id: project._id.toString(),
          name: project.service_name,
          category: project.category,
          client: project.client,
          status: project.status,
          deadline: new Date(project.dead_line).toLocaleDateString(),
          serviceDetails: project.service_details,
        };
      }) as MappedProjectType[],
      totalCount: details.totalCount,
      totalPages: details.totalPages,
    };
  }

  static ContentDetails(details:{
    contents: IBucket[];
    totalCount: number;
    totalPages: number;
  }){
    return {
      contents: details.contents.map((content: IBucket): IBucketWithReason => {
        return {
           _id: content._id.toString(),
          user_id: content.user_id.toString(),
          orgId: content.orgId,
          files: content.files,
          status: content.status,
          metaAccountId: content.status,
          platforms: content.platforms,
          title: content.title,
          contentType: content.contentType,
          caption: content.caption,
          tags: content.tags,
          isPublished: content.isPublished,
          reason: content.reason,
          createdAt: content.createdAt.toString(),
        };
      }) as IBucketWithReason[],
      totalCount: details.totalCount,
      totalPages: details.totalPages,
    };
  }

  
}
