import { useContext } from "react";
import AppContext from "../utils/AppContext";

const useAppContext = () => {
  const {
    authUser,
    currentUser,
    tournament,
    players,
    emoji,
    setAppState,
    filterDates,
    refetch,
    roundScores
  } = useContext(AppContext);

  return {
    authUser,
    currentUser,
    tournament,
    players,
    emoji,
    setAppState,
    filterDates,
    refetch,
    roundScores
  };
};

export default useAppContext;
