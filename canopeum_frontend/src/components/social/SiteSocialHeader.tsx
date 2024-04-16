import { LanguageContext } from '@components/context/LanguageContext'
import ToggleSwitch from '@components/inputs/ToggleSwitch'
import PrimaryIconBadge from '@components/PrimaryIconBadge'
import type { PageViewMode } from '@models/types/PageViewMode'
import type { SiteSocial } from '@services/api'
import getApiClient from '@services/apiInterface'
import { getApiBaseUrl } from '@services/apiSettings'
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'

type Props = {
  readonly viewMode: PageViewMode,
  readonly site: SiteSocial,
}

const updateSiteIsPublic = async (_: boolean) => {
  // TODO Implement site update when backend is ready
}

const SiteSocialHeader = ({ site, viewMode }: Props) => {
  const { t: translate } = useTranslation()
  const { translateValue } = useContext(LanguageContext)
  const [isPublic, setIsPublic] = useState(true)
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>()

  const fetchIsFollowing = useCallback(
    async () => setIsFollowing(await getApiClient().siteClient.isFollowing(site.id)),
    [site, setIsFollowing]
  )

  useEffect(() => void updateSiteIsPublic(isPublic), [isPublic])

  useEffect(() => void fetchIsFollowing(), [fetchIsFollowing])

  const onFollowClick = async () => {
    if (isFollowing) {
      await getApiClient().siteClient.unfollow(site.id)
      setIsFollowing(false)
    } else {
      await getApiClient().siteClient.follow(site.id)
      setIsFollowing(true)
    }
  }

  return (
    <div className='card'>
      <div className='row g-0'>
        <div
          className='col-md-4'
          style={{
            backgroundImage: `url('${getApiBaseUrl() + site.image.asset}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* TODO: Fixing type asset */}
        </div>
        <div className='col-md-8'>
          <div className='card-body'>
            <div className='d-flex flex-row justify-content-between align-items-center'>
              <h1 className='fw-bold card-title'>{site.name}</h1>
              {viewMode === 'user' && isFollowing !== undefined && (
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
              {viewMode === 'admin' && (
                <ToggleSwitch
                  additionalClassNames='fs-4'
                  checked={isPublic}
                  onChange={setIsPublic}
                  text={translate('social.site-social-header.public')}
                />
              )}
            </div>
            <div className='card-text d-flex flex-row align-items-center gap-1'>
              <PrimaryIconBadge type='school' />
              <h4 className='fw-bold text-primary mb-0'>{translateValue(site.siteType)}</h4>
            </div>
            <p className='card-text mt-2'>{site.description ?? ''}</p>
            <div className='container fw-bold'>
              <div className='mb-2'>
                <span className='material-symbols-outlined align-middle'>person</span>
                <span>{translate('social.site-social-header.sponsors')}:</span>
              </div>
              <div className='row'>
                {site.sponsors.map(sponsorName => (
                  <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-3' key={sponsorName}>{sponsorName}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiteSocialHeader
