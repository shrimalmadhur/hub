import { ethers } from 'ethers';

/**
 * Message is a generic type that represents any cryptographically signed Message on Farcaster
 *
 * @data - the data that is being signed.
 * @hash - the blake2b hash of the message.
 * @hashType - the type of hash algorithm used to calculate the hash
 * @signature - the ecdsa signature of the hash of the message
 * @signatureType - the type of signing algorithm used to sign the message
 * @signer - the ethereum address whose private key was used to create the signature
 */
export type Message<T = Body> = {
  data: Data<T>;
  hash: string;
  hashType: HashAlgorithm;
  signature: string;
  signatureType: SignatureAlgorithm;
  signer: string;
};

/**
 * Data is a generic type that holds the part of the message that is going to be signed
 *
 * @body - the body of the message which is implemented by the specific type
 * @signedAt - the utc unix timestamp at which the message was signed
 * @fid - the Farcaster ID owned by the signer at the time of signature
 */
export type Data<T = Body> = {
  body: T;
  signedAt: number;
  fid: number;
};

export type Body =
  | CastBody
  | ReactionBody
  | VerificationAddBody
  | VerificationRemoveBody
  | SignerAddBody
  | SignerRemoveBody
  | FollowBody;

// ===========================
//  Cast Types
// ===========================

/** A Cast Message */
export type Cast = Message<CastBody>;

/**A CastShort is a short-text public cast from a user */
export type CastShort = Message<CastShortBody>;

/** A CastReact is a share of an existing cast-short from any user */
export type CastRecast = Message<CastRecastBody>;

/** A CastRemove is a remove of an existing cast from the same user */
export type CastRemove = Message<CastRemoveBody>;

export type CastBody = CastShortBody | CastRemoveBody | CastRecastBody;

/**
 * Body of a CastShort Message
 *
 * @text - the text of the Cast
 * @embed -
 * @schema -
 * @targetUri - the object that this Cast is replying to
 */
export type CastShortBody = {
  embed: Embed;
  schema: 'farcaster.xyz/schemas/v1/cast-short';
  targetUri?: URI;
  text: string;
};

type Embed = {
  items: URI[];
};

/**
 * A CastRemoveBody indicates that a previous Cast should be removed from the feed
 *
 * @targetHash - the hash of the cast that is being removed
 */
export type CastRemoveBody = {
  // TODO: is there any benefit to making this a URI, like a recast?
  targetHash: string;
  schema: 'farcaster.xyz/schemas/v1/cast-remove';
};

/**
 * A CastRecastBody indicates that a Cast should be re-displayed in the user's feed
 *
 * @targetCastUri - the cast that is to be recast
 */
export type CastRecastBody = {
  targetCastUri: FarcasterURI;
  schema: 'farcaster.xyz/schemas/v1/cast-recast';
};

//  ===========================
//  Reaction Types
//  ===========================

/** A Reaction Message */
export type Reaction = Message<ReactionBody>;

/**
 * A ReactionBody represents the addition or removal of a reaction on an Object
 *
 * @active - whether the reaction is active or not
 * @targetUri - the object that is being reacted to
 * @type - the type of reaction
 * @schema -
 */
export type ReactionBody = {
  active: boolean;
  schema: 'farcaster.xyz/schemas/v1/reaction';
  targetUri: URI;
  type: ReactionType;
};

export type ReactionType = 'like';

//  ===========================
//  Follow Types
//  ===========================

/** A Follow message */
export type Follow = Message<FollowBody>;

/**
 * A FollowAddBody represents the addition of a follow action on an Farcaster object
 *
 * @active - whether the follow is active or not
 * @targetUri - the object that is being followed
 * @schema -
 */
export type FollowBody = {
  active: boolean;
  schema: 'farcaster.xyz/schemas/v1/follow';
  targetUri: URI;
};

//  ===========================
//  Verification Types
//  ===========================

export type Verification = VerificationAdd | VerificationRemove;

/** VerificationAdd message */
export type VerificationAdd = Message<VerificationAddBody>;

/**
 * A VerificationAddBody represents a signed claim between a Farcaster account and an external entity (i.e. an Ethereum address)
 *
 * @externalUri - the URI of the external entity
 * @claimHash - the hash of the verification claim
 * @blockHash - the block hash of the current block
 * @externalSignature - the signature of the hash of the verification claim, signed by the external key pair
 * @externalSignatureType - type of signature from set of supported types (see version 0x45 of https://eips.ethereum.org/EIPS/eip-191 for 'eth-personal-sign')
 * @schema -
 */
export type VerificationAddBody = {
  externalUri: URI;
  claimHash: string;
  blockHash: string;
  externalSignature: string;
  externalSignatureType: SignatureAlgorithm.EthereumPersonalSign;
  schema: 'farcaster.xyz/schemas/v1/verification-add';
};

