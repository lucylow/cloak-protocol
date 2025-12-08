/**
 * Psy Protocol Core Types
 * These mirror Psy's upcoming SDK structure
 */
export interface PsySDKey {
  publicKey: Uint8Array;
  encryptedPrivateKey?: Uint8Array;
  metadata: {
    creationTime: number;
    lastUsed: number;
    credentialProofs: ZKCredentialProof[];
  };
}

export interface ZKProof {
  proof: Uint8Array;
  publicInputs: string[];
  circuitId: 'balance-check' | 'trade-validity' | 'credential-proof';
  timestamp: number;
}

export interface ZKCredentialProof {
  credentialType: 'accredited-investor' | 'kyc-level1' | 'jurisdiction-proof';
  issuer: string;
  expiration: number;
  proof: ZKProof;
}

export interface PrivateBalance {
  assetId: string;
  commitment: string;
  revealedAmount?: string;
  assetMetadata: {
    name: string;
    symbol: string;
    isRWA: boolean;
    complianceRequired: boolean;
  };
}

export interface PrivateTrade {
  id: string;
  inputAsset: string;
  outputAsset: string;
  inputAmountCommitment: string;
  outputAmountCommitment: string;
  status: 'pending' | 'settled' | 'failed';
  batchId?: string;
  timestamp: number;
}

export interface TradeStep {
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed';
}
