import React from 'react'
import { AuthConsumer } from './AuthContext'

class UserForm extends React.Component {

  emailInput = React.createRef()
  passwordInput = React.createRef()

  redirect = (userId) => {
    this.props.history.push(`/${userId}/boards`)
  }

  render() {
    return (
      <React.Fragment>
        <AuthConsumer>
          {({ user, logIn, signUp, authMessage }) => (
            !user.id ? (
              <div className="sign-up-wrapper">
                <h2>Sign in or create account</h2>
                {authMessage ? <span>{authMessage}</span> : ''}
                <form className="sign-up-form">
                  <div>
                    <input
                      ref={this.emailInput}
                      type="email"
                      name="email"
                      placeholder="Email"
                    />
                  </div>
                  <div>
                    <input
                      ref={this.passwordInput}
                      type="password"
                      name="password"
                      placeholder="Password" />
                  </div>
                  <div>
                    <button onClick={(e) => logIn(this.emailInput.current.value, this.passwordInput.current.value, e)}>Login</button>
                    <button onClick={(e) => signUp(this.emailInput.current.value, this.passwordInput.current.value, e)}>Sign Up</button>
                  </div>
                </form>
              </div>
            ) : (
                <button onClick={() => this.redirect(user.id)}>Go to my boards</button>
              )
          )}
        </AuthConsumer>
      </React.Fragment >

    )
  }
}


export default UserForm
