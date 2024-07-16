import { customIcons, type CustomIconType } from './customIconList'

// These sizes match the custom icon scss sizes determined in App.scss
export type IconSize =
  // Sort them by size
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

type Props = {
  readonly icon: CustomIconType,
  readonly size?: IconSize,
}

// TODO(NicolasDontigny): Find the best way to set the svg's fill color
// This is currently not possible using the <img> tag in the CustomIcon component
const CustomIcon = ({ icon, size }: Props) => {
  let iconClassName = 'custom-icon'
  if (size) {
    iconClassName += ` icon-${size}`
  }

  return <img alt={icon} className={iconClassName} src={customIcons[icon]} />
}

export default CustomIcon
