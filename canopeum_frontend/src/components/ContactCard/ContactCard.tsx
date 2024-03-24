import '../ContactCard/contact-card.scss';
import '../../pages/Utilities';

import facebookLogo from '@assets/icons/facebook-regular.svg';
import instagramLogo from '@assets/icons/instagram-regular.svg';
import linkedinLogo from '@assets/icons/linkedin.svg';
import twitterLogo from '@assets/icons/twitter-regular.svg';
import { useEffect,useState } from 'react';

import type { Contact } from '../../services/api'
import api from '../../services/apiInterface'
import { ensureError } from '../../services/errors';



const ContactCard = ({ siteId }:{readonly siteId: number}) => {
  const [contact, setContact] = useState<Contact>();
  const [isLoadingContactCard, setIsLoadingContactCard] = useState(false)
  const [contactError, setContactError] = useState<Error | undefined>(undefined)

  const fetchContact = async () => {
    setIsLoadingContactCard(true)
    try {
    const response = (await api().social.site(siteId)).contact
    setContact(response)
    } catch (error: unknown) {
      setContactError(ensureError(error))
    } finally {
      setIsLoadingContactCard(false)
    }
  }

  useEffect((): void => {
    void fetchContact()
  }, [])

  const renderContactCard = () => {
    if (isLoadingContactCard) {
      return <p>Loading contact ...</p>
    }
    if (contactError) {
      return <p>Error: {contactError.message}</p>
    }

    return (
      <div className='card col-4 rounded px-3 py-2'>
        <div className='card-body'>
            <div className='d-flex justify-content-between align-items-center pb-3'>
              <h2 className='card-title'>Contact</h2>
              <span className='material-symbols-outlined'>edit_square</span>
            </div>
            <div className='info-section d-flex flex-column'>
              <div className='card-text adress d-flex align-items-center pb-3'>
                <span className='material-symbols-outlined'>home_work</span>
                <p className='mb-0'>{contact?.address}</p>
              </div>
              <div className='email d-flex align-items-center pb-3'>
                <span className='material-symbols-outlined'>mail</span>
                <p className='mb-0'>{contact?.email}</p>
              </div>
              <div className='phone d-flex align-items-center pb-3'>
                <span className='material-symbols-outlined'>perm_phone_msg</span>
                <p className='mb-0'>{contact?.phone}</p>
              </div>
            </div>
            <div className='social-icons d-flex flex-row-reverse pt-3'>
              <a href={contact?.linkedinLink}>
                <img alt='linkedin-logo' className="px-2" src={linkedinLogo} />
              </a>
              <a href={contact?.instagramLink}>
                <img alt="instagram-logo" className="px-2" src={instagramLogo} />
              </a>
              <a href={contact?.xLink}>
                <img alt="twitter-logo" className="px-2" src={twitterLogo} />
              </a>
              <a href={contact?.facebookLink}>
                <img alt='facebook-logo' className="px-2" src={facebookLogo}/>
              </a>
            </div>
          </div>
      </div>
  )}

  return (
  <div>
  {renderContactCard()}
  </div>
  )
}

export default ContactCard
