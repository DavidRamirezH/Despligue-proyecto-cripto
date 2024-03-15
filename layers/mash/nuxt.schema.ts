export default defineNuxtSchema({
  appConfig: {
    mash: {
      title: 'Mash',
      error: {
        logo: {
          component: 'MashLogo',
          props: {},
        },
      },
      panels: {
        $schema: {
          type: 'array',
          items: {
            type: 'object',
            required: ['name', 'component'],
            properties: {
              name: { type: 'string' },
              position: {
                type: 'string',
                tsType: "'left' | 'right'",
                $default: 'left',
              },
              component: { type: 'string' },
              props: { type: 'object' },
              overlay: { type: 'boolean', $default: true },
            },
          },
        },
      },
    },
  },
})
