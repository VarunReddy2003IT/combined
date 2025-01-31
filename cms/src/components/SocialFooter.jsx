import React from "react";
import { Link } from 'react-router-dom';
import styles from './SocialFooter.module.css';  // Changed to CSS modules

function SocialFooter() {
  return (
    <footer className={styles.footerBar}>
      <div className={styles.footerScrollContainer}>
        <nav className={styles.footerNav}>
          <ul className={styles.footerList}>
            <li><Link to="/yes" className={styles.footerLink}>YES</Link></li>
            <li><Link to="/yfs" className={styles.footerLink}>YFS</Link></li>
            <li><Link to="/nss1" className={styles.footerLink}>NSS1</Link></li>
            <li><Link to="/nss2" className={styles.footerLink}>NSS2</Link></li>
            <li><Link to="/youth-for-seva" className={styles.footerLink}>YouthForSeva</Link></li>
            <li><Link to="/we-are-for-help" className={styles.footerLink}>WeAreForHelp</Link></li>
            <li><Link to="/hoh" className={styles.footerLink}>HOH</Link></li>
            <li><Link to="/rotract" className={styles.footerLink}>Rotract</Link></li>
            <li><Link to="/vidyadaan" className={styles.footerLink}>Vidyadaan</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default SocialFooter;