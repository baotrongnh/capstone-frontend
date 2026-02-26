import { APP_NAME, DEFAULT_LOCALE } from '@/constants'
import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

export default getRequestConfig(async () => {
     const cookiesLocale = (await cookies()).get(`${APP_NAME}_LOCALE`)?.value || DEFAULT_LOCALE
     const locale = cookiesLocale

     return {
          locale,
          messages: (await import(`../../messages/${locale}.json`)).default
     }
})