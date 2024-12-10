import { UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
 
 export type userPaylaod = {
     emaiL:string ,
     id:string 
     phone_number:string
     iat:number 
     exp:number
 }
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'mqtt-listener'
        });
    }

    async validate(payload: userPaylaod) {
         const { iat, exp, ...filteredPayload } = payload;

         if (!filteredPayload) {
            throw new UnauthorizedException("Invalid token payload.");
        }

        return filteredPayload;
    }
}