// TODO: Triển khai i18n xong thì viết hooks vào đây.
export default function useLanguage() {
  function foo(bar: string) {}
  return ['en', foo] as [string, typeof foo]
}

/*
import i18next from 'i18next'

export default function useLanguage(): [string | undefined, (language: string) => void] {
  const language = i18next.language || window.localStorage.i18nextLng
  const setLanguage = (language: string) => {
    i18next.changeLanguage(language, err => {
      if (err) throw err
    })
  }
  return [language, setLanguage]
}
*/
