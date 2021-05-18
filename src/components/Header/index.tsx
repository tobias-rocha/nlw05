import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import styles from './styles.module.scss';
import { FaMoon, FaSun } from "react-icons/fa";
import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

export function Header() {
  const { themeDark, handleTheme } = useContext(GlobalContext);

  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  })

  return(
    <header className={themeDark == true ? styles.headerContainerDark : styles.headerContainer}>
      <Link href={'/'}>
        <img src="/logo.svg" alt="Podcastr"/>
      </Link>
      
      <p>O melhor para você ouvir, sempre</p>

      <span>{ currentDate }</span>
      <div className={styles.divTheme} onClick={handleTheme}>{themeDark == true ? <FaSun/> : <FaMoon/>}</div>
    </header>
  )
}