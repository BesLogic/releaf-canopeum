import { CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import SiteForm from '@components/analytics/site-modal/SiteForm'
import { DEFAULT_SITE_FORM_DTO, transformToEditSiteDto } from '@components/analytics/site-modal/siteModal.model'
import useApiClient from '@hooks/ApiClientHook'
import useErrorHandling from '@hooks/ErrorHandlingHook'
import { type DefaultCoordinate, defaultLatitude, defaultLongitude } from '@models/Coordinate'
import type { Site, SiteType, Species } from '@services/api'

type Props = {
  readonly open: boolean,
  readonly handleClose: (
    reason: 'backdropClick' | 'escapeKeyDown' | 'save' | 'cancel',
    data?: SiteFormDto,
  ) => void,
  readonly siteId: number | undefined,
}

export type SiteFormDto = {
  siteName?: string,
  siteType?: number,
  siteImage?: File,
  dmsLatitude: DefaultCoordinate,
  dmsLongitude: DefaultCoordinate,
  presentation?: string,
  size?: number,
  species: Species[],
  researchPartner?: boolean,
  visibleOnMap?: boolean,
}

const defaultSiteFormDto: SiteFormDto = {
  dmsLatitude: defaultLatitude,
  dmsLongitude: defaultLongitude,
  species: [],
  researchPartner: true,
  visibleOnMap: true,
}

const SiteModal = ({ open, handleClose, siteId }: Props) => {
  const { t } = useTranslation()
  const { getApiClient } = useApiClient()
  const { displayUnhandledAPIError } = useErrorHandling()

  const [loading, setLoading] = useState(true)
  const [availableSiteTypes, setAvailableSiteTypes] = useState<SiteType[]>([])

  const form = useForm<SiteFormDto>({
    mode: 'onTouched',
    defaultValues: defaultSiteFormDto,
    shouldFocusError: true,
  })

  useEffect(() => void fetchSiteTypes(), [])

  // init form
  useEffect(
    () => {
      if (siteId) {
        setLoading(true)
        getApiClient()
          .siteClient
          .detail(siteId)
          .then(async (site: Site) => form.reset(await transformToEditSiteDto(site)))
          .catch(() => displayUnhandledAPIError('errors.fetch-site-failed'))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
        form.reset(DEFAULT_SITE_FORM_DTO)
      }
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps
    -- You'd think we'd want to re-run this hook on siteId change.
    But somewhow siteId is updated on modal closing and that doesn't update the form fields.
    */
    [open],
  )

  const handleSubmitSite = () => handleClose('save', form.watch())

  const fetchSiteTypes = async () => {
    try {
      setLoading(true)
      const siteTypes = await getApiClient().siteClient.types()
      setAvailableSiteTypes(siteTypes)
    } catch {
      displayUnhandledAPIError('errors.fetch-site-types-failed')
    } finally {
      setLoading(false)
    }
  }

  const formId = `site-form-${String(siteId)}`

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      onClose={(_, reason) => handleClose(reason)}
      open={open}
    >
      {loading
        ? <CircularProgress color='secondary' sx={{ margin: 'auto' }} />
        : (
          <>
            <DialogTitle>
              {t(
                siteId
                  ? 'analytics.edit-site-info'
                  : 'analytics.create-site',
              )}
            </DialogTitle>

            <DialogContent>
              <SiteForm
                availableSiteTypes={availableSiteTypes}
                form={form}
                formId={formId}
              />
            </DialogContent>

            <DialogActions>
              <button
                className='btn btn-outline-primary'
                form={formId}
                onClick={() => handleClose('cancel')}
                type='button'
              >
                {t('generic.cancel')}
              </button>
              <button
                className='btn btn-primary'
                onClick={form.handleSubmit(handleSubmitSite)}
                type='button'
              >
                {t('generic.submit')}
              </button>
            </DialogActions>
          </>
        )}
    </Dialog>
  )
}
export default SiteModal
