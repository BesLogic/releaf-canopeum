import './SiteSocialHeader.scss'

import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { LanguageContext } from '@components/context/LanguageContext'
import ToggleSwitch from '@components/inputs/ToggleSwitch'
import PrimaryIconBadge from '@components/PrimaryIconBadge'
import useApiClient from '@hooks/ApiClientHook'
import type { PageViewMode } from '@models/types/PageViewMode.Type'
import { PatchedUpdateSitePublicStatus, type SiteSocial, User } from '@services/api'
import { getApiBaseUrl } from '@services/apiSettings'
import { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly viewMode: PageViewMode,
  readonly site: SiteSocial,
}

const SiteSocialHeader = ({ site, viewMode }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const { currentUser, updateUser } = useContext(AuthenticationContext)
  const { getApiClient } = useApiClient()

  const [isFollowing, setIsFollowing] = useState<boolean | undefined>()
  const [isPublic, setIsPublic] = useState(!!site.isPublic)

  useEffect(() => setIsFollowing(currentUser?.followedSiteIds.includes(site.id)), [
    currentUser?.followedSiteIds,
    site.id,
  ])

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
            backgroundImage: `url('${getApiBaseUrl() + site.image.asset}')`,
          }}
        />

        <div className='card-body'>
          <div className='d-flex flex-row justify-content-between align-items-start gap-3'>
            <h1 className='fw-bold card-title'>{site.name}</h1>

            <div className='
              d-flex
              align-items-center
              column-gap-3
              row-gap-2
              flex-wrap
              justify-content-end'>
              {viewMode === 'admin' && (
                <ToggleSwitch
                  additionalClassNames='fs-4'
                  checked={isPublic}
                  onChange={toggleSitePublicStatus}
                  text={translate('social.site-social-header.public')}
                />
              )}

              {currentUser && currentUser.role !== 'MegaAdmin' && isFollowing !== undefined && (
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

          <div className='card-text d-flex flex-row align-items-center gap-1'>
            <PrimaryIconBadge type='school' />
            <h4 className='fw-bold text-primary mb-0'>{translateValue(site.siteType)}</h4>
          </div>

          <p className='card-text mt-2'>{site.description ?? ''}</p>

          <div className='fw-bold'>
            <div className='mb-2'>
              <span className='material-symbols-outlined align-middle'>person</span>
              <span>{translate('social.site-social-header.sponsors')}:</span>
            </div>
            <div className='row'>
              {site.sponsors.map(sponsorName => (
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-3' key={sponsorName}>
                  {sponsorName}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteSocialHeader
