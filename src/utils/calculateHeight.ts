
  // 计算视图内剩余高度 去掉导航栏和其他元素的高度
 export  const calculateRemainHeight = (otherElementsSelectors: string[]) => {
   // 获取视口总高度
    const viewportHeight = window.innerHeight
    console.log('viewportHeight', viewportHeight)
    
    // 获取 CSS 变量中定义的导航栏高度
    const rootStyle = window.getComputedStyle(document.documentElement)
    const appBarHeight = parseFloat(rootStyle.getPropertyValue('--app-bar-height')) || 0
    const bottomNavHeight = parseFloat(rootStyle.getPropertyValue('--bottom-navigation-height')) || 0
    const navHeight = appBarHeight + bottomNavHeight
    console.log('navHeight', navHeight)
    let usedHeight = 0
    otherElementsSelectors.forEach(selector => {
      const element = document.querySelector(selector) as HTMLElement | null
      if (element) {
        const elementStyle = window.getComputedStyle(element)
        usedHeight += parseFloat(elementStyle.height) || element.offsetHeight
      }
    })
    console.log('usedHeight', usedHeight)
    
    // 预留一些边距
    const margin = 32 // 16px margin top and bottom
    
    // 计算剩余高度
    const remainingHeight = viewportHeight - navHeight - usedHeight - margin
    console.log('remainingHeight', remainingHeight)
    
    // 设置表格滚动高度，确保最小高度
    return Math.max(remainingHeight, 300)
  }


    // 计算视图内剩余高度 去掉导航栏和其他元素的高度
 export  const calculateViewHeight = () => {
   // 获取视口总高度
    const viewportHeight = window.innerHeight
    console.log('viewportHeight', viewportHeight)
    
    // 获取 CSS 变量中定义的导航栏高度
    const rootStyle = window.getComputedStyle(document.documentElement)
    const appBarHeight = parseFloat(rootStyle.getPropertyValue('--app-bar-height')) || 0
    const bottomNavHeight = parseFloat(rootStyle.getPropertyValue('--bottom-navigation-height')) || 0
    const navHeight = appBarHeight + bottomNavHeight
    console.log('navHeight', navHeight)
    
    // 计算剩余高度
    const remainingHeight = viewportHeight - navHeight 
    console.log('viewHeight', remainingHeight)
    
    // 设置表格滚动高度，确保最小高度
    return Math.max(remainingHeight, 300)
  }