import * as jose from "jose";
import {
  GetKeyFunction,
  JWSHeaderParameters,
  FlattenedJWSInput,
} from "jose/dist/types/types";
import { JwtError } from "../../errors/JwtError";
import { AuthContext, AccessJwt } from "./models/auth-context";
import { SpecificEntity } from "../../abstracts/specific-entity";
import { Entity } from "../../abstracts/generic-entity";
import { NblocksPublicClient } from "../nblocks-public-client";

export class AuthContextHelper extends Entity {
  private readonly _debug: boolean;
  private readonly _expectedIssuer: string;
  private readonly _expectedAudience: string;
  
  private readonly BASE_URLS = {
    PROD: "https://auth.nblocks.cloud",
    STAGE: "https://auth-stage.nblocks.cloud",
    DEV: "http://auth-api:3000",
  };

  private readonly PUBLIC_BASE_URLS = {
    PROD: "https://auth.nblocks.cloud",
    STAGE: "https://auth-stage.nblocks.cloud",
    DEV: "http://localhost:3070",
  };

  private readonly ISSUERS = {
    PROD: "https://auth.nblocks.cloud",
    STAGE: "https://auth-stage.nblocks.cloud",
    DEV: "http://localhost:3070",
  };
  private readonly JWKS_PATH = "/.well-known/jwks.json"

  private _jwksClient: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;

  constructor(parentEntity: SpecificEntity, debug?: boolean) {
    super(parentEntity, debug)
    this._debug = debug;
    this._expectedIssuer = this._getIssuer();
    this._expectedAudience = this._getAudience();
    this._jwksClient = jose.createRemoteJWKSet(
      new URL(`${this._getBaseUrl()}${this.JWKS_PATH}`),
      {}
    );

    this._log(`${this._getBaseUrl()}${this.JWKS_PATH}`);
    this._log(`expectedIssuer: ${this._expectedIssuer}, expectedAudience: ${this._expectedAudience},`);
  }

  async getAuthContextVerified(accessToken: string): Promise<AuthContext> {
    try {
      const { payload, key, protectedHeader } = await jose.jwtVerify(
        accessToken,
        this._jwksClient,
        {
          issuer: this._expectedIssuer,
          audience: this._expectedAudience
        }
      );

      const { aid, plan, role, tid, sub, scope } = payload as AccessJwt;
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

  async hasRolesOrPrivileges(authContext: AuthContext, args: {roles?: string[], privileges?: string[]}) {
    const {roles, privileges} = args;
    return roles ? roles.includes(authContext.userRole) : false || privileges ? privileges.some(scope => authContext.privileges.includes(scope)) : false;
  }

  async getProfile(openIdJwt: string): Promise<void> {
    //TODO implement me
  }

  /**
   * Gets the base url by fetching current stage from Platform
   * @returns
   */
  private _getBaseUrl(): string {
    if (this.parentEntity instanceof NblocksPublicClient)
      return process.env.NBLOCKS_AUTH_API_URL || this.PUBLIC_BASE_URLS[this.getPlatformClient().stage];
    else 
      return process.env.NBLOCKS_AUTH_API_URL || this.BASE_URLS[this.getPlatformClient().stage];
  }

  private _getIssuer(): string {
    return process.env.NBLOCKS_AUTH_ISSUER || this.ISSUERS[this.getPlatformClient().stage];
  }

  private _getAudience(): string {
    return process.env.NBLOCKS_AUTH_AUDIENCE || this.getPlatformClient().id;
  }
}
