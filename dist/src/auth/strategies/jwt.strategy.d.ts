import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        user_id: string;
        email: string;
        google_id: string | null;
        password_reset_token: string | null;
        password: string | null;
        name: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        picture: string | null;
        password_reset_expires: Date | null;
        created_at: Date;
        updated_at: Date;
    } | null>;
}
export {};
