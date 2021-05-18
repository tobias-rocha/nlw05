import Image from 'next/image';
import { useContext, useRef, useEffect, useState } from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

import { PlayerContext } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import { GlobalContext } from '../../contexts/GlobalContext';

export function Player() {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying,
    isLooping,
    isShuffling, 
    tooglePlay,
    toogleLoop,
    toogleShuffle, 
    setIsPlayingState,
    playNext,
    playPrevious,
    playSlug 
  } = useContext(PlayerContext);

  const { themeDark } = useContext(GlobalContext);

  useEffect(() => {
    if(!audioRef.current){
      return;
    }

    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    console.log(amount);
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const episode = episodeList[currentEpisodeIndex];
  
  return(
    <div className={themeDark == true ? styles.playerContainerDark : styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando Agora"/>
        <strong>Tocando Agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      ) }
      

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider} />
          { episode ? (
            <Slider
              max={episode.durationTime}
              value={progress}
              onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d361'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d361', borderWidth: 4}}
            />
          ) : (
            <div className={styles.emptySlider} />
          ) }
          <span>{episode?.duration ?? 0}</span>
        </div>

        { episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            onEnded={playNext}
            loop={isLooping}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        ) }

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || playSlug}
            onClick={toogleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || playSlug}>
            <img src="/play-previous.svg" alt="Tocar Anterior" />
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={tooglePlay}>
            <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt="Tocar" />
          </button>
          <button type="button" onClick={playNext} disabled={!episode || playSlug}>
            <img src="/play-next.svg" alt="Tocar Próxima" />
          </button>
          <button 
            type="button" 
            disabled={!episode}
            onClick={toogleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}