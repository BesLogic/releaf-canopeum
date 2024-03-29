import { customIcons } from './customIconList'

export type IconName = keyof typeof customIcons

// Props can vary from project to project, some will require to have some specific variant passed for styling,
// others will extend base css classes with custom prop class etc

type Props = {
  readonly icon: IconName,
  readonly size?: string,
}

/**
 * @param icon string key icon name
 * @param className string classes for styling
 * @param rotate optional number rotation of the icon
 * @returns Icon react component
 */
export const Icon = ({ icon, size }: Props) => {
  let iconClassName = 'custom-icon'
  if (size) {
    iconClassName += ` icon-${size}`
  }

  return <img alt={icon} className={iconClassName} src={customIcons[icon]} />
}
