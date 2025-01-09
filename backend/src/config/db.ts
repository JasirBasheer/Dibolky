import mongoose from 'mongoose';

export default async () =>{
    mongoose.connect('mongodb+srv://jasirbinbasheerpp:YgPIPzfYiPG3cqr1@cluster0.uuyi8.mongodb.net/MainDB?retryWrites=true&w=majority')
    .then(()=> console.log('Database connected successfully'))
    .catch((err) => console.log(err))
}

export const connectTenantDB = async (tenantId:string) =>{
    const connectCompanyDB = mongoose.createConnection(`mongodb+srv://jasirbinbasheerpp:YgPIPzfYiPG3cqr1@cluster0.uuyi8.mongodb.net/${tenantId}?retryWrites=true&w=majority`)
    connectCompanyDB.on('connected', () => {
        console.log(`Connected to tenant database (${tenantId}) successfully.`);
    });
    return connectCompanyDB         
}

