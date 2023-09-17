function serialize_key(key) {
    return btoa(JSON.stringify(key))
}

function deserialize_key(str) {
    return JSON.parse(atob(str))
}

async function generateKeyPair() {
    // Generate an RSA key pair for encryption
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048, // Key size
            publicExponent: new Uint8Array([1, 0, 1]), // Public exponent
            hash: 'SHA-256', // Hash algorithm
        },
        true, // Extractable
        ['encrypt', 'decrypt'] // Key usages
    );

    // Export the public key to JWK format
    const publicKeyJWK = await window.crypto.subtle.exportKey(
        'jwk',
        keyPair.publicKey
    );

    // Export the private key to JWK format
    const privateKeyJWK = await window.crypto.subtle.exportKey(
        'jwk',
        keyPair.privateKey
    );

    let pub_key_ser = serialize_key(publicKeyJWK);
    let priv_key_ser = serialize_key(privateKeyJWK);

    localStorage.setItem(pub_key_ser, priv_key_ser)

    return pub_key_ser
}

async function importJWKey(key, usage) {
    return await window.crypto.subtle.importKey(
        'jwk', // Format
        key, // Key data
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true, // Extractable
        [usage] // Key usages
    );
}

async function load_public_key() {
    return await importJWKey(deserialize_key(location.hash.split('#')[1]), 'encrypt')
}

async function load_key(serialized_key, usage) {
    return await importJWKey(deserialize_key(serialized_key), usage)
}

async function load_private_key(public_key_ser) {
    return await importJWKey(deserialize_key(localStorage.getItem(pub_key_ser)), 'decrypt')
}

async function encryptString(publicKey, plaintext) {
    // Convert the plaintext string to a buffer
    const textBuffer = new TextEncoder().encode(plaintext);

    // Encrypt the buffer using the public key
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        publicKey,
        textBuffer
    );

    // Convert the encrypted buffer to a base64 string
    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

async function decryptString(privateKey, encryptedBase64) {
    // Convert the base64 string to a buffer
    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    // Decrypt the buffer using the private key
    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: 'RSA-OAEP',
        },
        privateKey,
        encryptedBuffer
    );

    // Convert the decrypted buffer to a string
    return new TextDecoder().decode(decryptedBuffer);
}