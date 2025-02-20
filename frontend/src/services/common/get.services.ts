import api from "@/utils/axios";

export const getOwnerId = () => {
    return api.get('/api/entities/owner')
}

export const getAllProjects = (pages: number, page: number) => {
    return api.get('/api/entities/projects')
}

export const addSubtaskApi = (clientId: string, projectId: string, taskDetails: any) => {
    return api.post('/api/entities/create-task', { clientId, projectId, taskDetails })
}


export const getAllEmployeeApi = () => {
    return api.get('/api/entities/get-employees')
}

export const updateProjectStatus = () => {
    return api.get('/api/entities/get-employees')
}



export const getAllProjectTasksApi = (projectId:string) => {
    return api.get(`/api/entities/tasks?projectId=${projectId}`)
}