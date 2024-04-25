const EditContactModal = ({props}: {readonly props: any},) => (
    <div
          // aria-hidden='true'
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
  )
export default EditContactModal;
