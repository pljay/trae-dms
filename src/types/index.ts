// 渠道枚举
export enum ChannelEnum {
  USPS = 'USPS',
  UPS = 'UPS',
  DHL = 'DHL',
  FedEx = 'FedEx',
  EMS = 'EMS',
  SF_EXPRESS = 'SF Express',
  YTO_EXPRESS = 'YTO Express',
  ZTO_EXPRESS = 'ZTO Express',
  ARAMEX = 'Aramex',
  DPEX = 'DPEX'
}

// 包裹状态枚举
export enum PackageStatus {
  PENDING = 'pending',       // 待入库
  IN_STOCK = 'in_stock',     // 已入库
  PENDING_INTERCEPT = 'pending_intercept', // 待拦截
  INTERCEPTED = 'intercepted', // 已拦截
  OUT_OF_STOCK = 'out_of_stock', // 已出库
  HOLD = 'hold', // 已暂停
}

// 出库批次状态枚举
export enum OutboundStatus {
  COMPLETED = 'completed',   // 已出库
  IN_PROGRESS = 'in_progress', // 出库中
}

// 入仓批次状态枚举
export enum InboundStatus {
  PENDING = 'pending',       // 待入仓
  IN_PROGRESS = 'in_progress', // 入仓中
  COMPLETED = 'completed',   // 已入仓
  OUTBOUND_IN_PROGRESS = 'outbound_in_progress', // 出仓中
  OUTBOUND_COMPLETED = 'outbound_completed' // 已出仓
}

// 业务错误码枚举
export enum ErrorCode {

  INVALID_STATUS = 1000, // 无效状态

    // 拦截相关错误
  PENDING_INTERCEPT = 1001, // 待拦截状态，拦截
  DUPLICATE_INTERCEPTED = 1002, // 已拦截状态，重复拦截

  // 入库相关错误
  NOT_FORECAST_PACKAGE = 1010, // 非预报包裹
  DUPLICATE_IN_STOCK = 1011, // 已入库状态，重复入库




  // 出库相关错误
  DUPLICATE_OUT_STOCK = 1020, // 已出库状态，重复出库
  //未入库禁止出库
  NOT_INOUT_STOCK = 1021, // 未入库禁止出库
  
  // 其他业务错误
  NOT_IN_BATCH = 2001, // 不在批次内
  INVALID_PARAMS = 3001, // 参数无效
  NOT_FOUND = 4004, // 资源不存在
  SERVER_ERROR = 5000 // 服务器错误
}

// 入仓批次数据类型
export interface InboundBatch {
  id: string | number;       // 批次ID
  no?: string; // 自定义编号
  serialNumber?: string; // 流水编号
  batchNumber: string;       // 批次号
  expectedQuantity: number;  // 预计包裹数量
  inboundQuantity: number;   // 入仓数量
  outboundQuantity: number;   // 出仓数量
  status: string;     // 状态
  inboundStatus: InboundStatus;     // 状态
  expectedDate?: string | Date; // 预计入仓时间
  packages?: Package[];      // 关联的包裹列表（1:n父子关系）
  createdAt?: string | Date; // 创建时间
  updatedAt?: string | Date; // 更新时间
}

// 入仓批次渠道进度数据类型
export interface InboundBatchChannel {
  batchId: string | number; // 批次ID
  channelCode: string;           // 渠道名称
  channelId: string;           // 渠道
  expectQuantity: number;  // 预报数量
  inboundQuantity: number;   // 入仓数量
  outboundQuantity: number;   // 出仓数量
}

// 包裹数据类型
export interface Package {
  id: string | number;       // 包裹ID
  trackNo: string;           // 单号
  weight: number;            // 重量
  length: number;            // 长
  width: number;             // 宽
  height: number;            // 高
  status: PackageStatus|string;     // 状态
  channelId?: string;           // 渠道
  channelCode?: ChannelEnum|string;          // 渠道
  country: string;           // 国家
  scanInAt?: string;  // 入库时间
  scanOutAt?: string; // 出库时间
  inboundBatchId?: string | number; // 关联的入库批次ID（父子关系）
  outboundBatchId?: string | number; // 关联的出库批次ID（父子关系）
  batchSerialNumber?: string; // 批次号
  createTime?: string; // 创建时间
  updateTime?: string; // 更新时间
  //非库内包裹字段
  no?: string; // 单号
}

// 出库批次数据类型
export interface OutboundBatch {
  id: string;       // 出库流水编号
  serialNumber: string;      // 出库流水编号
  status: OutboundStatus;    // 状态
  quantity: number;          // 数量
  channelId?: string;      // 渠道
  channelCode?: string;          // 渠道
  packages?: Package[];      // 关联的包裹列表（1:n父子关系）
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

// 登录用户信息
export interface User {
  id?: string;               // 用户ID
  username: string;          // 用户名
  password: string;          // 密码
  name?: string;             // 用户姓名
  orgCodeTxt?: string;       // 组织名称
  remember?: boolean;        // 是否记住账号密码
}

// 扫描结果类型
export interface ScanResult {
  code: string;              // 扫描到的条码
  type?: string;             // 条码类型
}

// 出货渠道类型
export interface Channel {
  id: string | number;       // 渠道ID
  code: string;              // 渠道代码
  name: string;              // 渠道名称
}

// 国家类型
export interface Country {
  code: string;              // 国家代码
  name: string;              // 国家名称
}

// 分页响应类型
export interface PaginationResponse<T> {
  records: T[];                 // 数据列表
  total: number;             // 总数量
  current: number;              // 当前页码
  pages: number;              // 总页数
  size: number;          // 每页数量
}

// 包裹状态统计数据类型
export interface PackageStatsCount {
  intoCount: number;           // 已入库数量
  interceptedCount: number;        // 已拦截数量
  holdCount: number;       // 待处理数量
  totalCount: number;           // 总数量
}


// //库内包裹
// export interface IntoParcel {
//   id: string | number;       // 包裹ID
//   trackNo: string;           // 单号
//   weight: number;            // 重量
//   length: number;            // 长
//   width: number;             // 宽
//   height: number;            // 高
//   status: string;            // 状态
//   channelId_dictText: string;          // 渠道
//   country: string;           // 国家
//   createTime?: string; // 创建时间
//   updatedTime?: string; // 更新时间
// }



