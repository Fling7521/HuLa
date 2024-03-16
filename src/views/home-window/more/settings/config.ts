/* 侧边栏选项 */
const sideOptions = ref<OPT.L.SettingSide[]>([
  {
    url: '/general',
    label: '通用',
    icon: 'setting-config'
  },
  {
    url: '/remind',
    label: '消息通知',
    icon: 'remind'
  },
  {
    url: '/collection',
    label: '存储管理',
    icon: 'mini-sd-card'
  },
  {
    url: '/loginSetting',
    label: '登录设置',
    icon: 'settings'
  }
])

export { sideOptions }
