import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_SECRET_KEY?.replace(/['"]/g, '');
const IV = import.meta.env.VITE_ENCRYPTION_IV?.replace(/['"]/g, '');

export const EncryptData = (id: string | number): string => {
    const encrypted = CryptoJS.AES.encrypt(id.toString(), CryptoJS.enc.Utf8.parse(SECRET_KEY), {
        iv: CryptoJS.enc.Utf8.parse(IV),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

export const DecryptData = (data: any) => {
    const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Utf8.parse(IV);

    const decrypted = CryptoJS.AES.decrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
}