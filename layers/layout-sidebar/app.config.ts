export default defineAppConfig({
  mash: {
    sidebar: {
      circularMenu: {
        enabled: false,
        tools: [],
      },
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: false,
        tools: [],
      },
      navigation: {
        enabled: true,
        startOpen: true,
        logo: {
          component: 'MashLogo',
          props: { class: 'text-primary-600 h-10' },
        },
        items: [],
      },
    },
  },
})
