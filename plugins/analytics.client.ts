export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const gtagId = config.public.gtagId

  if (!gtagId) {
    return
  }

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`
  document.head.appendChild(script)

  const win = window as any
  win.dataLayer = win.dataLayer || []
  function gtag(...args: any[]) {
    // eslint-disable-next-line prefer-rest-params
    win.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', gtagId)
})
