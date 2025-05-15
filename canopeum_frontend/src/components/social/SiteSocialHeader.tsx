import './SiteSocialHeader.scss'

import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import IconBadge from '@components/icons/IconBadge'
import SiteTypeIcon from '@components/icons/SiteTypeIcon'
import ToggleSwitch from '@components/inputs/ToggleSwitch'
import SiteHeaderSponsors from '@components/SiteHeaderSponsors'
import { appRoutes } from '@constants/routes.constant'
import useApiClient from '@hooks/ApiClientHook'
import type { PageViewMode } from '@models/PageViewMode.type'
import { PatchedUpdateSitePublicStatus, type SiteSocial, User } from '@services/api'
import type { ExcludeFunctions } from '@utils/types'

type Props = {
  readonly viewMode: PageViewMode,
  readonly site: ExcludeFunctions<SiteSocial>,
}

const SiteSocialHeader = ({ site, viewMode }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { currentUser, updateUser } = useContext(AuthenticationContext)
  const { getApiClient } = useApiClient()

  const [isFollowing, setIsFollowing] = useState<boolean | undefined>()
  const [isPublic, setIsPublic] = useState(!!site.isPublic)

  useEffect(
    () => setIsFollowing(currentUser?.followedSiteIds.includes(site.id)),
    [currentUser?.followedSiteIds, site.id],
  )

  useEffect(() => setIsPublic(!!site.isPublic), [site])

  const onFollowClick = async () => {
    if (!currentUser) return

    if (isFollowing) {
      await getApiClient().siteClient.unfollow(site.id)
      setIsFollowing(false)
      updateUser(
        new User({
          ...currentUser,
          followedSiteIds: currentUser.followedSiteIds.filter(id => id !== site.id),
        }),
      )
    } else {
      await getApiClient().siteClient.follow(site.id)
      setIsFollowing(true)
      updateUser(
        new User({
          ...currentUser,
          followedSiteIds: [...currentUser.followedSiteIds, site.id],
        }),
      )
    }
  }

  const toggleSitePublicStatus = async () => {
    const newPublicStatus = !isPublic

    const patchPublicStatusRequest = new PatchedUpdateSitePublicStatus({
      isPublic: newPublicStatus,
    })
    const updatedPublicStatus = await getApiClient().socialClient.updatePublicStatus(
      site.id,
      patchPublicStatusRequest,
    )

    setIsPublic(updatedPublicStatus.isPublic)
  }

  return (
    <div className='card border-0'>
      <div className='site-social-header-card'>
        <div
          className='site-social-image'
          style={{
            backgroundImage: `url('${import.meta.env.VITE_API_URL}${site.image.asset}')`,
          }}
        />

        <div className='card-body d-flex flex-column gap-4'>
          <div>
            <div className='d-flex flex-row justify-content-between align-items-center gap-3'>
              <h1 className='card-title mb-0'>{site.name}</h1>

              <div className='
                d-flex
                align-items-center
                column-gap-3
                row-gap-2
                flex-wrap
                justify-content-end
              '>
                {viewMode === 'admin' && (
                  <ToggleSwitch
                    additionalClassNames='fs-4'
                    checked={isPublic}
                    id='social.site-social-header.public'
                    onChange={toggleSitePublicStatus}
                    text={translate('social.site-social-header.public')}
                  />
                )}

                {currentUser
                  && currentUser.role !== 'MegaAdmin'
                  && isFollowing !== undefined
                  && (
                    <button
                      className='btn btn-secondary'
                      onClick={onFollowClick}
                      type='button'
                    >
                      {isFollowing
                        ? translate('social.site-social-header.unfollow')
                        : translate('social.site-social-header.follow')}
                    </button>
                  )}
              </div>
            </div>

            <div className='d-flex align-items-center gap-2'>
              <IconBadge>
                <SiteTypeIcon siteTypeId={site.siteType.id} />
              </IconBadge>
              <h4 className='fw-bold text-primary mb-0'>{translateValue(site.siteType)}</h4>
            </div>

            <Link
              className='d-inline-block text-muted mt-1 link-inner-underline'
              to={{ pathname: appRoutes.map, search: `site=${site.id}` }}
            >
              <span className='
                material-symbols-outlined
                fill-icon
                align-top
                me-1
                text-decoration-none
              '>
                location_on
              </span>
              <span>{site.coordinate.address ?? translate('analytics.site-summary.unknown')}</span>
            </Link>
          </div>

          <p className='card-text mt-2'>{site.description ?? ''}</p>

          <SiteHeaderSponsors sponsors={site.sponsors} />
        </div>
      </div>
    </div>
  )
}

export default SiteSocialHeader
