import React, {Component} from "react";
import ReactDOM from "react-dom";


class LoginComponent extends Component {
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

  async handleInputChange(e) {
    switch (e.target.type) {
      case 'email':
        await this.setState({email: e.target.value})
        break;
      case 'password':
        await this.setState({password: e.target.value})
        break;
    }
    if (this.state.email.length > 4 && this.state.password.length > 4) {
      this.setState({canSubmit: true})
    } else {
      this.setState({canSubmit: false})
    }
  }

  async login() {
    if (this.state.canSubmit) {
      this.setState({loading: true});
      const body = JSON.stringify({email: this.state.email, password: this.state.password})
      const response = await fetch('/xhr/auth', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: body
      });
      const data = await response.json();
      switch (response.status) {
        case 401:
          this.setState({
            message: data.message,
            canSubmit: false,
            email: "",
            password: "",
            loading: false
          });
          break;
        case 500:
          this.setState({
            message: data.message,
            canSubmit: false,
            email: "",
            password: "",
            loading: false
          });
          break;
        case 200:
          document.location.href = "/profile";
          break;
      }
    }
  }

  renderLoginButton() {
    if (this.state.loading) {
      return <button className="btn btn-primary disabled">
        Login <div className='spinner-size-1 d-inline-block'></div>
      </button>
    } else {
      return <button onClick={() => this.login()} className="btn btn-primary">Login</button>
    }
  }

  render() {
    return <div className="container">
      <div className="row justify-content-center mt-3">
        <div className="col-12 col-md-6 col-xl-4 border border-light text-white p-3">
          <p>docker-express, <span className="text-secondary">log in with credentials:</span></p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Email</label>
              <input onChange={(e) => this.handleInputChange(e)}
                     value={this.state.email}
                     type="email"
                     className="form-control"
                     min="4"
                     max="50"
                     placeholder="Enter email"
                     required/>
              <small className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input onChange={(e) => this.handleInputChange(e)}
                     value={this.state.password}
                     type="password"
                     min="4"
                     max="20"
                     className="form-control"
                     placeholder="Password"
                     required/>
            </div>
            {this.renderLoginButton()}
            {this.renderAlert()}
          </form>
          <small className="form-text text-muted mt-2">don't have an account yet? <a href="/register">register
            here &raquo;</a>
          </small>
        </div>
      </div>
    </div>
  }
}

ReactDOM.render(
  <LoginComponent/>,
  document.getElementById('login')
)