import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        {/* Mobile */}
        <div className="nav-bar-mobile-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu-inputs-list-mobile">
            <li className="nav-menu-item-mobile">
              <Link to="/" className="nav-link">
                <AiFillHome className="nav-bar-heading" />
              </Link>
            </li>
            <li className="nav-menu-item-mobile">
              <Link to="/jobs" className="nav-link">
                <BsBriefcaseFill className="nav-bar-heading" />
              </Link>
            </li>
            <li className="nav-menu-item-mobile">
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={onClickLogout}
              >
                <FiLogOut className="nav-bar-heading" />
              </button>
            </li>
          </ul>
        </div>

        {/* Desktop */}
        <div className="nav-bar-desktop-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu-desktop">
            <li className="nav-menu-item-desktop">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-menu-item-desktop">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)