/**
 * A VerificationAddFactoryTransientParams is passed to the VerificationAdd factory
 *
 * @ethWallet - the wallet to generate and/or sign the claimHash
 */
export type VerificationAddFactoryTransientParams = MessageFactoryTransientParams & {
  ethWallet?: ethers.Wallet;
};

/**
 * A VerificationClaim is an object that includes both the farcaster account and external address
 *
 * @fid - the Farcaster ID
 * @externalUri - URI of the external address (i.e. Ethereum address)
 * @blockHash - current Ethereum block hash
 */
export type VerificationClaim = {
  fid: number;
  externalUri: URI; // TODO: constrain this farther
  blockHash: string;
};

/** VerificationRemove message */
export type VerificationRemove = Message<VerificationRemoveBody>;

/**
 * A VerificationRemoveBody represents the removal of a verification
 *
 * @claimHash - hash of the verification claim
 * @schema -
 */
export type VerificationRemoveBody = {
  claimHash: string;
  schema: 'farcaster.xyz/schemas/v1/verification-remove';
};

/**
 * A VerificationRemoveFactoryTransientParams is passed to the VerificationRemove factory
 *
 * @externalUri - the external address to generate the claimHash
 */
export type VerificationRemoveFactoryTransientParams = MessageFactoryTransientParams & {
  externalUri?: string;
};

// ===========================
// Signer Types
// ===========================

export type SignerMessage = SignerAdd | SignerRemove;

/** SignerAdd message */
export type SignerAdd = Message<SignerAddBody>;

/**
 * A SignerAddBody represents a bi-directional proof between a custody address and a delegate signer
 *
 * @delegate - the delegate public key
 * @schema -
 */
export type SignerAddBody = {
  delegate: string;
  schema: 'farcaster.xyz/schemas/v1/signer-add';
};

/** SignerRemove message */
export type SignerRemove = Message<SignerRemoveBody>;

/**
 * A SignerRemoveBody represents the removal of a delegate signer
 */
export type SignerRemoveBody = {
  delegate: string;
  schema: 'farcaster.xyz/schemas/v1/signer-remove';
};

/** SignerMessageFactoryTransientParams is passed to the SignerMessage factories and requires an Ethereum signer */
export type SignerMessageFactoryTransientParams = MessageFactoryTransientParams & {
  delegateSigner?: Ed25519Signer;
  signer: EthereumSigner;
};

export type IDRegistryEvent = {
  args: IDRegistryArgs;
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  name: 'Register' | 'Transfer';
};

export type IDRegistryArgs = {
  to: string;
  id: number;
};

// ===========================
//  URI Types
// ===========================

export type URI = FarcasterURI | ChainURI | HTTPURI;

/**
 * A FarcasterURI points to any Farcaster message and is structured as farcaster://<user>/<type>:<id>
 * e.g. A Cast from Alice becomes farcaster://alice/cast-new:0x4eCCe9ba252fC2a05F2A7B0a55943C756eCDA6b9
 */
export type FarcasterURI = string;

/**
 * A Chain URI points to on-chain assets using the CAIP-20 standard with a `chain://` prefix
 * e.g. An NFT becomes chain://eip155:1/erc721:0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03/7894
 */
export type ChainURI = string;

export type HTTPURI = string;

// ===========================
//  Misc Types
// ===========================

/**
 * A KeyPair that is used in the signing process
 * @privateKey - the private key of the user
 * @publicKey - the public key of the user
 */
export type KeyPair = {
  privateKey: Uint8Array;
  publicKey: Uint8Array;
};

/** HashAlgorithm enum */
export enum HashAlgorithm {
  Blake2b = 'blake2b',
}

/** SignatureAlgorithm enum */
export enum SignatureAlgorithm {
  Ed25519 = 'ed25519',
  EthereumPersonalSign = 'eth-personal-sign', // EIP 191 version 0x45 of https://eips.ethereum.org/EIPS/eip-191
}

/** MessageFactoryTransientParams is the generic transient params type for message factories */
export type MessageFactoryTransientParams = {
  signer?: MessageSigner;
};

export type MessageSigner = Ed25519Signer | EthereumSigner;

/** An Ed25519Signer is a MessageSigner object with a Ed25519 private key */
export type Ed25519Signer = {
  privateKey: Uint8Array;
  signerKey: string; // Public key hex
  type: SignatureAlgorithm.Ed25519;
};

/** An EthereumSigner is a MessageSigner object with an ethers wallet */
export type EthereumSigner = {
  wallet: ethers.Wallet;
  signerKey: string; // Address
  type: SignatureAlgorithm.EthereumPersonalSign;
};
