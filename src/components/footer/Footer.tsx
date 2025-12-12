import "./footer.css";
import "../header/header.css";
import LockIcon from "../../assets/icons/lock-simple.svg";
import BoltIcon from "../../assets/icons/lightning.svg";
import CameraIcon from "../../assets/icons/security-camera.svg";
import ShieldIcon from "../../assets/icons/shield.svg";
import LogoIcon from "../../assets/logo.png";
import CopyRightIcon from "../../assets/icons/copyright.svg"

export function Footer() {
  return (
    <footer>
      <div className="promote">
        <h2>Why use SecureCheck?</h2>
        <h3>
          Protect your digital identity with our advanced verification tool.
        </h3>
      </div>
      <div className="cards">
        <div className="card">
          <div className="image_card">
            <img src={ShieldIcon} alt="" />
          </div>
          <div className="text_card">
            <span>Reliable Security</span>
            <p>
              We've reviewed millions of known data breach logs to protect you.
            </p>
          </div>
        </div>
        <div className="card">
          <div className="image_card">
            <img src={BoltIcon} alt="" />
          </div>
          <div className="text_card">
            <span>Instant Verification</span>
            <p>Results in seconds, no registration or login required.</p>
          </div>
        </div>
        <div className="card">
          <div className="image_card">
            <img src={LockIcon} alt="" />
          </div>
          <div className="text_card">
            <span>Privacy Guaranteed</span>
            <p>We do not store your data. All queries are anonymous.</p>
          </div>
        </div>
        <div className="card">
          <div className="image_card">
            <img src={CameraIcon} alt="" />
          </div>
          <div className="text_card">
            <span>Constant Monitoring</span>
            <p>Database updated with the latest reported leaks.</p>
          </div>
        </div>
      </div>
      <div>
        <div className="footer_bottom">
          <div className="logo">
            <img src={LogoIcon} alt="Logo Image" />
            <span>SecureCheck</span>
          </div>
          <div className="footer_source">
            <p>Data provided by the XposedOrNot</p>
          </div>
          <div className="footer_rights">
            <img src={CopyRightIcon} alt="" />
            <p>2025 SecureCheck. Protecting your digital identity.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
