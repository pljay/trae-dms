export default {
  login: {
    title: 'DMS',
    subtitle: 'Welcome to Warehouse Management System',
    username: 'Username',
    password: 'Password',
    remember: 'Remember account',
    submit: 'Login',
    required: 'Please enter {field}',
    loginSuccess: 'Login successful',
    loginFailed: 'Login failed, please check your credentials'
  },
  home: {
    title: 'DMS',
    modules: {
      scanIn: 'Scan In',
      scanInDesc: 'Scan package barcode for incoming operations',
      packageRecords: 'Package Records',
      packageRecordsDesc: 'View detailed information of all packages',
      scanOut: 'Scan Out',
      scanOutDesc: 'Scan package barcode for outgoing operations',
      outboundRecords: 'Outbound Records',
      outboundRecordsDesc: 'Manage all outbound batches',
      inboundRecords: 'Inbound Records',
      inboundRecordsDesc: 'View all inbound records',
      inboundBatches: 'Inbound Batches',
      inboundBatchesDesc: 'Manage all inbound batches'
    },
    stats: {
      title: 'Data Statistics',
      totalPackages: 'Total Packages',
      inStock: 'In Stock',
      pending: 'Pending',
      totalBatches: 'Total Batches'
    }
  },
  scanIn: {
      title: 'Scan In',
      scanBarcode: 'Scan Barcode',
      manualInput: 'Manual Input',
      pleaseInputBarcode: 'Please input barcode',
      cameraScan: 'Camera Scan',
      scanSuccess: 'Scan Successful',
      scanFailed: 'Scan Failed',
      intercepted: 'Intercepted',
      interceptMessage: 'Intercept Reason',
      trackNo: 'Tracking Number',
      channel: 'Channel',
      country: 'Country',
      confirm: 'Confirm',
      cancel: 'Cancel',
      cameraInitFailed: 'Camera initialization failed',
      cameraInUse: 'Camera is in use',
      cameraStarted: 'Camera started',
      cameraPermissionDenied: 'Camera permission denied',
      cameraNotFound: 'Camera not found',
      cameraNotSupported: 'Camera not supported',
      notInBatch: 'This tracking number is not in inbound batch, prohibited from storage',
      notForecast: 'Non-forecast package, directly intercepted',
      alreadyInStock: 'Already in stock, duplicate storage',
      pendingIntercept: 'Intercepted',
      alreadyIntercepted: 'Already intercepted, duplicate intercept',
      invalidParams: 'Invalid parameters',
      invalidStatus: '{status} status, cannot be stored again'
  },
  packageRecords: {
    title: 'Package Records',
    filter: {
      all: 'All',
      pending: 'Pending',
      inStock: 'In Stock',
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
  scanOut: {
    title: 'Scan Out',
    batchExists: 'Outbound batch already exists',
    batchCreated: 'Batch created successfully',
    createFailed: 'Failed to create batch',
    selectChannelPrompt: 'Please select a channel',
    step1: {
      title: 'Step 1: Enter Batch Number',
      serialNumber: 'Batch Number',
      createNew: 'Create New Batch',
      useExisting: 'Use Existing Batch'
    },
    step2: {
      title: 'Step 2: Select Channel',
      channel: 'Channel',
      selectChannel: 'Please select shipping channel'
    },
    step3: {
      title: 'Step 3: Scan Packages',
      scan: 'Scan Package',
      scannedCount: 'Scanned: {count}',
      totalCount: 'Total: {total}',
      complete: 'Complete Outbound',
      noScanned: 'No packages have been scanned yet'
    },
    scanSuccess: 'Scan Successful',
    batchAutoLoaded: 'Batch information automatically loaded',
    batchNotFound: 'Batch not found'
  },
  outboundRecords: {
    title: 'Outbound Records',
    addBatch: 'Add Outbound Batch',
    filter: {
      all: 'All',
      inProgress: 'In Progress',
      completed: 'Completed'
    },
    table: {
      serialNumber: 'Batch Number',
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
      scanOut: 'Scan Out',
      ship: 'Ship'
    },
    shipSuccess: 'Shipment successful'
  },
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
    search: 'Search',
    searchPlaceholder: 'Please enter tracking number, channel or country to search',
    welcome: 'Welcome',
    chinese: 'Chinese',
    english: 'English',
    french: 'French',
    german: 'German',
    lightTheme: 'Light Mode',
    darkTheme: 'Dark Mode',
    userProfile: 'User Profile',
    settings: 'Settings',
    help: 'Help'
  },
  inboundRecords: {
    title: 'Inbound Records',
    filter: {
      all: 'All',
      inProgress: 'In Progress',
      completed: 'Completed'
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
  status: {
    // Package status
    package: {
      inStock: 'In Stock',
      pending: 'Pending',
      pendingIntercept: 'Pending Intercept',
      intercepted: 'Intercepted',
      outOfStock: 'Out of Stock',
      unknown: 'Unknown'
    },
    // Inbound batch status
    inboundBatch: {
      pending: 'Pending',
      inProgress: 'In Progress',
      completed: 'Completed',
      outboundInProgress: 'Outbound In Progress',
      outboundCompleted: 'Outbound Completed',
      unknown: 'Unknown'
    },
    // Outbound batch status
    outboundBatch: {
      inProgress: 'In Progress',
      completed: 'Completed'
    }
  },
  api: {
    error: {
      badRequest: 'Bad request',
      unauthorized: 'Unauthorized access',
      forbidden: 'Forbidden',
      notFound: 'Resource not found',
      serverError: 'Internal server error',
      networkError: 'Network connection error',
      requestError: 'Request configuration error',
      unknownError: 'Unknown error'
    }
  },
  inboundBatches: {
    title: 'Inbound Batches',
    batchDetail: 'Inbound Batch Detail',
    batchNo: 'Batch No.',
    status: 'Status',
    createdAt: 'Created At',
    inboundProgress: 'Inbound Progress',
    outboundProgress: 'Outbound Progress',
    channelProgress: 'Channel Progress',
    packageRecords: 'Package Records',
    noChannelInfo: 'No channel information',
    noPackageRecords: 'No package records',
    inboundProgressText: 'Inbound Progress: {current}/{total}',
    pendingBatches: 'Pending',
    inProgressBatches: 'In Progress',
    completedBatches: 'Completed',
    outboundInProgressBatches: 'Outbound In Progress',
    outboundCompletedBatches: 'Outbound Completed',
    noPendingBatches: 'No pending batches',
    noInProgressBatches: 'No in progress batches',
    noCompletedBatches: 'No completed batches',
    noOutboundInProgressBatches: 'No outbound in progress batches',
    noOutboundCompletedBatches: 'No outbound completed batches',
    labels: {
      batchNo: 'Batch No.:',
      status: 'Status:',
      createdAt: 'Created At:',
      inboundProgress: 'Inbound Progress:'
    }
  },
  scan: {
    title: 'Scan',
    pointCamera: 'Place the QR code/barcode within the frame to scan automatically',
    help: 'Supports QR codes and barcodes',
    lightOn: 'Turn on flashlight',
    lightOff: 'Turn off flashlight',
    album: 'Select from album',
    manualInput: 'Manual input',
    enterCode: 'Please enter code',
    scanSuccess: 'Scan successful',
    scanFailed: 'Scan failed',
    cameraPermissionDenied: 'Camera permission denied',
    flashlightError: 'Flashlight operation failed',
    albumNotSupported: 'Album scan not supported yet',
    scanTimeout: 'Scan timeout, please try again'
  },
  voiceSetting: {
    title: 'Voice Settings',
    volume: 'Volume',
    pitch: 'Pitch',
    rate: 'Speed',
    test: 'Test Voice',
    testText: 'This is a voice test message',
    testFailed: 'Voice test failed'
  }
};
