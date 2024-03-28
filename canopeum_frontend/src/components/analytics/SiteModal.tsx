/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import UploadIcon from '@assets/icons/upload.svg'
import type { Sitetreespecies, SiteType } from '@services/api'
import api from '@services/apiInterface'
import { type ChangeEvent, type Dispatch, type DragEvent, type SetStateAction, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  readonly modalId: string,
  readonly siteId: number | undefined,
}

type SiteDto = {
  siteName?: string,
  siteType?: {
    id: number,
    en: string,
    fr: string,
  },
  siteImage?: File,
  dmsLatitude: {
    degrees?: number,
    minutes?: number,
    seconds?: number,
    miliseconds?: number,
    cardinal?: string,
  },
  dmsLongitude: {
    degrees?: number,
    minutes?: number,
    seconds?: number,
    miliseconds?: number,
    cardinal?: string,
  },
  presentation?: string,
  size?: number,
  species: Sitetreespecies[],
  researchPartner?: boolean,
  visibleOnMap?: boolean,
}

const supportedFileTypes = [
  'image/png',
  'image/jpeg',
]

const defaultSiteDto: SiteDto = {
  dmsLatitude: {},
  dmsLongitude: {},
  species: [],
}

const SiteModal = ({ modalId, siteId }: Props) => {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)
  const [site, setSite] = useState<SiteDto>(defaultSiteDto)

  // const fetchSite = async () => {
  //   if (!siteId) return

  //   const site = await api().analytics.site(siteId)
  //   setSiteName(site.name)
  // }

  const modalHide = (event: Event) => {
    event.preventDefault()
  }

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const { files } = event.target
    const file = files?.item(0)
    if (!file || !supportedFileTypes.includes(file.type)) return
    setSite(value => ({ ...value, file }))
    console.log(file)
  }

  useEffect(() => {
    modalRef.current?.addEventListener('hide.bs.modal', modalHide)

    // void fetchSite()

    return () => {
      modalRef.current?.removeEventListener('hide.bs.modal', modalHide)
    }
  }, [])

  useEffect(() => console.log(site), [site])

  const dropHandler = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()

    // Use DataTransferItemList interface to access the file(s)
    const file = event.dataTransfer.files.item(0)
    if (!file) return
    setSite(value => ({ ...value, file }))
    console.log(`file.name = ${file.name}`)
  }

  const renderSiteImage = () => (
    <div id='site-image'>
      <label
        className='w-100 d-flex flex-column justify-content-center align-items-center p-4 gap-3'
        htmlFor='inner-site-image'
        onDragOver={event => event.preventDefault()}
        onDrop={dropHandler}
        style={{ border: 'var(--bs-border-width) dashed var(--bs-primary)' }}
      >
        <img alt='' src={UploadIcon} />
        <div className='btn btn-outline-primary'>Upload</div>
        <div>{t('analytics.site-modal.site-image-upload')}</div>
      </label>
      <input
        accept={supportedFileTypes.join(',')}
        className='d-none'
        id='inner-site-image'
        onChange={event => handleFileChange(event)}
        type='file'
        value={site.siteImage?.name}
      />
    </div>
  )

  return (
    <div
      aria-hidden='true'
      aria-labelledby={`${modalId}-label`}
      className='modal fade'
      id={modalId}
      ref={modalRef}
      tabIndex={-1}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5 text-capitalize m-auto' id={`${modalId}-label`}>
              {t('analytics.site-modal.create-site')}
            </h1>
          </div>
          <div className='modal-body'>
            <form>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-name'>{t('analytics.site-modal.site-name')}</label>
                <input
                  className='form-control'
                  id='site-name'
                  onChange={event => setSite(value => ({ ...value, siteName: event.target.value }))}
                  type='text'
                  value={site.siteName}
                />
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-type'>{t('analytics.site-modal.site-type')}</label>
                <select className='form-select' id='site-type' value={site.siteType?.id} />
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-image'>{t('analytics.site-modal.site-type')}</label>
                {renderSiteImage()}
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-coordinates'>
                  {t('analytics.site-modal.site-gps-coordinates')}
                </label>
                <div id='site-coordinates'>
                  <div className='mb-2 ms-2'>
                    <label className='form-label' htmlFor='site-dms-latitude'>
                      {t('analytics.site-modal.site-dms-latitude')}
                    </label>
                    <div className='d-flex gap-1' id='site-dms-latitude'>
                      <input
                        className='form-control'
                        id='site-dms-latitude-ddd'
                        onChange={event =>
                          setSite(value => ({
                            ...value,
                            dmsLatitude: { ...site.dmsLatitude, degrees: Number(event.target.value) },
                          }))}
                        style={{ width: '5rem' }}
                        type='number'
                        value={site.dmsLatitude.degrees}
                      />
                      <span>°</span>
                      <input
                        className='form-control'
                        id='site-dms-latitude-mm'
                        onChange={event =>
                          setSite(value => ({
                            ...value,
                            dmsLatitude: { ...site.dmsLatitude, minutes: Number(event.target.value) },
                          }))}
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span>'</span>
                      <input
                        className='form-control'
                        id='site-dms-latitude-ss'
                        onChange={event =>
                          setSite(value => ({
                            ...value,
                            dmsLatitude: { ...site.dmsLatitude, seconds: Number(event.target.value) },
                          }))}
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span className='d-flex align-items-end'>.</span>
                      <input
                        className='form-control'
                        id='site-dms-latitude-ssss'
                        onChange={event =>
                          setSite(value => ({
                            ...value,
                            dmsLatitude: { ...site.dmsLatitude, miliseconds: Number(event.target.value) },
                          }))}
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span>"</span>
                      <div className='d-flex gap-1 align-items-center text-center'>
                        <input
                          className='form-check-input'
                          id='site-dms-latitude-cardinal-n'
                          name='site-dms-latitude-cardinal'
                          onChange={_ =>
                            setSite(value => ({
                              ...value,
                              dmsLatitude: { ...site.dmsLatitude, cardinal: 'N' },
                            }))}
                          type='radio'
                        />
                        <label className='form-check-label' htmlFor='site-dms-latitude-cardinal-n'>
                          N
                        </label>
                        <input
                          className='form-check-input'
                          id='site-dms-latitude-cardinal-s'
                          name='site-dms-latitude-cardinal'
                          onChange={_ =>
                            setSite(value => ({
                              ...value,
                              dmsLatitude: { ...site.dmsLatitude, cardinal: 'S' },
                            }))}
                          type='radio'
                        />
                        <label className='form-check-label' htmlFor='site-dms-latitude-cardinal-s'>
                          S
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='mb-2 ms-2'>
                    <label className='form-label' htmlFor='site-dms-longitude'>
                      {t('analytics.site-modal.site-dms-longitude')}
                    </label>
                    <div className='d-flex gap-1' id='site-dms-latitude'>
                      <input
                        className='form-control'
                        id='site-dms-longitude-ddd'
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span>°</span>
                      <input
                        className='form-control'
                        id='site-dms-longitude-mm'
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span>'</span>
                      <input
                        className='form-control'
                        id='site-dms-longitude-ss'
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span className='d-flex align-items-end'>.</span>
                      <input
                        className='form-control'
                        id='site-dms-longitude-ssss'
                        style={{ width: '5rem' }}
                        type='number'
                      />
                      <span>"</span>
                      <div className='d-flex gap-1 align-items-center text-center'>
                        <input
                          className='form-check-input'
                          id='site-dms-longitude-cardinal-n'
                          name='site-dms-longitude-cardinal'
                          type='radio'
                        />
                        <label className='form-check-label' htmlFor='site-dms-longitude-cardinal-n'>
                          W
                        </label>
                        <input
                          className='form-check-input'
                          id='site-dms-longitude-cardinal-s'
                          name='site-dms-longitude-cardinal'
                          type='radio'
                        />
                        <label className='form-check-label' htmlFor='site-dms-longitude-cardinal-s'>
                          E
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-name'>{t('analytics.site-modal.site-presentation')}</label>
                <textarea
                  className='form-control'
                  id='site-presentation'
                  onChange={event => setSite(value => ({ ...value, presentation: event.target.value }))}
                  value={site.presentation}
                />
              </div>
              <div className='mb-3'>
                <label className='form-label' htmlFor='site-name'>{t('analytics.site-modal.site-size')}</label>
                <div className='input-group'>
                  <input
                    className='form-control'
                    id='site-size'
                    onChange={event => setSite(value => ({ ...value, size: Number(event.target.value) }))}
                    type='number'
                    value={site.size}
                  />
                  <span className='input-group-text'>ft²</span>
                </div>
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button className='btn btn-outline-primary' data-bs-dismiss='modal' type='button'>Close</button>
            <button className='btn btn-primary' type='button'>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SiteModal
