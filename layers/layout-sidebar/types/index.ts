import type { CustomAppConfig } from '@nuxt/schema'

export type MashConfig = NonNullable<CustomAppConfig['tairo']>

export type SidebarConfig = NonNullable<MashConfig['sidebar']>
export type SidebarToolbarConfig = NonNullable<SidebarConfig['toolbar']>
export type SidebarCircularMenuConfig = NonNullable<
  SidebarConfig['circularMenu']
>
export type SidebarNavigationConfig = NonNullable<SidebarConfig['navigation']>
export type SidebarNavigationLogoConfig = NonNullable<
  SidebarNavigationConfig['logo']
>

export type SidebarNavigationItemConfig = NonNullable<
  SidebarNavigationConfig['items']
>[number]
