export interface IClientRepository {
  findClientWithMail(email: string): Promise<any>;
  findClientWithId(id:string): Promise<any>;
  getClientDetailsByMail(tenantDb:any,email:string):Promise<any>;
  getOwnerDetails(tenantDb:any):Promise<any>;
  setSocialMediaTokens(id:string,provider:string,token:string,db:any):Promise<any>;    
  getContentById(contentId:string,db:any):Promise<any>;
  changeContentStatusById(contentId:string,db:any,status:string):Promise<any>;
  getReviewBucketById(clientId:string,db:any):Promise<any>;
  setSocialMediaUserNames(id: string, provider: string, username: string, db: any): Promise<any>;
  getClientInMainDb(email:string):Promise<any>
  }
  