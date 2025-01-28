export interface IClientRepository {
  findClientWithMail(email: string): Promise<any>;
  findClientWithId(id:string): Promise<any>;
  setSocialMediaTokens(id:string,provider:string,token:string,db:any):Promise<any>;    
  getContentById(contentId:string,db:any):Promise<any>;
  changeContentStatusById(contentId:string,db:any,status:string):Promise<any>;

  }
  