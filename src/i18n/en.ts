export default {
  // 公共配置
  common: {
    logout: 'Logout',
    loading: 'Loading...',
    success: 'Operation successful',
    error: 'Operation failed',
    confirm: 'Confirm',
    cancel: 'Cancel',
    back: 'Back',
    next: 'Next',
    noMoreData: 'No more data',
    noData: 'No data',
    search: {
      title: 'Search',
      placeholder: 'Please enter search keywords',
      error: 'Search failed, please try again',
      success: 'Search successful',
      noResults: 'No matching results found'
    },
    placeholder: {
      trackNo: 'Please enter package tracking number',
      batchNo: 'Please enter batch number',
    },
    welcome: 'Welcome',
    chinese: '中文',
    english: 'English',
    french: 'Français',
    german: 'Deutsch',
    lightTheme: 'Light mode',
    darkTheme: 'Dark mode',
    userProfile: 'User Profile',
    settings: 'Settings',
    help: 'Help',
  },

  // 状态配置
  status: {
    // 包裹状态
    package: {
      inStock: 'In Stock',
      pending: 'Pending',
      pendingIntercept: 'Pending Intercept',
      intercepted: 'Intercepted',
      outOfStock: 'Out of Stock',
      unknown: 'Unknown'
    },
    // 入仓批次状态
    inboundBatch: {
      pending: 'Pending Inbound',
      inProgress: 'Inbound In Progress',
      completed: 'Inbound Completed',
      outboundInProgress: 'Outbound In Progress',
      outboundCompleted: 'Outbound Completed',
      unknown: 'Unknown'
    },
    // 出库批次状态
    outboundBatch: {
      inProgress: 'Outbound In Progress',
      completed: 'Outbound Completed'
    }
  },

  // API错误配置
  api: {
    error: {
      badRequest: 'Bad request parameters',
      unauthorized: 'Unauthorized access',
      forbidden: 'Forbidden access',
      notFound: 'Requested resource not found',
      serverError: 'Server internal error',
      networkError: 'Network connection error',
      requestError: 'Request configuration error',
      unknownError: 'Unknown error'
    }
  },

  // 扫描配置
  scan: {
    title: 'Scan',
    barcode: 'Package Tracking Number',
    pointCamera: 'Place the QR code/barcode within the frame for automatic scanning',
    help: 'Supports QR codes and barcodes',
    lightOn: 'Turn on flashlight',
    lightOff: 'Turn off flashlight',
    album: 'Select from album',
    manualInput: 'Manual input',
    enterCode: 'Please enter barcode',
    scanSuccess: 'Scan successful',
    scanFailed: 'Scan failed',
    camera: 'Scan package tracking number',
    errorReason: 'Scan failure reason',
    unknownError: 'Unknown error',
    cameraPermissionDenied: 'Camera permission denied',
    flashlightError: 'Flashlight operation failed',
    albumNotSupported: 'Album scanning not supported',
    scanTimeout: 'Scan timeout, please try again',
    cameraStarted: 'Camera started',
    cameraNotSupported: 'Browser does not support camera function',
    cameraNotFound: 'No camera device found',
    cameraInUse: 'Camera is in use',
    message: {
      scanFailed: 'Scan failed, please try again',
      scanSuccess: 'Scan successful',
      notForecast: 'Package not forecasted',
      duplicateInbound: 'Already in stock, duplicate inbound',
      intercept: 'Pending intercept status, need to intercept',
      duplicateIntercepted: 'Already intercepted, duplicate intercept',
      duplicateOutbound: 'Already out of stock, duplicate outbound',
      notInbound: 'Package not inbound, cannot outbound',
      channelErrorOutbound: 'Channel error, cannot outbound',
      notInBatch: 'Package not in current batch',
      invalidParams: 'Invalid parameters',
      invalidStatus: 'Invalid status'
    }
  },

  // 语音设置配置
  voiceSetting: {
    title: 'Voice Settings',
    volume: 'Volume',
    pitch: 'Pitch',
    rate: 'Rate',
    voice: 'Voice',
    defaultVoice: 'Default Voice',
    test: 'Test Voice',
    testText: 'This is a voice test message',
    testFailed: 'Voice test failed'
  },

  // 视图文件配置

  // LoginView.vue
  loginView: {
    title: 'Warehouse',
    subtitle: 'Welcome to Warehouse Management System',
    username: 'Username',
    password: 'Password',
    remember: 'Remember account password',
    submit: 'Login',
    required: 'Please enter {field}',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed, please check account password'
  },

  // HomeView.vue
  homeView: {
    title: 'Warehouse',
    modules: {
      inboundOperate: 'Scan Inbound',
      inboundOperateDesc: 'Scan package tracking number for inbound operation',
      packageList: 'Package List',
      packageListDesc: 'View detailed information of all packages',
      outboundOperate: 'Scan Outbound',
      outboundOperateDesc: 'Scan package tracking number for outbound operation',
      outboundList: 'Outbound Records',
      outboundListDesc: 'Manage all outbound batches',
      inboundList: 'Inbound Batches',
      inboundListDesc: 'Manage all inbound batches'
    },
    stats: {
      title: 'Data Statistics',
      inbound: 'Pending Inbound',
      inStock: 'In Stock',
      pendingIntercept: 'Pending Intercept',
      holding: 'Holding'
    }
  },

  // PackageListView.vue
  packageListView: {
    title: 'Package List',
    filter: {
      all: 'All',
      inStock: 'In Stock',
      pending: 'Pending',
      pendingIntercept: 'Pending Intercept',
      intercepted: 'Intercepted',
      outOfStock: 'Out of Stock',
      hold: 'Hold'
    },
    table: {
      trackNo: 'Tracking Number',
      weight: 'Weight(kg)',
      dimensions: 'Dimensions(cm)',
      status: 'Status',
      channel: 'Channel',
      country: 'Country',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    }
  },

  // InboundBatchListView.vue
  inboundBatchListView: {
    title: 'Inbound Batch List',
    filter: {
      all: 'All',
      inProgress: 'Inbound In Progress',
      completed: 'Inbound Completed'
    },
    table: {
      trackNo: 'Tracking Number',
      weight: 'Weight(kg)',
      dimensions: 'Dimensions(cm)',
      status: 'Status',
      channel: 'Channel',
      country: 'Country',
      createdAt: 'Created At',
      updatedAt: 'Updated At'
    },
    batchDetail: 'Inbound Batch Detail',
    batchNo: 'Batch Number',
    status: 'Status',
    createdAt: 'Created At',
    inboundProgress: 'Inbound Progress',
    outboundProgress: 'Outbound Progress',
    channelProgress: 'Channel Progress',
    packageRecords: 'Package Records',
    noChannelInfo: 'No channel information',
    noPackageRecords: 'No package records',
    inboundProgressText: 'Inbound Progress: {current}/{total}',
    pendingBatches: 'Pending Inbound',
    inProgressBatches: 'Inbound In Progress',
    completedBatches: 'Inbound Completed',
    outboundInProgressBatches: 'Outbound In Progress',
    outboundCompletedBatches: 'Outbound Completed',
    noPendingBatches: 'No pending inbound batches',
    noInProgressBatches: 'No inbound in progress batches',
    noCompletedBatches: 'No completed inbound batches',
    noOutboundInProgressBatches: 'No outbound in progress batches',
    noOutboundCompletedBatches: 'No completed outbound batches',
    labels: {
      batchNo: 'Batch Number:',
      status: 'Status:',
      createdAt: 'Created At:',
      inboundProgress: 'Inbound Progress:'
    }
  },

  // InboundBatchDetailView.vue
  inboundBatchDetailView: {
    title: 'Inbound Batch Detail',
    batchInfo: 'Batch Information',
    packageRecords: 'Package Records',
    batchNo: 'Batch Number',
    status: 'Status',
    createdAt: 'Created At',
    inboundProgress: 'Inbound Progress',
    channelProgress: 'Channel Progress',
    noPackageRecords: 'No package records',
    noChannelInfo: 'No channel information',
    trackNo: 'Package Tracking Number',
    scanSuccess: 'Scan successful',
    scanFailed: 'Scan failed',
    labels: {
      batchNo: 'Batch Number:',
      status: 'Status:',
      createdAt: 'Created At:',
      inboundProgress: 'Inbound Progress:'
    },
  },

  // InboundOperateView.vue
  inboundOperateView: {
    title: 'Inbound Operation',
    batchInfo: 'Batch Information',
    scan: 'Scan Inbound',
    batchNo: 'Batch Number',
    trackNo: 'Package Tracking Number',
    status: 'Status',
    channel: 'Channel',
    quantity: 'Quantity',
    weight: 'Weight(kg)',
    dimensions: 'Dimensions(cm)',
    manualInput: 'Manual input package tracking number',
    scannedCount: 'Scanned: {count}',
    scanSuccess: 'Scan successful',
    scanFailed: 'Scan failed',
    notInBatch: 'This tracking number is not in the inbound batch, inbound prohibited',
    notForecast: 'Non-forecast package, direct intercept',
    alreadyInStock: 'Already in stock, duplicate inbound',
    pendingIntercept: 'Intercept',
    alreadyIntercepted: 'Duplicate intercept',
    invalidParams: 'Invalid parameters',
    invalidStatus: '{status} status, inbound prohibited'
  },

  // OutboundBatchListView.vue
  outboundBatchListView: {
    title: 'Outbound Batch List',
    addBatch: 'Add Outbound Batch',
    filter: {
      all: 'All',
      inProgress: 'Outbound In Progress',
      completed: 'Outbound Completed'
    },
    table: {
      serialNumber: 'Serial Number',
      channel: 'Channel',
      expectedQuantity: 'Expected Quantity',
      actualQuantity: 'Actual Quantity',
      quantity: 'Quantity',
      status: 'Status',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      action: 'Action'
    },
    actions: {
      continue: 'Continue Outbound',
      completed: 'Completed',
      scanOut: 'Outbound',
      ship: 'Ship'
    },
    shipSuccess: 'Shipment successful'
  },

  // OutboundOperateListView.vue
  outboundOperateListView: {
    title: 'Outbound Operation List',
    list: {
      serialNumber: 'Outbound Serial Number',
      channel: 'Channel',
      actualQuantity: 'Actual Quantity',
      status: 'Status',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      action: 'Action'
    },
    action: {
      add: 'Add Outbound Batch',
      continue: 'Continue Outbound',
      completed: 'Completed',
      scanOut: 'Outbound',
      complate: 'Ship'
    },
    confirmComplate: 'Are you sure you want to ship?',
    form: {
      title: 'Add Outbound Batch',
      step1: {
        title: 'Step 1: Enter Outbound Batch Number',
        serialNumber: 'Please enter outbound batch number'
      },
      step2: {
        title: 'Step 2: Select Channel',
        selectChannel: 'Please select channel'
      }
    },
    filter: {
      all: 'All',
      inProgress: 'Outbound In Progress',
      completed: 'Outbound Completed'
    }
  },
  // OutboundOperateView.vue
  outboundOperateDetailView: {
    title: 'Outbound Operation',
    batchInfo: 'Batch Information',
    serialNumber: 'Outbound Serial Number',
    channel: 'Channel',
    quantity: 'Quantity',
    scannedCount: 'Scanned',
    complete: 'Ship',
    confirmComplate: 'Are you sure you want to ship?',
    batchNotFound: 'Batch does not exist',
    confirmManualInput: 'Are you sure you want to manually input outbound?',
    sacn: {
      scanSuccess: 'Scan successful',
      scanFailed: 'Scan failed',
      alreadyOutStock: 'Already out of stock, duplicate outbound',
      notInOutStock: 'Not inbound, outbound prohibited',
      channelErrorOutStock: 'Channel error, outbound prohibited',
      invalidParams: 'Invalid parameters',
      invalidStatus: '{status} status, outbound prohibited'
    }

  },

  // ScanView.vue
  scanView: {
    title: 'Scan',
    scanBarcode: 'Scan Barcode',
    manualInput: 'Manual Input',
    pleaseInputBarcode: 'Please enter barcode',
    cameraScan: 'Camera Scan',
    confirm: 'Confirm',
    cancel: 'Cancel',
    cameraInitFailed: 'Camera initialization failed',
    cameraInUse: 'Camera is in use',
    cameraStarted: 'Camera started',
    cameraPermissionDenied: 'Camera permission denied',
    cameraNotFound: 'No camera device found',
    cameraNotSupported: 'Browser does not support camera function'
  },

  // VoiceSettingView.vue
  voiceSettingView: {
    title: 'Voice Settings',
    volume: 'Volume',
    pitch: 'Pitch',
    rate: 'Rate',
    test: 'Test Voice',
    testText: 'This is a voice test message',
    testFailed: 'Voice test failed'
  }
};