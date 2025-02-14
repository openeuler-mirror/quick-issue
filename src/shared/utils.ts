import Cookies from 'js-cookie';

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

/**
 * 获取指定时区偏移量的年份
 * @param {number} offset - 时区偏移量（单位：小时）。例如，UTC+8 时区，传入 8。
 * @returns {number} - 指定时区偏移量对应的年份
 */
export function getYearByOffset(offset = 8) {
  // 获取当前时间的 UTC 时间
  const now = new Date();
  const utcTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

  // 设置偏移
  utcTime.setHours(utcTime.getHours() + offset);

  return utcTime.getFullYear();
}
getYearByOffset();

/**
 * 获取指定key的cookie值
 * @param key
 * @returns 值
 */
export function getCookie(key: string) {
  return Cookies.get(key);
}

/**
 * 设置cookie
 * @param key cookie的key
 * @param value cookie的值
 * @param day cookie的过期时间 默认1天
 */
export function setCookie(
  key: string,
  value: string,
  day = 1,
  domain: string = location.hostname
) {
  Cookies.set(key, value, { expires: day, domain });
}

/**
 * 删除cookie
 * @param key cookie的key
 */
export function removeCookie(key: string) {
  Cookies.remove(key);
}
