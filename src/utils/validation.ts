/**
 * 输入验证工具函数
 */

/**
 * 检查字符串是否为空
 * @param value 要检查的值
 * @returns 是否为空
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === ''
}

/**
 * 检查字符串是否符合最小长度要求
 * @param value 要检查的值
 * @param minLength 最小长度
 * @returns 是否符合要求
 */
export const isMinLength = (value: string, minLength: number): boolean => {
  return !isEmpty(value) && value.length >= minLength
}

/**
 * 检查字符串是否符合最大长度要求
 * @param value 要检查的值
 * @param maxLength 最大长度
 * @returns 是否符合要求
 */
export const isMaxLength = (value: string, maxLength: number): boolean => {
  return isEmpty(value) || value.length <= maxLength
}

/**
 * 检查字符串是否符合特定长度要求
 * @param value 要检查的值
 * @param length 要求的长度
 * @returns 是否符合要求
 */
export const isExactLength = (value: string, length: number): boolean => {
  return !isEmpty(value) && value.length === length
}

/**
 * 检查字符串是否是有效的批次号格式 (OB开头，后面跟数字)
 * @param value 要检查的值
 * @returns 是否有效
 */
export const isValidBatchNumber = (value: string): boolean => {
  const batchNumberRegex = /^OB\d+$/i
  return !isEmpty(value) && batchNumberRegex.test(value)
}

/**
 * 检查字符串是否是有效的条码格式
 * @param value 要检查的值
 * @returns 是否有效
 */
export const isValidBarcode = (value: string): boolean => {
  // 简单的条码验证，实际项目中可能需要更复杂的验证
  return !isEmpty(value) && value.length >= 8 && value.length <= 32
}

/**
 * 检查字符串是否是有效的用户名格式
 * @param value 要检查的值
 * @returns 是否有效
 */
export const isValidUsername = (value: string): boolean => {
  return !isEmpty(value) && value.length >= 3 && value.length <= 20
}

/**
 * 检查字符串是否是有效的密码格式
 * @param value 要检查的值
 * @returns 是否有效
 */
export const isValidPassword = (value: string): boolean => {
  return !isEmpty(value) && value.length >= 6
}
