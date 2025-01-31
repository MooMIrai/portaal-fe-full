import React, {useEffect, useState} from "react";
import { useThemeSwitcher } from "react-css-theme-switcher";
import DarkModeToggle from "react-dark-mode-toggle";
import CookieRepo from "../../repositories/CookieRepo";

export const ThemeSwitcher = () => {

    const { switcher, themes, currentTheme } = useThemeSwitcher();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  
  const toggleTheme = () => {
    const isDM= !isDarkMode?'dark':'light';
    setIsDarkMode(!isDarkMode);
    switcher({ theme: themes[isDM] });
    CookieRepo.write('theme',isDM);
  };

  useEffect(()=>{
    let currentThemeC = CookieRepo.read('theme');
    if(!currentThemeC){
        currentThemeC='light'
    }
    if(currentTheme && currentTheme != currentThemeC){
        switcher({ theme: themes[currentThemeC]});
    }
    setIsDarkMode(currentThemeC=='dark');

  },[currentTheme])

  return (
    <DarkModeToggle
      onChange={toggleTheme}
      checked={isDarkMode}
      size={70}
    />
  );
};