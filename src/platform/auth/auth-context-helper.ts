import * as jose from "jose";
import {
  GetKeyFunction,
  JWSHeaderParameters,
  FlattenedJWSInput,
} from "jose/dist/types/types";
import { JwtError } from "../../errors/JwtError";
import { Stage } from "../nblocks-client";
import { AuthContext, AuthJwt } from "./models/auth-context";
import { SpecificEntity } from "../../abstracts/specific-entity";

export class AuthContextHelper {
  private readonly _debug: boolean;
  private readonly _expectedIssuer: string;
  private readonly _expectedAudience: string;
  private readonly BASE_URLS = {
    PROD: "https://auth.nblocks.cloud",
    STAGE: "https://auth-stage.nblocks.cloud",
    DEV: "http://auth-api:3000",
  };
  private readonly ISSUERS = {
    PROD: "https://auth.nblocks.cloud",
    STAGE: "https://auth-stage.nblocks.cloud",
    DEV: "http://localhost:3070",
  };
  private readonly JWKS_PATH = "/.well-known/jwks.json"

  private _jwksClient: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

  constructor(client: SpecificEntity, stage: Stage, debug?: boolean) {
    this._debug = debug;
    this._expectedIssuer = this._getIssuer(stage);
    this._expectedAudience = this._getAudience(client);
    this._jwksClient = jose.createRemoteJWKSet(
      new URL(`${this._getBaseUrl(stage)}${this.JWKS_PATH}`),
      {}
    );

    this._log(`${this._getBaseUrl(stage)}${this.JWKS_PATH}`);
    this._log(`expectedIssuer: ${this._expectedIssuer}, expectedAudience: ${this._expectedAudience},`);
  }

  private _log(message: string): void {
    if (this._debug)
      console.log(message);
  }

  async getAuthContext(authJwt: string): Promise<AuthContext> {
    try {
      const { payload, key, protectedHeader } = await jose.jwtVerify(
        authJwt,
        this._jwksClient,
        {
          issuer: this._expectedIssuer,
          audience: this._expectedAudience
        }
      );

      const { aid, plan, role, tid, sub, scope } = payload as AuthJwt;
      return {
        appId: aid,
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

  async getProfile(openIdJwt: string): Promise<void> {
    //TODO implement me
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns
   */
  private _getBaseUrl(stage: Stage): string {
    return process.env.NBLOCKS_AUTH_URL || this.BASE_URLS[stage];
  }

  private _getIssuer(stage: Stage): string {
    return process.env.NBLOCKS_AUTH_ISSUER || this.ISSUERS[stage];
  }

  private _getAudience(client: SpecificEntity): string {
    return process.env.NBLOCKS_AUTH_AUDIENCE || client.id;
  }
}
