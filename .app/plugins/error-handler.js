import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const suppressError = (message) => {
    return (
      message.includes('This `ChildPart` has no `parentNode`') ||
      message.includes("Cannot read properties of null (reading 'enterFrame')")
    )
  }

  window.addEventListener(
    'error',
    (event) => {
      if (event.error && suppressError(event.error.message)) {
        event.preventDefault()
      }
    },
    true,
  )

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      let message = event.reason?.message || ''
      if (typeof event.reason?.toString === 'function') {
        message = event.reason.toString()
      }

      if (suppressError(message)) {
        event.preventDefault()
      }
    },
    true,
  )
})
