import snapshot from "@snapshot-labs/snapshot.js";

// TODO https://testnet.seq.snapshot.org http://localhost:3001
const SEQUENCER_URL = "https://testnet.seq.snapshot.org";
const signClient = new snapshot.Client712(SEQUENCER_URL) || null;

export async function signSetAlias(web3, address, alias) {
  try {
    const result = await signClient.alias(web3, address, {
      alias: alias
    });
    console.log("result:", result);
    return result;
  } catch (error) {
    console.log("error:", error);
    return null;
  }
}
