import { createContext, useState, ReactNode } from 'react';

type GlobalContextData = {
  themeDark: boolean;
  handleTheme: () => void;
}

export const GlobalContext = createContext({} as GlobalContextData);

type GlobalContextProviderProps = {
  children: ReactNode;
}

export function GlobalContextProvider({ children }) {
  const [themeDark, setThemeDark] = useState(false);

  function handleTheme() {
    setThemeDark(themeDark == false ? true : false)
  }

  return (
    <GlobalContext.Provider 
      value={{ 
        themeDark,
        handleTheme, 
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}