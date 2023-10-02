import { Entity } from "./generic-entity";

/**
 * This entity client is specific to a certain entity id.    
 * Every operation made here operates on this specific instance.   
 * See the generic counterpart client for non context calls like `create()`, `list()` etc.
 */
export abstract class SpecificEntity extends Entity {

    /** Id reference to the specific entity instance */
    readonly id: string;

    constructor(id:string, parentEntity: Entity, debug = false) {
        super(parentEntity, debug);
        this.id = id;
        if (!this.id) {
            throw new Error("SpecificEntity expects an id");
        }
    }
}