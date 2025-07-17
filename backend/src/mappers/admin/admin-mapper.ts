import { IAdmin } from "@/models/Interface/admin";


export class AdminMapper {
  static AdminDetails(details:IAdmin) {
    return {
      _id: details._id as string,
      name: details.name as string,
      email: details.email as string,
    };
  }
}
