import type { MashToaster } from '#components'
import type {
  DefaultProps,
  NinjaToasterBaseProps,
} from '@cssninja/nuxt-toaster'

// This type infer the props of MashToaster component
type MashToasterProps = Omit<
  InstanceType<typeof MashToaster>['$props'],
  keyof DefaultProps
>

export function useToaster() {
  const $nt = useNinjaToaster()

  /**
   * Display a MashToaster component
   */
  function show(props: MashToasterProps, options?: NinjaToasterBaseProps) {
    return $nt.showComponent('MashToaster', {
      props,
      options,
    })
  }

  return {
    show,
    clear: $nt.clear,
    clearAll: $nt.clearAll,
  }
}
