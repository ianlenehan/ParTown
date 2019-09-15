import React from "react";

const AppContext = React.createContext({
  authUser: null,
  currentUser: null,
  players: null,
  setAppState: () => {}
});

export default AppContext;
