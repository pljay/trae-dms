export default {
  login: {
    title: '仓库',
    subtitle: '欢迎使用仓库管理系统',
    username: '用户名',
    password: '密码',
    remember: '记住账号密码',
    submit: '登录',
    required: '请输入{field}',
    loginSuccess: '登录成功',
    loginFailed: '登录失败，请检查账号密码'
  },
  home: {
    title: '仓库',
    modules: {
      scanIn: '扫描入库',
      scanInDesc: '扫描包裹单号进行入库操作',
      packageRecords: '包裹记录',
      packageRecordsDesc: '查看所有包裹的详细信息',
      scanOut: '扫描出库',
      scanOutDesc: '扫描包裹单号进行出库操作',
      outboundRecords: '出库记录',
      outboundRecordsDesc: '管理所有出库批次',
      inboundRecords: '包裹记录',
      inboundRecordsDesc: '查看所有包裹记录',
      inboundBatches: '入仓批次',
      inboundBatchesDesc: '管理所有入仓批次'
    },
    stats: {
      title: '数据统计',
      totalPackages: '总包裹数',
      inStock: '已入库',
      pending: '待出库',
      totalBatches: '总出库批次'
    }
  },
  scanIn: {
      title: '扫描入库',
      scanBarcode: '扫描条码',
      manualInput: '手动输入',
      pleaseInputBarcode: '请输入条码',
      cameraScan: '摄像头扫描',
      scanSuccess: '扫描成功',
      scanFailed: '扫描失败',
      intercepted: '已拦截',
      interceptMessage: '拦截原因',
      trackNo: '单号',
      channel: '渠道',
      country: '国家',
      confirm: '确认',
      cancel: '取消',
      cameraInitFailed: '摄像头初始化失败',
      cameraInUse: '摄像头正在使用中',
      cameraStarted: '摄像头已启动',
      cameraPermissionDenied: '摄像头权限被拒绝',
      cameraNotFound: '未找到摄像头设备',
      cameraNotSupported: '浏览器不支持摄像头功能',
      notInBatch: '该单号不在入仓批次中，禁止入库',
      notForecast: '非预报包裹，直接拦截',
      alreadyInStock: '已入库状态，重复入库',
      pendingIntercept: '拦截',
      alreadyIntercepted: '重复拦截',
      invalidParams: '参数无效',
      invalidStatus: '{status}状态，禁止再次入库'
  },
  packageRecords: {
    title: '包裹记录',
    filter: {
      all: '全部',
      inStock: '已入库',
      pending: '待入库',
      pendingIntercept: '待拦截',
      intercepted: '已拦截',
      outOfStock: '已出库',
      hold: '待处理'
    },
    table: {
      trackNo: '单号',
      weight: '重量(kg)',
      dimensions: '尺寸(cm)',
      status: '状态',
      channel: '渠道',
      country: '国家',
      createdAt: '创建时间',
      updatedAt: '更新时间'
    }
  },
  scanOut: {
    title: '扫描出库',
    batchExists: '已存在出库批次',
    batchCreated: '批次创建成功',
    createFailed: '创建批次失败',
    selectChannelPrompt: '请选择渠道',
    step1: {
      title: '第一步：输入出库批次号',
      serialNumber: '出库流水编号',
      createNew: '创建新批次',
      useExisting: '使用现有批次'
    },
    step2: {
      title: '第二步：选择出货渠道',
      channel: '渠道',
      selectChannel: '请选择出货渠道'
    },
    step3: {
      title: '第三步：扫描出库',
      scan: '扫描包裹',
      scannedCount: '已扫描: {count}',
      totalCount: '总数量: {total}',
      complete: '完成出库',
      noScanned: '尚未扫描任何包裹'
    },
    scanSuccess: '扫描成功',
    batchAutoLoaded: '批次信息已自动加载',
    batchNotFound: '未找到该批次信息'
  },
  outboundRecords: {
    title: '出库记录',
    addBatch: '新增出库批次',
    filter: {
      all: '全部',
      inProgress: '出库中',
      completed: '已出库'
    },
    table: {
      serialNumber: '编号',
      channel: '渠道',
      expectedQuantity: '预计数量',
      actualQuantity: '实际数量',
      quantity: '数量',
      status: '状态',
      createdAt: '创建时间',
      updatedAt: '更新时间',
      action: '操作'
    },
    actions: {
      continue: '继续出库',
      completed: '已完成',
      scanOut: '出库',
      ship: '发货'
    },
    shipSuccess: '发货成功'
  },
  common: {
    logout: '退出登录',
    loading: '加载中...',
    success: '操作成功',
    error: '操作失败',
    confirm: '确认',
    cancel: '取消',
    back: '返回',
    next: '下一步',
    noMoreData: '没有更多数据了',
    noData: '暂无数据',
    search: '搜索',
    searchPlaceholder: '请输入单号、渠道或国家搜索',
    welcome: '欢迎',
    chinese: '中文',
    english: 'English',
    french: 'Français',
    german: 'Deutsch',
    lightTheme: '浅色模式',
    darkTheme: '深色模式',
    userProfile: '用户信息',
    settings: '设置',
    help: '帮助'
  },
  inboundRecords: {
    title: '包裹记录',
    filter: {
      all: '全部',
      inProgress: '入库中',
      completed: '已完成'
    },
    table: {
      trackNo: '单号',
      weight: '重量(kg)',
      dimensions: '尺寸(cm)',
      status: '状态',
      channel: '渠道',
      country: '国家',
      createdAt: '创建时间',
      updatedAt: '更新时间'
    }
  },
  status: {
    // 包裹状态
    package: {
      inStock: '已入库',
      pending: '待入库',
      pendingIntercept: '待拦截',
      intercepted: '已拦截',
      outOfStock: '已出库',
      unknown: '未知'
    },
    // 入仓批次状态
    inboundBatch: {
      pending: '待入仓',
      inProgress: '入仓中',
      completed: '已入仓',
      outboundInProgress: '出仓中',
      outboundCompleted: '已出仓',
      unknown: '未知'
    },
    // 出库批次状态
    outboundBatch: {
      inProgress: '出库中',
      completed: '已出库'
    }
  },
  api: {
    error: {
      badRequest: '请求参数错误',
      unauthorized: '未授权访问',
      forbidden: '禁止访问',
      notFound: '请求资源不存在',
      serverError: '服务器内部错误',
      networkError: '网络连接错误',
      requestError: '请求配置错误',
      unknownError: '未知错误'
    }
  },
  inboundBatches: {
    title: '入仓批次',
    batchDetail: '入仓批次详情',
    batchNo: '批次号',
    status: '状态',
    createdAt: '创建时间',
    inboundProgress: '入仓进度',
    outboundProgress: '出仓进度',
    channelProgress: '渠道进度',
    packageRecords: '包裹记录',
    noChannelInfo: '暂无渠道信息',
    noPackageRecords: '暂无包裹记录',
    inboundProgressText: '入仓进度: {current}/{total}',
    pendingBatches: '待入仓',
    inProgressBatches: '入仓中',
    completedBatches: '已入仓',
    outboundInProgressBatches: '出仓中',
    outboundCompletedBatches: '已出仓',
    noPendingBatches: '暂无待入仓批次',
    noInProgressBatches: '暂无入仓中批次',
    noCompletedBatches: '暂无已入仓批次',
    noOutboundInProgressBatches: '暂无出仓中批次',
    noOutboundCompletedBatches: '暂无已出仓批次',
    labels: {
      batchNo: '批次号:',
      status: '状态:',
      createdAt: '创建时间:',
      inboundProgress: '入仓进度:'
    }
  },
  scan: {
    title: '扫一扫',
    pointCamera: '将二维码/条码放入框内，即可自动扫描',
    help: '支持二维码和一维码',
    lightOn: '开启手电筒',
    lightOff: '关闭手电筒',
    album: '从相册选择',
    manualInput: '手动输入',
    enterCode: '请输入条码',
    scanSuccess: '扫描成功',
    scanFailed: '扫描失败',
    cameraPermissionDenied: '摄像头权限被拒绝',
    flashlightError: '手电筒操作失败',
    albumNotSupported: '暂不支持相册扫描',
    scanTimeout: '扫描超时，请重试',
    cameraStarted: '摄像头已启动',
    cameraNotSupported: '浏览器不支持摄像头功能',
    cameraNotFound: '未找到摄像头设备',
    cameraInUse: '摄像头正在使用中'
  },
  voiceSetting: {
    title: '语音设置',
    volume: '音量',
    pitch: '语调',
    rate: '语速',
    test: '测试语音',
    testText: '这是一条语音测试消息',
    testFailed: '语音测试失败'
  }
};
