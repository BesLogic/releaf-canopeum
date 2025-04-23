import { type Dispatch, type SetStateAction, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import SiteSponsorProgress from '@components/analytics/SiteSponsorProgress'
import SiteSummaryActions from '@components/analytics/SiteSummaryActions'
import { AuthenticationContext } from '@components/context/AuthenticationContext'
import CustomIcon from '@components/icons/CustomIcon'
import IconBadge from '@components/icons/IconBadge'
import SiteTypeIcon from '@components/icons/SiteTypeIcon'
import { appRoutes } from '@constants/routes.constant'
import type { SiteSummary, User } from '@services/api'

type Props = {
  readonly site: SiteSummary,
  readonly admins: User[],
  readonly onSiteChange: Dispatch<SetStateAction<SiteSummary[]>>,
  readonly onSiteEdit: (siteId: number) => void,
}

const SiteSummaryCard = ({ site, admins, onSiteChange, onSiteEdit }: Props) => {
  const { t: translate } = useTranslation()
  const { currentUser } = useContext(AuthenticationContext)

  const siteAdminsDisplay = site.admins.length > 0
    ? site.admins.map(admin => admin.user.username).join(', ')
    : translate('analytics.site-summary.no-admins')

  return (
    <div
      className='col-12 col-md-6 col-xl-4 col-xxl-3'
      key={site.name}
    >
      <div className='card h-100 w-100'>
        <div className='card-body d-flex flex-column h-100'>
          <div className='d-flex justify-content-between align-items-center card-title'>
            <Link
              className='nav-link me-2 d-flex gap-1 align-items-center'
              // idk why just 100% still goes over the card length, so adjust for icon size ?
              style={{ width: 'calc(100% - 2em)' }}
              to={appRoutes.site(site.id)}
            >
              <IconBadge>
                <SiteTypeIcon siteTypeId={site.siteType.id} />
              </IconBadge>
              <h5 className='mb-0 text-ellipsis'>{site.name}</h5>
            </Link>

            {currentUser?.role === 'MegaAdmin' &&
              (
                <SiteSummaryActions
                  admins={admins}
                  onSiteChange={onSiteChange}
                  onSiteEdit={onSiteEdit}
                  siteSummary={site}
                />
              )}
          </div>

          <div className='card-subtitle my-1'>
            <div className='d-flex align-items-center gap-1 text-muted'>
              <span className='material-symbols-outlined fill-icon'>location_on</span>
              <span className='text-ellipsis'>
                {site.coordinate.address ?? translate('analytics.site-summary.unknown')}
              </span>
            </div>
            <div className='d-flex align-items-center gap-1 text-muted'>
              <span className='material-symbols-outlined fill-icon'>person</span>
              <span className='text-ellipsis'>{siteAdminsDisplay}</span>
            </div>
          </div>

          <div className='card-text mt-2'>
            <div className='row my-2'>
              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='
                  bg-lightgreen
                  rounded-circle
                  d-flex
                  justify-content-center
                  align-items-center
                  p-2
                '>
                  <CustomIcon icon='sitePlantedIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.plantCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.planted')}</span>
              </div>

              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='
                  bg-lightgreen
                  rounded-circle
                  d-flex
                  justify-content-center
                  align-items-center
                  p-2'>
                  <CustomIcon icon='siteSurvivedIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.survivedCount}</span>
                <span className='text-muted'>{translate('analytics.site-summary.survived')}</span>
              </div>

              <div className='col-4 d-flex flex-column align-items-center'>
                <div className='
                  bg-lightgreen
                  rounded-circle
                  d-flex
                  justify-content-center
                  align-items-center
                  p-2'>
                  <CustomIcon icon='sitePropagationIcon' size='xl' />
                </div>
                <span className='text-primary fs-4 fw-bold'>{site.propagationCount}</span>
                <span className='text-muted'>
                  {translate('analytics.site-summary.propagation')}
                </span>
              </div>
            </div>

            <div className='mt-4'>
              <SiteSponsorProgress progress={site.sponsorProgress} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SiteSummaryCard
