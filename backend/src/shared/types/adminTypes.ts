export interface IAdmin {
    _id?: mongoose.Types.ObjectId
    name: string;
    email: string;
    password: string;
}
