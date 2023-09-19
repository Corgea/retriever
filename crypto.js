const ALGO_NAME = 'RSA-OAEP'
const ALGO_HASH = 'SHA-256'
const ALGO_KEY_LENGTH = 2048

function serialize_key(key) {
    return btoa(JSON.stringify(key))
}

function deserialize_key(str) {
    return JSON.parse(atob(str))
}

async function generateKeyPair() {
    let pubKeySer = localStorage.getItem("publicKey")

    if (pubKeySer !== null) {
        return pubKeySer
    }

    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: ALGO_NAME,
            modulusLength: ALGO_KEY_LENGTH,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: ALGO_HASH,
        },
        true,
        ['encrypt', 'decrypt']
    );

    const publicKeyJWK = await window.crypto.subtle.exportKey(
        'jwk',
        keyPair.publicKey
    );

    const privateKeyJWK = await window.crypto.subtle.exportKey(
        'jwk',
        keyPair.privateKey
    );

    pubKeySer = serialize_key(publicKeyJWK);
    let privKeySer = serialize_key(privateKeyJWK);

    localStorage.setItem(pubKeySer, privKeySer)
    localStorage.setItem('publicKey', pubKeySer)

    return pubKeySer
}

async function importJWKey(key, usage) {
    return await window.crypto.subtle.importKey(
        'jwk',
        key,
        {
            name: ALGO_NAME,
            hash: ALGO_HASH,
        },
        true,
        [usage]
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
    const textBuffer = new TextEncoder().encode(plaintext);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        {
            name: ALGO_NAME,
        },
        publicKey,
        textBuffer
    );

    return btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
}

async function decryptString(privateKey, encryptedBase64) {
    const encryptedBuffer = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        {
            name: ALGO_NAME,
        },
        privateKey,
        encryptedBuffer
    );

    // Convert the decrypted buffer to a string
    return new TextDecoder().decode(decryptedBuffer);
}