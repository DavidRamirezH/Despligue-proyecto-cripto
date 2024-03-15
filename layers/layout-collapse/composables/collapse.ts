import type { RouteLocationRaw } from 'vue-router'

export interface MashCollapseResolvedConfig {
  name: string
  divider?: boolean
  icon: {
    name: string
    class?: string
  }
  children?: any[]
  component?: {
    name: string
    props?: any
  }
  to?: RouteLocationRaw
  click?: () => void | Promise<void>
  activePath?: string
  /**
   * @default 'start'
   */
  position?: 'start' | 'end'
}

export function useCollapse() {
  const isOpen = useState('collapse-open', () => true)
  const isMobileOpen = useState('collapse-mobile-open', () => false)

  function toggle() {
    // If no sidebar item is selected, open the first one
    const { lg } = useTailwindBreakpoints()
    if (lg.value) {
      isOpen.value = !isOpen.value
    } else {
      isMobileOpen.value = !isMobileOpen.value
    }
  }

  if (process.client) {
    const route = useRoute()
    const { lg, xl } = useTailwindBreakpoints()
    watch(lg, (isLg) => {
      if (isLg) {
        isMobileOpen.value = false
      }
    })
    watch(
      () => route.fullPath,
      () => {
        if (!lg.value) {
          isMobileOpen.value = false
        }
      },
    )
  }

  return {
    toggle,
    isOpen,
    isMobileOpen,
  }
}
