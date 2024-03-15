export default defineAppConfig({
  nuxtIcon: {},
  nui: {
    defaultShapes: {},
  },
  mash: {
    title: 'Platform',
    sidebar: {
      toolbar: {
        showNavBurger: true,
        tools: [
          {
            component: 'ThemeToggle',
            props: {
              disableTransitions: true,
            },
          },
          {
            component: 'ToolbarLanguage',
          },
          {
            component: 'ToolbarNotifications',
          },
          {
            component: 'AccountMenu',
            props: {
              horizontal: true,
            },
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'ThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'CircularMenuLanguage',
          },
          {
            component: 'CircularMenuNotifications',
          },
          {
            component: 'CircularMenuSidebar',
          },
        ],
      },
      navigation: {
        logo: {
          component: 'Logo',
          props: { class: 'text-primary-600 h-10' },
        },
        fulllogo: {
          component: 'FullLogo',
          props: { class: 'text-primary-600 h-10' },
        },
        items: [
          {
            title: 'Main Menu',
            icon: { name: 'ph:sidebar-duotone', class: 'w-5 h-5' },
            subsidebar: { component: 'SubsidebarDashboard' },
            activePath: '/user',
          },
          {
            title: 'Customize Experience',
            icon: { name: 'ph:drop-half-bottom-duotone', class: 'w-5 h-5' },
            click: () => {
              const isOpen = useState('switcher-open', () => false)
              isOpen.value = true
            },
            position: 'end',
          },
          {
            title: 'Support',
            icon: { name: 'bx:support', class: 'w-5 h-5' },
            to: '/user/support',
            position: 'end',
            activePath: '/user/support',
          },
          {
            title: 'My Account',
            component: 'AccountMenu',
            position: 'end',
          },
        ],
      },
    },

    collapse: {
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: true,
        tools: [
          {
            component: 'ThemeToggle',
          },
          {
            component: 'ToolbarLanguage',
          },
          {
            component: 'ToolbarNotifications',
          },
          {
            component: 'AccountMenu',
            props: {
              horizontal: true,
            },
          },
        ],
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'ThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'CircularMenuLanguage',
          },
          {
            component: 'CircularMenuNotifications',
          },
          {
            component: 'CircularMenuUser',
          },
        ],
      },
      navigation: {
        enabled: true,
        header: {
          component: 'CollapseNavigationHeader',
        },
        footer: {
          component: 'CollapseNavigationFooter',
        },
      },
    },

    topnav: {
      navigation: {
        enabled: true,
        logo: {
          component: 'Logo',
          props: { class: 'text-primary-600 h-10 w-10' },
        },
        header: {
          component: 'TopnavMenu',
        },
      },
      circularMenu: {
        enabled: true,
        tools: [
          {
            component: 'ThemeToggle',
            props: {
              class: 'ms-auto',
              disableTransitions: true,
              inverted: true,
            },
          },
          {
            component: 'CircularMenuLanguage',
          },
          {
            component: 'CircularMenuNotifications',
          },
          {
            component: 'CircularMenuActivity',
          },
        ],
      },
      toolbar: {
        enabled: true,
        showTitle: false,
        tools: [
          {
            component: 'ThemeToggle',
            props: {
              disableTransitions: true,
            },
          },
          {
            component: 'ToolbarCustomize',
          },
          {
            component: 'ToolbarNotifications',
          },
          {
            component: 'AccountMenu',
            props: {
              horizontal: true,
            },
          },
        ],
      },
      footer: {
        enabled: true,
        logoSeparator: {
          component: 'Logo',
          props: { class: 'text-primary-500 h-7 w-7' },
        },
        logo: {
          component: 'FullLogo',
          props: {
            class:
              'text-muted-300 ltablet:mx-0 mx-auto h-8 transition-all duration-200 lg:mx-0',
          },
        },
        links: [
          {
            name: 'Home',
            to: '/',
          },
          {
            name: 'Terms & Conditions',
            to: '/page/terms',
          },
          {
            name: 'Privacy Policy',
            to: '/page/privacy',
          },
          {
            name: 'About Us',
            to: '/page/about',
          },
        ],
      },
    },
    panels: [
      {
        name: 'language',
        position: 'right',
        component: 'PanelLanguage',
      },
      {
        name: 'news',
        position: 'right',
        component: 'PanelNews',
      },
    ],
    error: {
      logo: {
        component: 'img',
        props: {
          src: '/img/illustrations/system/404-1.svg',
          class: 'relative z-20 w-full max-w-lg mx-auto',
        },
      },
    },
  },
})
