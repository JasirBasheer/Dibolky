import { getPages } from "./shared.service";

// export async function uploadIGStory(content: any, access_token: string, client:any): Promise<any> {
//     try {
//         const pages = await getPages(access_token);
//         let pageId;

//         if (!Array.isArray(pages.data)) {
//             console.error("Error: pages is not an array", pages);
//         } else if (!client?.socialMedia_credentials?.facebook?.userName) {
//             console.error("Error: Facebook username is missing", client?.socialMedia_credentials?.facebook);
//         } else {
//             pageId = pages.data.find((item: any) => item.name === client.socialMedia_credentials.facebook.userName)?.id;
//         }
        
//         const accountId = await fetchIGAccountId(pageId, access_token)
        
   
//         if (response) {
//             return {
//                 name: INSTAGRAM,
//                 status: 'success',
//                 id: content._id
//             }
//         }

//     } catch (error: any) {
//         throw error
//     }
// }