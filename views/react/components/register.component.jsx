import React, {Component, Fragment} from "react";
import ReactDOM from "react-dom";


class RegisterComponent extends Component {
  state = {
    canSubmit: false,
    loading: false,
    message: "",
    email: "",
    password: ""
  };

  renderAlert() {
    if (this.state.message.length > 0) {
      return <div className="alert alert-danger mt-3" role="alert">
        <small>{this.state.message}</small>
        <button onClick={() => this.setState({message: ""})} type="button" className="close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    }
  }

  handleOnChange(e) {
    switch (e.target.type) {
      case 'email':
        this.setState({email: e.target.value})
        break;
      case 'password':
        this.setState({password: e.target.value})
        break;
    }

    if (this.state.email.length > 4 && this.state.password.length > 4) {
      this.setState({canSubmit: true})
    } else {
      this.setState({canSubmit: false})
    }
  }

  async handleCreateUser() {
    if (this.state.canSubmit) {
      this.setState({loading: true});
      const body = JSON.stringify({email: this.state.email, password: this.state.password})
      const response = await fetch('/xhr/user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: body
      });
      switch (response.status) {
        case 400:
          const body = await response.json()
          this.setState({
            message: body.message,
            canSubmit: false,
            loading: false,
            email: "",
            password: ""
          });
          break;
        case 201:
          document.location.href = "/profile";
          break;
      }
    }
  }

  renderSubmitBtn() {
    if (this.state.loading) {
      return <button className="btn btn-primary disabled" disabled>
        Register <div className='spinner-size-1 d-inline-block'></div>
      </button>
    } else {
      return <button onClick={() => this.handleCreateUser()} className="btn btn-primary">
        Register
      </button>
    }
  }

  render() {
    return <div className="container">
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-6 col-xl-4 border border-light text-white p-3">
          <form onSubmit={(e) => e.preventDefault()}>
            <p>docker-express, <span className="text-secondary">register new account</span></p>
            <div className="form-group">
              <label>Email Address</label>
              <input onChange={(e) => this.handleOnChange(e)}
                     value={this.state.email}
                     type="email"
                     className="form-control"
                     aria-describedby="emailHelp"
                     min="4"
                     max="50"
                     placeholder="Email"
                     required/>
              <small className="form-text text-muted">Please enter a valid email</small>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input onChange={(e) => this.handleOnChange(e)}
                     value={this.state.password}
                     type="Password"
                     className="form-control"
                     min="4"
                     max="20"
                     placeholder="Password"
                     required/>
              <small className="form-text text-muted">Please enter a valid password (at lest 4
                characters)</small>
            </div>
            {this.renderSubmitBtn()}
            {this.renderAlert()}
            <small className="form-text text-muted mt-2">Do you already have an account? <a href="/login">login
              here
              &raquo;</a>
            </small>
          </form>
        </div>
      </div>
    </div>
  }
}

ReactDOM.render(
  <RegisterComponent/>,
  document.getElementById('register')
)