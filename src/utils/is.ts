/*
 * @Author: LiuTao
 * @Date: 2023-05-30 10:59:57
 * @LastEditors: LiuTao
 * @LastEditTime: 2023-05-30 11:14:04
 * @Description: ...
 */

/**
 * @description: Get arg's type
 * @return { String }
 */
function getTypeString(arg) {
  return Object.prototype.toString.call(arg).slice(8, -1)
}
/**
 * @description: Is String?
 * @return { Boolean }
 */
export function isString(str) {
  return getTypeString(str) === 'String'
}
/**
 * @description: Is number?
 * @return { Boolean }
 */
export function isNumber(num) {
  return getTypeString(num) === 'Number' && !Number.isNaN(num)
}
/**
 * @description: Is Object?
 * @return { Boolean }
 */
export function isObject(obj) {
  return getTypeString(obj) === 'Object'
}
/**
 * @description: Is Array?
 * @return { Boolean }
 */
export function isArray(arr) {
  return Array.isArray(arr)
}
/**
 * @description: Is Boolean?
 * @return { Boolean }
 */
export function isBoolean(bool) {
  return getTypeString(bool) === 'Boolean'
}
/**
 * @description: Is Function?
 * @return { Boolean }
 */
export function isFunction(func) {
  return getTypeString(func) === 'Function'
}
/**
 * @description: Is Promise?
 * @return { Boolean }
 */
export function isPromise(pm) {
  return (getTypeString(pm) === 'Promise' || isFunction(pm)) && isFunction(pm.then)
}
/**
 * @description: Is RegExp?
 * @return { Boolean }
 */
export function isRegExp(reg) {
  return getTypeString(reg) === 'RegExp'
}
/**
 * @description: Is Blob?
 * @return { Boolean }
 */
export function isBlob(blob) {
  return getTypeString(blob) === 'Blob'
}
/**
 * @description: Is defination?
 * @return { Boolean }
 */
export function isDef(arg) {
  return arg !== void 0
}
/**
 * @description: Is null?
 * @return { Boolean }
 */
export function isNull(arg) {
  return arg === null
}
/**
 * @description: Is null or undefined?
 * @return { Boolean }
 */
export function isNil(arg) {
  return !isDef(arg) || isNull(arg)
}
