import LogoIcon from "../../assets/logo.png";
import ShieldIcon from "../../assets/icons/shield.svg"
import LockIcon from "../../assets/icons/lock-simple.svg"
import "./header.css"

export function Header() {
  return (
      <header>
        <div className="logo">
          <img src={LogoIcon} alt="Logo Image" />
          <span>SecureCheck</span>
        </div>

        <div className="banner">
          <h1>Is your digital identity secure?</h1>
          <h3>Instantly check if your email address has been exposed in known data breaches. 
          Protect yourself now.</h3>
        </div>

        <div className="banner_options">
          <div className="banner_option">
            <img src={ShieldIcon} alt="" />
            <p>End-to-end encryption</p>
          </div>
          <div className="banner_option">
            <img src={LockIcon} alt="" />
            <p>Anonymous verification</p>
          </div>
        </div>
      </header>

)}