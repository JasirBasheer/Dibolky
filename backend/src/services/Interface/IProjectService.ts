import { MappedProjectType } from "@/types";
import { FilterType } from "@/utils";

export interface IProjectService {
  fetchAllProjects( orgId: string, userId: string, role: string, query: FilterType ): Promise<{ projects: MappedProjectType[]; totalPages: number } | null>;
  markProjectAsCompleted(orgId: string, projectId: string): Promise<void>;
}
