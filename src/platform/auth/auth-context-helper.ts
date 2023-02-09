import * as jose from "jose";
import {
  GetKeyFunction,
  JWSHeaderParameters,
  FlattenedJWSInput,
} from "jose/dist/types/types";
import { JwtError } from "../../errors/JwtError";
import { Stage } from "../platform-client";
import { AuthContext, AuthJwt } from "./models/auth-context";

export class AuthContextHelper {
  private readonly _debug: boolean;
  private readonly _expectedIssuers = ["auth.nblocks.cloud"];
  private readonly BASE_URLS = {
    PROD: "https://auth.nblocks.cloud/.well-known/jwks.json",
    STAGE: "https://auth-stage.nblocks.cloud/.well-known/jwks.json",
    DEV: "http://auth-api:3000/.well-known/jwks.json",
  };

  private _jwksClient: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

  constructor(stage: Stage, debug?: boolean) {
    this._debug = debug;
    this._jwksClient = jose.createRemoteJWKSet(
      new URL(this._getBaseUrl(stage)),
      {}
    );
  }

  async getAuthContext(authJwt: string): Promise<AuthContext> {
    try {
      const { payload, key, protectedHeader } = await jose.jwtVerify(
        authJwt,
        this._jwksClient,
        {
          issuer: this._expectedIssuers,
        }
      );

      const { plan, role, tid, sub, scope } = payload as AuthJwt;
      return {
        tenantPlan: plan,
        tenantId: tid,
        userRole: role,
        userId: sub,
        privileges: scope.split(" "),
      };
    } catch (error) {
      if (this._debug) {
        console.error(error);
      }
      throw new JwtError();
    }
  }

  getAuthContextNonStrict(authJwt: string): AuthContext {
    let jwtData: jose.JWTPayload;

    jwtData = jose.decodeJwt(authJwt);

    const { plan, role, tid, sub, scope } = jwtData as AuthJwt;
    return {
      tenantPlan: plan,
      tenantId: tid,
      userRole: role,
      userId: sub,
      privileges: scope.split(" "),
    };
  }

  async getProfile(openIdJwt: string): Promise<void> {
    //TODO implement me
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns
   */
  private _getBaseUrl(stage: Stage): string {
    return process.env.NBLOCKS_JWKS_URL || this.BASE_URLS[stage];
  }
}
