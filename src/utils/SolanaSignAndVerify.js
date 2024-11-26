import base58 from "bs58";
import { PublicKey } from "@solana/web3.js";
import { verifyAsync } from "@noble/ed25519";
import { sign } from "tweetnacl";

const signSolanaMessage = async (provider_solana, message_string) => {
  try {
    const message_Uint8Array = new TextEncoder().encode(message_string);
    const signResult = await provider_solana.signMessage(
      message_Uint8Array,
      "utf8"
    );
    const signature_string = base58.encode(signResult.signature);
    return signature_string;
  } catch (error) {
    return null;
  }
};

const verifySolanaSignature = async (
  signature_string,
  message_string,
  account_string
) => {
  // (Uint8Array, Uint8Array, PublicKey)
  const signature = base58.decode(signature_string);
  const message = new TextEncoder().encode(message_string);

  const publicKey = new PublicKey(account_string);
  return await verifyAsync(signature, message, publicKey.toBytes());
};

const verifySolanaSignatureV2 = async (
  signature_string,
  message_string,
  account_string
) => {
  // (Uint8Array, Uint8Array, PublicKey)
  const signature = base58.decode(signature_string);
  const message = new TextEncoder().encode(message_string);
  const publicKey = new PublicKey(account_string);
  return sign.detached.verify(message, signature, publicKey.toBytes());
};

export { signSolanaMessage, verifySolanaSignature, verifySolanaSignatureV2 };
