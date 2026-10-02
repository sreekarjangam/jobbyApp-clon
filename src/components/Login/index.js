import {Component} from "react"
import Cookies from "js-cookie"
import {Redirect} from "react-router-dom"

class Login extends Component {
  state = {username: "", password: "", errorMsg: "", showError: false}

  onSubmitSuccess = jwtToken => {
    Cookies.set("jwt_token", jwtToken, {expires: 30})
    const {history} = this.props
    history.replace("/")
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const response = await fetch("https://apis.ccbp.in/login", {
      method: "POST",
      body: JSON.stringify({username, password}),
    })

    const data = await response.json()

    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({showError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state

    const jwtToken = Cookies.get("jwt_token")

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <form onSubmit={this.submitForm}>
        <label htmlFor="username">USERNAME</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => this.setState({username: e.target.value})}
        />

        <label htmlFor="password">PASSWORD</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => this.setState({password: e.target.value})}
        />

        <button type="submit">Login</button>

        {showError && <p>{errorMsg}</p>}
      </form>
    )
  }
}

export default Login