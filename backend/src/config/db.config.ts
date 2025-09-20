import mongoose, { Connection } from 'mongoose';
import logger from '../logger';
import { env } from './env';

interface TenantConnections {
    [key: string]: Connection;
}

const tenantConnections: TenantConnections = {};

export const connectTenantDB = async (tenantId: string): Promise<Connection> => {
    if (tenantConnections[tenantId]) {
        return tenantConnections[tenantId];
    }

    const connection = mongoose.createConnection(`mongodb+srv://${env.CONFIG.DB_USER}:${env.CONFIG.DB_PASSWORD}@cluster0.uuyi8.mongodb.net/${tenantId}?retryWrites=true&w=majority`)
    connection.on('connected', () => {
        logger.info(`Connected to tenant database (${tenantId}) successfully.`);
    });
    tenantConnections[tenantId] = connection;
    return connection;
}

export const getTenantConnection = (tenantId: string): Connection | undefined => {
    return tenantConnections[tenantId];
}