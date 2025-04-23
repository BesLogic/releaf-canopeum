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

  useEffect(
    () =>
      void initForm().catch(() =>
        console.error('Oops an error occured during initialization of the form')
      ),
    [open, form.reset],
  )

  const initForm = async () => {
    if (siteId) {
      setLoading(true)
      await getApiClient().siteClient.detail(siteId).then(async (site: Site) => {
        const siteForm = await transformToEditSiteDto(site)
        form.reset(siteForm)
      }).catch(() =>
        displayUnhandledAPIError(
          'errors.fetch-site-failed',
        )
      )
      setLoading(false)
    } else {
      setLoading(false)
      form.reset(DEFAULT_SITE_FORM_DTO)
    }
  }

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

  if (loading) {
    return <CircularProgress color='secondary' />
  }

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      onClose={(_, reason) => handleClose(reason)}
      open={open}
    >
      <DialogTitle>
        {t(
          siteId
            ? 'analytics.edit-site-info'
            : 'analytics.create-site',
        )}
      </DialogTitle>

      <form className='d-flex flex-column gap-3' onSubmit={form.handleSubmit(handleSubmitSite)}>
        <DialogContent>
          <SiteForm
            availableSiteTypes={availableSiteTypes}
            form={form}
          />
        </DialogContent>

        <DialogActions>
          <button
            className='btn btn-outline-primary'
            onClick={() => handleClose('cancel')}
            type='button'
          >
            {t('generic.cancel')}
          </button>
          <button
            className='btn btn-primary'
            type='submit'
          >
            {t('generic.submit')}
          </button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
export default SiteModal
