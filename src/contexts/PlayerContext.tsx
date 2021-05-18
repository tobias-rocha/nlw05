import { createContext, useState, ReactNode } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  durationTime: number;
  duration: number;
}

type PlayerContextData = {
  episodeList: Episode[];
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  playSlug: boolean;
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
  playSlugEpisode: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setIsPlayingState: (state: boolean) => void;
  tooglePlay: () => void;
  toogleLoop: () => void;
  toogleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSlug, setplaySlug] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
    setplaySlug(false);
  }

  function playSlugEpisode(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
    setplaySlug(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
    setplaySlug(false);
  }

  function tooglePlay(){
    setIsPlaying(!isPlaying);
  }

  function toogleLoop(){
    setIsLooping(!isLooping);
  }

  function toogleShuffle(){
    setIsShuffling(!isShuffling);
  }

  function setIsPlayingState(state: boolean){
    setIsPlaying(state);
  }

  function playPrevious() {
    const previousEpisodeIndex = currentEpisodeIndex + 1;
    let index = null;

    if (previousEpisodeIndex >= episodeList.length) {
      index = 0;
    }

    setCurrentEpisodeIndex(index != null ? index : currentEpisodeIndex + 1);
  }

  function playNext() {
    let index = null;

    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else {
      if (currentEpisodeIndex == 0) {
        index = episodeList.length - 1;
      }
      setCurrentEpisodeIndex(index != null ? index : currentEpisodeIndex - 1);
    }
  }

  return (
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play,
        isLooping,
        isShuffling,
        playSlugEpisode,
        playSlug,
        playList,
        playNext,
        playPrevious,
        isPlaying, 
        tooglePlay,
        toogleLoop, 
        toogleShuffle, 
        setIsPlayingState 
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}