import { FederationConnectionResponse, FederationConnectionType, RequestMethod, SignedRequestAlgorithm } from "./federation-connection-response";

export class CreateFederationConnectionRequest
    implements Pick<FederationConnectionResponse, 'type' | 'name' | 'clientId' | 'loginUrl' | 'certificate' | 'requestMethod' | 'signedRequest' | 'signedRequestAlgorithm' | 'signedRequestPrivateKey'>
{

    type: FederationConnectionType;


    name: string;


    clientId?: string;

    
    loginUrl: string;


    certificate: string;


    requestMethod: RequestMethod;


    signedRequest: boolean;


    signedRequestAlgorithm?: SignedRequestAlgorithm;


    signedRequestPrivateKey?: string;
}
