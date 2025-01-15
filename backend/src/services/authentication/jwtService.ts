import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import { CustomError } from '../../utils/CustomError';


class JwtService {

async generateResetToken(id: string) {
    const secretKey = process.env.JWT_RESET_PASSWORD_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    const resetToken = jwt.sign({ id: id }, secretKey, { expiresIn: '1h' });
    return resetToken;
}


async verifyResetToken(token: string) {
    const secretKey = process.env.JWT_RESET_PASSWORD_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        return decoded
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return "Expired";
        }
        return null;
    }
}


async decodeAccessToken(token: string): Promise<JwtPayload> {
    try {
        const secretKey = process.env.JWT_ACCESS_SECRET;
        if (!secretKey) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }

        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        return decoded as jwt.JwtPayload;

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log('Access token has expired.');
            throw new CustomError('token has expired', 401);

        } 
        throw new CustomError('Invalid Token',401)

    }
}



async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
        const secretKey = process.env.JWT_REFRESH_SECRET;
        if (!secretKey) {
            throw new Error('JWT_SECRET is not defined in the environment variables');
        }
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        return decoded as jwt.JwtPayload;

    } catch (error) {
        throw new CustomError('Invalid Token',401)

    }
}


async generateAccesstokenWithRefreshToken(email:string,role:string):Promise<any>{
        try {
            const payload = {email:email,role}
            return jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '2m' })            
        } catch (error) {
            console.error(error);
            return null  
        }
    }



   async createTokens(email:string,role:string):Promise<any>{
        try {
            const payload = {email,role}
            console.log(payload);
            
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: '2m' })
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });                      
            return {accessToken,refreshToken}
        } catch (error) {
            return new Error('Unexpected error occured please try again')
        }
    }

}

export default JwtService