declare module '*.png' {
  const value: string
  export = value
}

declare module '*.json' {
  const value: string
  export = value
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

declare module '*.gif' {
  const value: string
  export = value
}
