import type { ReactNode } from 'react'

type Props = {
  readonly children: ReactNode,
  readonly bgColor?: string,
}

const IconBadge = (props: Props) => {
  const bgColor = props.bgColor === ''
    ? ''
    : `text-bg-${props.bgColor ?? 'primary'}`

  return (
    <div
      className={`${bgColor} text-center rounded-circle`}
      // If we ever need to parametrize the size, consider dealing with this and "font-size" at once
      style={{ height: '2em', width: '2em', minWidth: '2em' }}
    >
      {props.children}
    </div>
  )
}

export default IconBadge
