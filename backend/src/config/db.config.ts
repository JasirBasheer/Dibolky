import mongoose, { Connection } from 'mongoose';

interface TenantConnections {
    [key: string]: Connection;
}

const tenantConnections: TenantConnections = {};

export const connectTenantDB = async (tenantId: string): Promise<Connection> => {
    if (tenantConnections[tenantId]) {
        return tenantConnections[tenantId];
    }

    const connection = mongoose.createConnection(`mongodb+srv://jasirbinbasheerpp:M7pVC9N7f9QzKkFE@cluster0.uuyi8.mongodb.net/${tenantId}?retryWrites=true&w=majority`)
    connection.on('connected', () => {
        // console.log(`Connected to tenant database (${tenantId}) successfully.`);
    });
    tenantConnections[tenantId] = connection;
    return connection;
}

export const getTenantConnection = (tenantId: string): Connection | undefined => {
    return tenantConnections[tenantId];
}