export class FederationConnectionResponse {
  id: string;
  type: FederationConnectionType;
  name: string;
  clientId?: string;
  loginUrl: string;
  certificate: string;
  requestMethod: RequestMethod;
  signedRequest: boolean;
  signedRequestAlgorithm?: SignedRequestAlgorithm;
  signedRequestPrivateKey?: string;

  createdAt: Date;
}

export type RequestMethod = 'GET' | 'POST';
export type FederationConnectionType = 'saml' | 'oidc';
export type SignedRequestAlgorithm = 'sha256' | 'sha512';
