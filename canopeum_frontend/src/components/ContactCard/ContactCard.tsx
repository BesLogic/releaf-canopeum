import '../ContactCard/contact-card.scss';
import '../../pages/Utilities';

import facebookLogo from '@assets/icons/facebook-regular.svg';
import instagramLogo from '@assets/icons/instagram-regular.svg';
import linkedinLogo from '@assets/icons/linkedin.svg';
import twitterLogo from '@assets/icons/twitter-regular.svg';


const ContactCard = () => (


    <div className='card col-4 rounded px-3 py-2'>
      <div className='card-body'>
          <div className='d-flex justify-content-between align-items-center pb-3'>
            <h2 className='card-title'>Contact</h2>
            <span className='material-symbols-outlined'>edit_square</span>
          </div>
          <div className='info-section d-flex flex-column'>
            <div className='card-text adress d-flex align-items-center pb-3'>
              <span className='material-symbols-outlined'>home_work</span>
              Some adress
            </div>
            <div className='email d-flex align-items-center pb-3'>
              <span className='material-symbols-outlined'>mail</span>
              Email
            </div>
            <div className='phone d-flex align-items-center pb-3'>
              <span className='material-symbols-outlined'>perm_phone_msg</span>
              Phone
            </div>
          </div>
          <div className='social-icons d-flex flex-row-reverse pt-3'>
            <img alt='linkedin-logo' className="px-2" src={linkedinLogo} />
            <img alt="instagram-logo" className="px-2" src={instagramLogo} />
            <img alt="twitter-logo" className="px-2" src={twitterLogo} />
            <img alt='facebook-logo' className="px-2" src={facebookLogo}/>

          </div>
        </div>
    </div>
  )

export default ContactCard
