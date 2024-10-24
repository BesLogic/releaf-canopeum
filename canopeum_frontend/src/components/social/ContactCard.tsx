import { useState } from 'react'
import { Link } from 'react-router-dom'

import facebookLogo from '@assets/icons/facebook-contact-logo.svg'
import instagramLogo from '@assets/icons/instagram-contact-logo.svg'
import linkedinLogo from '@assets/icons/linkedin-contact-logo.svg'
import xLogo from '@assets/icons/x-contact-logo.svg'
import SiteContactModal from '@components/social/site-modal/SiteContactModal'
import type { PageViewMode } from '@models/PageViewMode.type'
import type { Contact } from '@services/api'

type Props = {
  readonly contact: Contact,
  readonly viewMode: PageViewMode,
  readonly onEdit: (contact: Contact) => void,
}

const ContactCard = ({ contact, viewMode, onEdit }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const renderContactCard = () => (
    <div className='card rounded'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center pb-3'>
          <h2 className='card-title'>Contact</h2>
          {viewMode === 'admin' && (
            <button
              className='material-symbols-outlined text-primary fs-2'
              onClick={() => setIsModalOpen(!isModalOpen)}
              type='button'
            >
              edit_square
            </button>
          )}
        </div>
        <div className='info-section d-flex flex-column'>
          <div className='card-text adress d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>home_work</span>
            <p className='mb-0'>{contact.address}</p>
          </div>
          <div className='email d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>mail</span>
            <p className='mb-0'>{contact.email}</p>
          </div>
          <div className='phone d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>perm_phone_msg</span>
            <p className='mb-0'>{contact.phone}</p>
          </div>
        </div>
        <div className='social-icons d-flex flex-row-reverse pt-3'>
          {contact.linkedinLink && (
            <Link target='_blank' to={contact.linkedinLink}>
              <img alt='linkedin-logo' className='px-2' src={linkedinLogo} />
            </Link>
          )}
          {contact.instagramLink && (
            <Link target='_blank' to={contact.instagramLink}>
              <img alt='instagram-logo' className='px-2' src={instagramLogo} />
            </Link>
          )}
          {contact.xLink && (
            <Link target='_blank' to={contact.xLink}>
              <img alt='x-logo' className='px-2' src={xLogo} />
            </Link>
          )}
          {contact.facebookLink && (
            <Link target='_blank' to={contact.facebookLink}>
              <img alt='facebook-logo' className='px-2' src={facebookLogo} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {renderContactCard()}
      <SiteContactModal
        contact={contact}
        handleClose={(newContact: Contact | null) => {
          setIsModalOpen(!isModalOpen)
          if (newContact) onEdit(newContact)
        }}
        isOpen={isModalOpen}
      />
    </div>
  )
}

export default ContactCard
