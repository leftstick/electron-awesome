export function makeid(length: number): string {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_0123456789'
  const first = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    if (i === 0) {
      result.push(first.charAt(Math.floor(Math.random() * charactersLength)))
      continue
    }
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

export function isString(obj: any) {
  return Object.prototype.toString.call(obj) === '[object String]'
}

export function isEmpty(obj?: any) {
  return obj === null || obj === undefined
}

export function isIp(ipaddress: string) {
  if (
    // eslint-disable-next-line max-len
    /^(?=.*[^.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/.test(ipaddress)
  ) {
    return true
  }
  return false
}

const SPECIAL_DOMAINS = ['localhost', 'broadcasthost']

export function isDomains(domains: string) {
  const reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
  const vals = domains.split(' ').map((val) => val.trim())

  return vals.every((val) => reg.test(val) || SPECIAL_DOMAINS.includes(val))
}

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  return keys.reduce((p, c) => {
    p[c] = (obj as T)[c]
    return p
  }, {} as Pick<T, K>)
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  if (!obj) {
    return obj
  }

  return (Object.keys(obj) as K[])
    .filter((k) => !keys.includes(k))
    .reduce((p, c) => {
      // @ts-ignore
      p[c] = obj[c]
      return p
    }, {} as Omit<T, K>)
}
