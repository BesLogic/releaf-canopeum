import carbone_quebec_logo from '@assets/images/Carbone_Quebec_Logo.png';
import footprintIcon from '@assets/icons/footprint-regular.svg';

export default function Utilities() {
    return (
        <div>
            <div className="container mt-2 d-flex flex-column gap-2">
                <h1>Utilities</h1>
                <div className="bg-white rounded-2 px-3 py-2">
                    <h2>Icons</h2>
                    <span className="material-symbols-outlined fill-icon">map</span>
                    <span className="material-symbols-outlined">map</span>
                    <span className="material-symbols-outlined fill-icon">account_circle</span>
                    <span className="material-symbols-outlined">account_circle</span>
                    <span className="material-symbols-outlined fill-icon">visibility</span>
                    <span className="material-symbols-outlined">visibility_off</span>
                    <span className="material-symbols-outlined fill-icon">location_on</span>
                    <span className="material-symbols-outlined">location_on</span>
                    <span className="material-symbols-outlined fill-icon">person</span>
                    <span className="material-symbols-outlined">person</span>
                    <span className="material-symbols-outlined fill-icon">add</span>
                    <span className="material-symbols-outlined">add</span>
                    <span className="material-symbols-outlined fill-icon">park</span>
                    <span className="material-symbols-outlined">park</span>
                    <img src={footprintIcon} alt="iconHome" className='h-1'/>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Buttons</h2>
                    <div className="d-flex gap-1">
                        <button type="button" className="btn btn-primary">Primary</button>
                        <button type="button" className="btn btn-secondary">Secondary</button>
                        <button type="button" className="btn btn-success">Success</button>
                        <button type="button" className="btn btn-danger">Danger</button>
                        <button type="button" className="btn btn-warning">Warning</button>
                        <button type="button" className="btn btn-info">Info</button>
                        <button type="button" className="btn btn-light">Light</button>
                        <button type="button" className="btn btn-dark">Dark</button>
                        <button type="button" className="btn btn-link">Link</button>
                    </div>
                    <div className="d-flex gap-1 my-2">
                        <button type="button" className="btn btn-outline-primary">Primary</button>
                        <button type="button" className="btn btn-outline-secondary">Secondary</button>
                        <button type="button" className="btn btn-outline-success">Success</button>
                        <button type="button" className="btn btn-outline-danger">Danger</button>
                        <button type="button" className="btn btn-outline-warning">Warning</button>
                        <button type="button" className="btn btn-outline-info">Info</button>
                        <button type="button" className="btn btn-outline-light">Light</button>
                        <button type="button" className="btn btn-outline-dark">Dark</button>
                    </div>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Alerts</h2>
                    <div className="alert alert-primary" role="alert">
                        A simple primary alert—check it out!
                    </div>
                    <div className="alert alert-secondary" role="alert">
                        A simple secondary alert—check it out!
                    </div>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Cards</h2>
                    <div className="card h-100">
                        <div className="row no-gutters h-100">
                            <div className="col-md-4">
                                <img src={carbone_quebec_logo} className="card-img object-fit-cover h-100" alt="..." />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body d-flex flex-column h-100">
                                    <h5 className="card-title">Card title</h5>
                                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                    <a href="#" className="btn btn-primary mt-auto">Go somewhere</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Form</h2>
                    <form>
                        <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                        </div>
                        <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                        <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Table</h2>
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry</td>
                            <td>the Bird</td>
                            <td>@twitter</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <h2>Modals</h2>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                    </button>

                    <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    ...
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-primary" data-bs-dismiss="modal">Close</button>
                                    <button type="button" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded px-3 py-2">
                    <div className="accordion" id="accordionPanelsStayOpenExample">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                Accordion Item #1
                            </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-headingOne">
                            <div className="accordion-body">
                                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                            </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                Accordion Item #2
                            </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingTwo">
                            <div className="accordion-body">
                                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                            </div>
                            </div>
                        </div>
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                Accordion Item #3
                            </button>
                            </h2>
                            <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="panelsStayOpen-headingThree">
                            <div className="accordion-body">
                                <strong>This is the third item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
import facebookLogo from '@assets/icons/facebook-regular.svg'
import canopeumLogo from '@assets/images/Canopeum_Logo.jpg'

const Utilities = () => (
  <div>
    <div className='container mt-2 d-flex flex-column gap-2'>
      <h1>Utilities</h1>
      <div className='bg-white rounded-2 px-3 py-2'>
        <h2>Icons</h2>
        <span className='material-symbols-outlined fill-icon'>home</span>
        <span className='material-symbols-outlined'>home</span>
        <span className='material-symbols-outlined fill-icon'>donut_small</span>
        <span className='material-symbols-outlined'>donut_small</span>
        <span className='material-symbols-outlined fill-icon'>pin_drop</span>
        <span className='material-symbols-outlined'>pin_drop</span>
        <span className='material-symbols-outlined fill-icon'>account_circle</span>
        <span className='material-symbols-outlined'>account_circle</span>
        <span className='material-symbols-outlined fill-icon'>eco</span>
        <span className='material-symbols-outlined'>eco</span>
        <span className='material-symbols-outlined fill-icon'>sms</span>
        <span className='material-symbols-outlined'>sms</span>
        <span className='material-symbols-outlined fill-icon'>mood</span>
        <span className='material-symbols-outlined'>mood</span>
        <span className='material-symbols-outlined fill-icon'>add_a_photo</span>
        <span className='material-symbols-outlined'>add_a_photo</span>
        <span className='material-symbols-outlined fill-icon'>smart_display</span>
        <span className='material-symbols-outlined'>smart_display</span>
        <span className='material-symbols-outlined fill-icon'>home_work</span>
        <span className='material-symbols-outlined'>home_work</span>
        <span className='material-symbols-outlined fill-icon'>mail</span>
        <span className='material-symbols-outlined'>mail</span>
        <span className='material-symbols-outlined fill-icon'>perm_phone_msg</span>
        <span className='material-symbols-outlined'>perm_phone_msg</span>
        <span className='material-symbols-outlined fill-icon'>edit_square</span>
        <span className='material-symbols-outlined'>edit_square</span>
        <span className='material-symbols-outlined fill-icon'>add</span>
        <span className='material-symbols-outlined'>add</span>
        <span className='material-symbols-outlined fill-icon'>cancel</span>
        <span className='material-symbols-outlined'>cancel</span>
        <span className='material-symbols-outlined fill-icon'>source_environment</span>
        <span className='material-symbols-outlined'>source_environment</span>
        <span className='material-symbols-outlined fill-icon'>location_on</span>
        <span className='material-symbols-outlined'>location_on</span>
        <span className='material-symbols-outlined fill-icon'>person</span>
        <span className='material-symbols-outlined'>person</span>
        <span className='material-symbols-outlined fill-icon'>forest</span>
        <span className='material-symbols-outlined'>forest</span>
        <span className='material-symbols-outlined fill-icon'>workspaces</span>
        <span className='material-symbols-outlined'>workspaces</span>
        <span className='material-symbols-outlined fill-icon'>school</span>
        <span className='material-symbols-outlined'>school</span>
        <span className='material-symbols-outlined fill-icon'>psychiatry</span>
        <span className='material-symbols-outlined'>psychiatry</span>
        <img alt='iconHome' className='h-1' src={facebookLogo} />
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Buttons</h2>
        <div className='d-flex gap-1'>
          <button className='btn btn-primary' type='button'>Primary</button>
          <button className='btn btn-secondary' type='button'>Secondary</button>
          <button className='btn btn-success' type='button'>Success</button>
          <button className='btn btn-danger' type='button'>Danger</button>
          <button className='btn btn-warning' type='button'>Warning</button>
          <button className='btn btn-info' type='button'>Info</button>
          <button className='btn btn-light' type='button'>Light</button>
          <button className='btn btn-dark' type='button'>Dark</button>
          <button className='btn btn-link' type='button'>Link</button>
        </div>
        <div className='d-flex gap-1 my-2'>
          <button className='btn btn-outline-primary' type='button'>Primary</button>
          <button className='btn btn-outline-secondary' type='button'>Secondary</button>
          <button className='btn btn-outline-success' type='button'>Success</button>
          <button className='btn btn-outline-danger' type='button'>Danger</button>
          <button className='btn btn-outline-warning' type='button'>Warning</button>
          <button className='btn btn-outline-info' type='button'>Info</button>
          <button className='btn btn-outline-light' type='button'>Light</button>
          <button className='btn btn-outline-dark' type='button'>Dark</button>
        </div>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Alerts</h2>
        <div className='alert alert-primary' role='alert'>
          A simple primary alert—check it out!
        </div>
        <div className='alert alert-secondary' role='alert'>
          A simple secondary alert—check it out!
        </div>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Cards</h2>
        <div className='card h-100'>
          <div className='row no-gutters h-100'>
            <div className='col-md-4'>
              <img alt='...' className='card-img object-fit-cover h-100' src={canopeumLogo} />
            </div>
            <div className='col-md-8'>
              <div className='card-body d-flex flex-column h-100'>
                <h5 className='card-title'>Card title</h5>
                <p className='card-text'>
                  Some quick example text to build on the card title and make up the bulk of the card&apos;s content.
                </p>
                <button className='btn btn-link mt-auto' type='button'>Go somewhere</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Form</h2>
        <form>
          <div className='form-group'>
            <label htmlFor='exampleInputEmail1'>Email address</label>
            <input aria-describedby='emailHelp' className='form-control' id='exampleInputEmail1' type='email' />
            <small className='form-text text-muted' id='emailHelp'>
              We&apos;ll never share your email with anyone else.
            </small>
          </div>
          <div className='form-group'>
            <label htmlFor='exampleInputPassword1'>Password</label>
            <input className='form-control' id='exampleInputPassword1' type='password' />
          </div>
          <div className='form-check'>
            <input className='form-check-input' id='exampleCheck1' type='checkbox' />
            <label className='form-check-label' htmlFor='exampleCheck1'>Check me out</label>
          </div>
          <button className='btn btn-primary' type='submit'>Submit</button>
        </form>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Table</h2>
        <table className='table'>
          <thead>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>First</th>
              <th scope='col'>Last</th>
              <th scope='col'>Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope='row'>1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope='row'>2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <th scope='row'>3</th>
              <td>Larry</td>
              <td>the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <h2>Modals</h2>
        <button className='btn btn-primary' data-bs-target='#exampleModal' data-bs-toggle='modal' type='button'>
          Launch demo modal
        </button>

        <div
          aria-hidden='true'
          aria-labelledby='exampleModalLabel'
          className='modal fade'
          id='exampleModal'
          tabIndex={-1}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h1 className='modal-title fs-5' id='exampleModalLabel'>Modal title</h1>
                <button aria-label='Close' className='btn-close' data-bs-dismiss='modal' type='button' />
              </div>
              <div className='modal-body'>
                ...
              </div>
              <div className='modal-footer'>
                <button className='btn btn-outline-primary' data-bs-dismiss='modal' type='button'>Close</button>
                <button className='btn btn-primary' type='button'>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-white rounded px-3 py-2'>
        <div className='accordion' id='accordionPanelsStayOpenExample'>
          <div className='accordion-item'>
            <h2 className='accordion-header' id='panelsStayOpen-headingOne'>
              <button
                aria-controls='panelsStayOpen-collapseOne'
                aria-expanded='true'
                className='accordion-button'
                data-bs-target='#panelsStayOpen-collapseOne'
                data-bs-toggle='collapse'
                type='button'
              >
                Accordion Item #1
              </button>
            </h2>
            <div
              aria-labelledby='panelsStayOpen-headingOne'
              className='accordion-collapse collapse show'
              id='panelsStayOpen-collapseOne'
            >
              <div className='accordion-body'>
                <strong>This is the first item&apos;s accordion body.</strong>{' '}
                It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each
                element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It&apos;s
                also worth noting that just about any HTML can go within the{' '}
                <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
          <div className='accordion-item'>
            <h2 className='accordion-header' id='panelsStayOpen-headingTwo'>
              <button
                aria-controls='panelsStayOpen-collapseTwo'
                aria-expanded='false'
                className='accordion-button collapsed'
                data-bs-target='#panelsStayOpen-collapseTwo'
                data-bs-toggle='collapse'
                type='button'
              >
                Accordion Item #2
              </button>
            </h2>
            <div
              aria-labelledby='panelsStayOpen-headingTwo'
              className='accordion-collapse collapse'
              id='panelsStayOpen-collapseTwo'
            >
              <div className='accordion-body'>
                <strong>This is the second item&apos;s accordion body.</strong>{' '}
                It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style
                each element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It&apos;s
                also worth noting that just about any HTML can go within the{' '}
                <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
          <div className='accordion-item'>
            <h2 className='accordion-header' id='panelsStayOpen-headingThree'>
              <button
                aria-controls='panelsStayOpen-collapseThree'
                aria-expanded='false'
                className='accordion-button collapsed'
                data-bs-target='#panelsStayOpen-collapseThree'
                data-bs-toggle='collapse'
                type='button'
              >
                Accordion Item #3
              </button>
            </h2>
            <div
              aria-labelledby='panelsStayOpen-headingThree'
              className='accordion-collapse collapse'
              id='panelsStayOpen-collapseThree'
            >
              <div className='accordion-body'>
                <strong>This is the third item&apos;s accordion body.</strong>{' '}
                It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style
                each element. These classes control the overall appearance, as well as the showing and hiding via CSS
                transitions. You can modify any of this with custom CSS or overriding our default variables. It&apos;s
                also worth noting that just about any HTML can go within the{' '}
                <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>

)}
