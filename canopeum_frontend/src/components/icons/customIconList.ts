import sitePlantedIcon from '../../assets/icons/site-planted.svg'
import sitePropagationIcon from '../../assets/icons/site-propagation.svg'
import siteSurvivedIcon from '../../assets/icons/site-survived.svg'
import siteTypeCanopeumIcon from '../../assets/icons/site-type-canopeum.svg'
import siteVisitorsIcon from '../../assets/icons/site-visitors.svg'

export const customIcons = {
  sitePlantedIcon,
  siteSurvivedIcon,
  sitePropagationIcon,
  siteVisitorsIcon,
  siteTypeCanopeumIcon,
}

export type CustomIconType = keyof typeof customIcons
