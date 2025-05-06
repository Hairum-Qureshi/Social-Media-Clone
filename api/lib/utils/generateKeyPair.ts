import forge from "node-forge";
import { KeyPair } from "../../interfaces";

export function generateKeyPair(): KeyPair {
	const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
	const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
	const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
	return { publicKeyPem, privateKeyPem };
};