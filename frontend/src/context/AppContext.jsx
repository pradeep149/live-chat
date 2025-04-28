import React, { createContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [messages, setMessages] = useState([]);

  function addMessage(newMessage) {
    setMessages((prev) => [...prev, newMessage]);
  }

  const value = {
    messages,
    addMessage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export default AppContext;
