import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class AuthService {
    static encryptPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static checkVerifyEmailToken(token: string): boolean {
        const verification = jwt.verify(token, process.env.VERIFY_EMAIL_TOKEN_SECRET as string);
        const { email } = jwt.decode(token) as any;
        return verification && email;
    }

    static checkPasswordRecoveryToken(token: string, oriEmail: string): boolean {
        const verification = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        const { email } = jwt.decode(token) as any;
        return !!verification && email === oriEmail;
    }

    static getRecoveryToken(email: string): string {
        const payload = {
            passwordRecoveryEmail: email,
        };
        return jwt.sign(payload, process.env.RECOVERY_TOKEN_SECRET as string, { expiresIn: '20m' });
    }

    static checkRecoveryToken(token: string): boolean {
        const verification = jwt.verify(token, process.env.RECOVERY_TOKEN_SECRET as string);
        const { email } = jwt.decode(token) as any;
        return verification && email;
    }

    static getVerifyEmailToken(email: string): string {
        const payload = {
            email,
        };
        return jwt.sign(payload, process.env.VERIFY_EMAIL_TOKEN_SECRET as string, { expiresIn: '20m' });
    }

    static signToken(payload: any, type: 'refresh_token' | 'access_token'): string {
        switch (type) {
            case 'access_token':
                return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: '7d' });

            case 'refresh_token':
                return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string);

            default:
                return '';
        }
    }

    static passwordMatch(passwordHash: string, password: string): Promise<boolean> {
        return bcrypt.compare(password, passwordHash);
    }

    static verifyToken(token: string, type: 'refresh_token' | 'access_token'): any {
        switch (type) {
            case 'refresh_token':
                return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || '');

            case 'access_token':
                return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || '');

            default:
                return '';
        }
    }

    static decode(token: string): any {
        return jwt.decode(token);
    }
}
