import React from "react";
import { createRoot } from "react-dom/client";
import {ChatButton} from './components/ChatButton/component';

export default function(){

  let element = document.getElementById("chatbot-root");
  if(!element){
    element = document.createElement('div');
    element.id= "chatbot-root";
  }

  const root = createRoot(document.getElementById("chatbot-root")!);
  root.render(
    <ChatButton />
  );
  
  
  return {
    menuItems:[
      
    ]
  }

}