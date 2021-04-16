import React from 'react';
import styles from './header.module.scss';

export default function Header() {
  return <img className={styles.logo} src="/images/Logo.svg" alt="logo" />;
}
