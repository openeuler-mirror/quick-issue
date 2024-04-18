
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
