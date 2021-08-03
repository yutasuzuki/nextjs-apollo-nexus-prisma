import CryptoJS from 'crypto-js'

export class CryptoServiceClass {
  encrypt(arg: string): string {
    const token = CryptoJS.AES.encrypt(arg, process.env.CRYPTO_SECRET_KEY).toString()
    return token
  }
  decrypt<T>(token: string): T {
    try {
      const bytes = CryptoJS.AES.decrypt(token, process.env.CRYPTO_SECRET_KEY)
      const data = bytes.toString(CryptoJS.enc.Utf8)
      return data
    } catch(error) {
      return error
    }
  }
  hashing(value: string): string {
    return CryptoJS.SHA256(value).toString(CryptoJS.enc.Base64)
  }
}

export const CryptoService = new CryptoServiceClass