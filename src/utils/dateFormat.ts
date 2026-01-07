/**
 * 日期格式化工具函数
 */

/**
 * 将日期格式化为指定格式的字符串
 * @param date 日期对象或日期字符串
 * @param format 格式化字符串，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: Date | string | number, format: string = 'YYYY-MM-DD HH:mm:ss'): string => {
  const d = new Date(date)
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 获取当前日期时间
 * @returns 当前日期时间字符串，格式为 'YYYY-MM-DD HH:mm:ss'
 */
export const getCurrentDateTime = (): string => {
  return formatDate(new Date())
}

/**
 * 获取当前日期
 * @returns 当前日期字符串，格式为 'YYYY-MM-DD'
 */
export const getCurrentDate = (): string => {
  return formatDate(new Date(), 'YYYY-MM-DD')
}

/**
 * 获取当前时间
 * @returns 当前时间字符串，格式为 'HH:mm:ss'
 */
export const getCurrentTime = (): string => {
  return formatDate(new Date(), 'HH:mm:ss')
}

/**
 * 将日期转换为相对时间（如：3小时前，2天前）
 * @param date 日期对象或日期字符串
 * @returns 相对时间字符串
 */
export const toRelativeTime = (date: Date | string | number): string => {
  const now = new Date()
  const d = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  // 检查日期是否有效
  if (isNaN(d.getTime())) {
    return ''
  }
  
  const minute = 60
  const hour = minute * 60
  const day = hour * 24
  const week = day * 7
  const month = day * 30
  const year = day * 365
  
  if (diffInSeconds < minute) {
    return '刚刚'
  } else if (diffInSeconds < hour) {
    return `${Math.floor(diffInSeconds / minute)}分钟前`
  } else if (diffInSeconds < day) {
    return `${Math.floor(diffInSeconds / hour)}小时前`
  } else if (diffInSeconds < week) {
    return `${Math.floor(diffInSeconds / day)}天前`
  } else if (diffInSeconds < month) {
    return `${Math.floor(diffInSeconds / week)}周前`
  } else if (diffInSeconds < year) {
    return `${Math.floor(diffInSeconds / month)}个月前`
  } else {
    return `${Math.floor(diffInSeconds / year)}年前`
  }
}
