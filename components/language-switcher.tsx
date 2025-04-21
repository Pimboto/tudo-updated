//components\language-switcher.tsx
"use client"

import { usePathname, useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import Cookies from "js-cookie"

interface LanguageSwitcherProps {
  className?: string
  currentLang?: string  // Hacemos este prop opcional
  variant?: "light" | "dark"
}

export default function LanguageSwitcher({ className = "", currentLang = "en", variant = "dark" }: LanguageSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  // Agregamos una verificación de seguridad y un valor predeterminado
  const [displayLang, setDisplayLang] = useState(currentLang ? currentLang.toUpperCase() : "EN")

  useEffect(() => {
    // También aquí añadimos una verificación de seguridad
    if (currentLang) {
      setDisplayLang(currentLang.toUpperCase())
    }
  }, [currentLang])

  const handleLanguageChange = (locale: string) => {
    // Actualizar la cookie
    Cookies.set("NEXT_LOCALE", locale)

    // Redirigir a la misma página pero con el nuevo locale
    const newPathname = pathname.replace(/^\/[^/]+/, `/${locale}`)
    router.push(newPathname)
  }

  // Determinar colores basados en la variante
  const textColor = variant === "dark" ? "text-white" : "text-gray-800"
  const hoverTextColor = variant === "dark" ? "hover:text-gray-300" : "hover:text-gray-600"
  const dropdownBgColor = variant === "dark" ? "bg-black/80" : "bg-white/90"
  const dropdownTextColor = variant === "dark" ? "text-white" : "text-gray-800"
  const dropdownHoverBgColor = variant === "dark" ? "hover:bg-white/10" : "hover:bg-gray-100"

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger
          className={`flex items-center ${textColor} ${hoverTextColor} transition-colors ${className}`}
        >
          <Globe className="h-4 w-4 mr-1" />
          <span>{displayLang}</span>
        </DropdownMenuTrigger>
        {/* Force the dropdown to always appear at a very high z-index */}
        <DropdownMenuContent 
          align="end" 
          className={`${dropdownBgColor} backdrop-blur-md border-gray-200`}
          // This style prop overrides any z-index from the library's default styling
          style={{ zIndex: 9999 }}
          sideOffset={8}
        >
          <DropdownMenuItem
            className={`${dropdownTextColor} ${dropdownHoverBgColor} cursor-pointer`}
            onClick={() => handleLanguageChange("en")}
          >
            English
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`${dropdownTextColor} ${dropdownHoverBgColor} cursor-pointer`}
            onClick={() => handleLanguageChange("es")}
          >
            Español
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
