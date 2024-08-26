import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import weth_idl from "../idls/weth_idl.json";
import { PublicKey } from "@solana/web3.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
const getWethProgram = (connection, wallet) => {
  const provider = new anchor.AnchorProvider(connection, wallet);
  const program = new Program(weth_idl, provider);
  return program;
};

export const getWethMintAddress = () => {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("weth_mint")],
    new PublicKey(weth_idl.address)
  )[0].toBase58();
};

export const getMetadataPDA = (mint) => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      TOKEN_METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID
  )[0];
};

export { getWethProgram };
