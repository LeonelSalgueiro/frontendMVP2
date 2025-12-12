import LogoIcon from "../../assets/logo.png";
import ShieldGrayIcon from "../../assets/icons/shield-gray.svg"
import LockGrayIcon from "../../assets/icons/lock-simple-gray.svg"
import "./header.css"

export function Header() {
  return (
      <header>
        <div className="logo">
          <img src={LogoIcon} alt="Logo Image" />
          <span>SecureCheck</span>
        </div>

        <div className="banner">
          <h1>Is your digital<br /><strong>identity secure?</strong></h1>
          <h3>Instantly check if your email address has been exposed in known <br />data breaches. 
          Protect yourself now.</h3>
        </div>

        <div className="banner_options">
          <div className="banner_option">
            <img src={ShieldGrayIcon} alt="" />
            <p>End-to-end encryption</p>
          </div>
          <div className="banner_option">
            <img src={LockGrayIcon} alt="" />
            <p>Anonymous verification</p>
          </div>
        </div>
      </header>

)}