"use client"

import { useEffect, useRef, useState } from "react"
import { initI18n, RTL_LOCALES } from "@/lib/i18n"
import { DirectionProvider } from "@/components/ui/direction"
import i18n from "i18next"

type Dir = "ltr" | "rtl"

function getDir(lang: string): Dir {
  return RTL_LOCALES.has(lang.split("-")[0]) ? "rtl" : "ltr"
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [dir, setDir] = useState<Dir>("ltr")
  const mountedRef = useRef(true)

  const applyDir = (lang: string) => {
    const d = getDir(lang)
    document.documentElement.dir = d
    setDir(d)
  }

  useEffect(() => {
    mountedRef.current = true
    initI18n()
      .then(() => {
        if (mountedRef.current) {
          applyDir(i18n.language ?? "en")
          setReady(true)
        }
      })
      .catch(() => {
        if (mountedRef.current) setReady(true)
      })

    const handler = (lng: string) => applyDir(lng)
    i18n.on("languageChanged", handler)

    return () => {
      mountedRef.current = false
      i18n.off("languageChanged", handler)
    }
  }, [])

  if (!ready) {
    return <div className="min-h-screen bg-background" />
  }

  return <DirectionProvider dir={dir}>{children}</DirectionProvider>
}
