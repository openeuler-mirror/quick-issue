import CryptoJS from 'crypto-js';

// TS 对象key合法检查
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return Object.prototype.hasOwnProperty.call(object, key);
}

export function scrollToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

export function hiddenMail(mail: string) {
  const mailTest = new RegExp(
    '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
  );
  if (mailTest.test(mail)) {
    return `${mail.split('@')[0]}@***${mail.charAt(mail.length - 1)}`;
  }
}

/**
 * @word 要加密的内容
 * @keyWord String  服务器随机返回的关键字
 *  */
export function aesEncrypt(word: string, keyWord: string) {
  const key = CryptoJS.enc.Utf8.parse(keyWord);
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

export function getAuthorization() {
  const secret = import.meta.env.VITE_SECRET;
  const data = {
    secret: secret,
    timestamp: Math.floor(Date.now() / 1000),
  };
  return aesEncrypt(JSON.stringify(data), secret);
}
