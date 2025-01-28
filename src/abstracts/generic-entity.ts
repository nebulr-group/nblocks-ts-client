import { AxiosInstance } from "axios";
import { NblocksClient } from "../core-api/nblocks-client";
import { NblocksPublicClient } from "../core-api/nblocks-public-client";

/**
 * This client is generic and non specific to a certain entity id.   
 * Only generic calls without id context like `create()`, `list()` etc are available.   
 * See the non generic counterpart client for context calls like `update()`, `delete()` if you want to operate on a specific instance.   
 */
export abstract class Entity {
    
    /** Reference to the parent entity */
    protected readonly parentEntity: Entity;

    /** If true, debug data should be output to console */
    protected debug: boolean;

    constructor(parentEntity: Entity, debug = false) {
        this.parentEntity = parentEntity;
        this.debug = debug;
    }

    /**
     * Returns a reference to the top most client containing configs that might be useful for child clients
     * @returns 
     */
    getPlatformClient(): NblocksClient | NblocksPublicClient {
        return this.parentEntity.getPlatformClient();
    }

    /** Returns a reference to the central Http Client propagated from the parent entity clients */
    getHttpClient(): AxiosInstance {
        return this.parentEntity.getHttpClient();
    }

    /** Returns a reference from the parent entity clients, propagated from other entities.   
     * **This method should be overridden if the current entity demands another header composition** */
    getHeaders(): Record<string, string> {
        return this.parentEntity.getHeaders();
    }

    protected _log(message: string): void {
        if (this.debug)
          console.log(message);
      }
}