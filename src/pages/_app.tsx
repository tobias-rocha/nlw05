import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';
import { GlobalContextProvider } from '../contexts/GlobalContext';

function MyApp({ Component, pageProps }) {
  return(
    <GlobalContextProvider>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </GlobalContextProvider>
  )
}

export default MyApp
