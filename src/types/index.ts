// 包裹状态枚举
export enum PackageStatus {
  PENDING = 'pending',       // 待入库
  IN_STOCK = 'in_stock',     // 已入库
  PENDING_INTERCEPT = 'pending_intercept', // 待拦截
  INTERCEPTED = 'intercepted', // 已拦截
  OUT_OF_STOCK = 'out_of_stock', // 已出库
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

// 入仓批次数据类型
export interface InboundBatch {
  id: string | number;       // 批次ID
  batchNumber: string;       // 批次号
  expectedQuantity: number;  // 预计包裹数量
  inboundQuantity: number;   // 入仓数量
  status: InboundStatus;     // 状态
  packages?: Package[];      // 关联的包裹列表（1:n父子关系）
  createdAt?: string | Date; // 创建时间
  updatedAt?: string | Date; // 更新时间
}

// 入仓批次渠道进度数据类型
export interface InboundBatchChannel {
  channel: string;           // 渠道
  expectedQuantity: number;  // 预报数量
  inboundQuantity: number;   // 入仓数量
}

// 包裹数据类型
export interface Package {
  id: string | number;       // 包裹ID
  trackNo: string;           // 单号
  weight: number;            // 重量
  length: number;            // 长
  width: number;             // 宽
  height: number;            // 高
  status: PackageStatus;     // 状态
  channel: string;           // 渠道
  country: string;           // 国家
  scanInAt?: string;  // 入库时间
  scanOutAt?: string; // 出库时间
  inboundBatchId?: string | number; // 关联的入库批次ID（父子关系）
  batchSerialNumber?: string; // 批次号
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

// 出库批次数据类型
export interface OutboundBatch {
  id: string | number;       // 出库流水编号
  serialNumber: string;      // 出库流水编号
  status: OutboundStatus;    // 状态
  quantity: number;          // 数量
  channel: string;           // 渠道
  createdAt?: string; // 创建时间
  updatedAt?: string; // 更新时间
}

// 登录用户信息
export interface User {
  username: string;          // 用户名
  password: string;          // 密码
  remember?: boolean;        // 是否记住账号密码
}

// 扫描结果类型
export interface ScanResult {
  code: string;              // 扫描到的条码
  type?: string;             // 条码类型
}

// 出货渠道类型
export interface Channel {
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
  list: T[];                 // 数据列表
  total: number;             // 总数量
  page: number;              // 当前页码
  pageSize: number;          // 每页数量
}
