import facebookLogo from '@assets/icons/facebook-contact-logo.svg'
import instagramLogo from '@assets/icons/instagram-contact-logo.svg'
import linkedinLogo from '@assets/icons/linkedin-contact-logo.svg'
import xLogo from '@assets/icons/x-contact-logo.svg'
import { type Contact,PatchedContact } from '@services/api'
import getApiClient from '@services/apiInterface'
import { LogoControl } from 'maplibre-gl'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const ContactCard = (
  { contact, site, viewMode }: { readonly contact: Contact, readonly site: string | undefined,
    readonly viewMode: 'admin' | 'user' | 'visitor',
    },
) => {
  const [updatedContact, setUpdatedContact] = useState<Contact>();
  const [renderedContactCard, setRenderedContactCard] = useState<JSX.Element>();
  const contactInfo = updatedContact ?? contact

  const editContact = async (event: any) => {
    event.preventDefault();
    const inputs : PatchedContact = new PatchedContact({
      address: event.target.contact_address.value,
      email: event.target.contact_email.value,
      phone: event.target.contact_phone.value,
    });
    await getApiClient().contactClient.update(contact.id, Number.parseInt(`${site}`, 10), inputs )
      .then((response) => {
        document.getElementById('editContactModal')?.setAttribute('data-bs-dismiss', 'modal')
        setUpdatedContact(response)
      })
      .catch(alert)
  }

  useEffect(():void => {
    setRenderedContactCard(() => renderContactCard(contactInfo));
  },[updatedContact]);


  const renderContactCard = (mycontact: Contact) => (
    <div className='card rounded px-3 py-2'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center pb-3'>
          <h2 className='card-title'>Contact</h2>
          <div>
            {viewMode === 'admin' &&
            <button className='edit-btn bg-transparent'data-bs-target='#editContactModal'
            data-bs-toggle='modal' type='button'>
              <span className='material-symbols-outlined text-primary fs-2 pe-0'>edit_square</span>
            </button>}
          </div>

        </div>
        <div className='info-section d-flex flex-column'>
          <div className='card-text address d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>home_work</span>
            <p className='mb-0'>{mycontact.address}</p>
          </div>
          <div className='email d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>mail</span>
            <p className='mb-0'>{mycontact.email}</p>
          </div>
          <div className='phone d-flex align-items-center pb-3 gap-2'>
            <span className='material-symbols-outlined fs-4'>perm_phone_msg</span>
            <p className='mb-0'>{mycontact.phone}</p>
          </div>
        </div>
        <div className='social-icons d-flex flex-row-reverse pt-3'>
          {mycontact.linkedinLink && (
            <Link target='_blank' to={mycontact.linkedinLink}>
              <img alt='linkedin-logo' className='px-2' src={linkedinLogo} />
            </Link>
          )}
          {mycontact.instagramLink && (
            <Link target='_blank' to={mycontact.instagramLink}>
              <img alt='instagram-logo' className='px-2' src={instagramLogo} />
            </Link>
          )}
          {mycontact.xLink && (
            <Link target='_blank' to={mycontact.xLink}>
              <img alt='x-logo' className='px-2' src={xLogo} />
            </Link>
          )}
          {mycontact.facebookLink && (
            <Link target='_blank' to={mycontact.facebookLink}>
              <img alt='facebook-logo' className='px-2' src={facebookLogo} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )


  return (
    <div>
      {renderedContactCard}

      <div
          aria-hidden='true'
          aria-labelledby='editContactModalLabel'
          className='modal fade'
          id='editContactModal'
          tabIndex={-1}
      >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h1 className='modal-title fs-5' id='exampleModalLabel'>Edit contact</h1>
                <button aria-label='Close' className='btn-close' data-bs-dismiss='modal' type='button' />
              </div>
              <div className='modal-body d-flex justify-content-center'>
                <form action="edit" className='col-8' onSubmit={editContact}>
                  <div className='label-input'>
                    <label htmlFor='contact-address'>Address</label> <br />
                    <input id='contact-address' name='contact_address' placeholder={contact.address}
                    type="text"/> <br />
                  </div>
                  <div className='label-input'>
                  <label htmlFor='contact-email'>Email adress</label> <br />
                    <input id='contact-email' name='contact_email' placeholder={contact.email} type="text" /> <br />
                  </div>
                  <div className='label-input'>
                    <label htmlFor='contact-phone'>Phone number</label> <br />
                    <input id='contact-phone' name='contact_phone' placeholder={contact.phone} type="text" /> <br />
                  </div>
                  <div className='modal-footer'>
                    <button className='btn btn-primary' type='submit'>Save changes</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default ContactCard
