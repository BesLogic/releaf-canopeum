import { useState } from 'react'

const Login = () =>  {

  const [emailInError, setEmailInError] = useState(false)
  const [passwordInError, setPasswordInError] = useState(false)

  return (
    <div className='d-flex' style={{height: '100vh'}}>
      <div style={{width: '55%'}} />
      <div className='d-flex flex-column bg-white px-3 py-2'
          style={{width: '45%', alignItems: 'center'}}>

        <div style={{flexGrow: '0.3', display: 'flex', alignItems: 'center'}}>
          <h1 style={{textAlign: 'center'}}>Log In to Your Account</h1>
        </div>

        <div className='d-flex flex-column' style={{width: '60%'}}>
          <div style={{width: '100%', margin: '20px 0px 20px 0px'}}>
            <label htmlFor='exampleInputEmail1'>Email address</label>
            <input aria-describedby='emailHelp' className='form-control' id='exampleInputEmail1' type='email' />
          </div>

          <div style={{width: '100%', margin: '20px 0px 20px 0px'}}>
            <label htmlFor='exampleInputPassword1'>Password</label>
            <input className={`form-control ${passwordInError && 'is-invalid'} `}
                   id='exampleInputPassword1' type='password'
            />
            {passwordInError && <span className="help-block text-danger">Please enter a password</span>}
          </div>
          <button className='btn btn-primary' style={{margin: '40px 0px 10px'}} type='submit'>Log In</button>
          <button className='btn btn-outline-primary' style={{margin: '10px 0px 10px'}} type='button'>Sign in</button>
        </div>
      </div>
    </div>
  )
}

export default Login
