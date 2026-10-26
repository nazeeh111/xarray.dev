'use client'
import { useLingui } from '@lingui/react/macro'
import { i18n } from '@lingui/core'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Button,
} from '@chakra-ui/react'

function useLocales() {
  const { t } = useLingui()
  return [
    { locale: 'en', label: t`English` },
    { locale: 'es', label: t`Spanish` },
    { locale: 'pt', label: t`Portuguese` },
  ]
}

function getLocaleLabel(locale, locales) {
  const localeObject = locales.find((object) => object.locale === locale)
  return localeObject ? localeObject.label : locale
}

export const LanguageSwitcher = () => {
  const router = useRouter()
  const pathname = usePathname()
  const locales = useLocales()

  async function changeLocale() {
    const localeString = i18n.locale
    localStorage.setItem('locale', localeString)
    const catalog = await import(`../locales/${localeString}/messages.js`)
    i18n.load(localeString, catalog.messages)
    i18n.activate(localeString)
  }

  useEffect(() => {
    const storedLocale = localStorage.getItem('locale')
    if (storedLocale && storedLocale !== router.locale) {
      changeLocale()
    }
  }, [])
  return (
    <Menu>
      <MenuButton as={Button} size='xs' variant='outline'>
        {getLocaleLabel(i18n.locale, locales)}
      </MenuButton>
      <MenuList>
        {locales.map((object) => (
          <Link
            key={object.locale}
            href={'/' + object.locale + pathname}
            onClick={changeLocale}
          >
            <MenuItem
              key={object.locale}
              as={Button}
              size='xs'
              command={object.locale}
            >
              {object.label}
            </MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  )
}
