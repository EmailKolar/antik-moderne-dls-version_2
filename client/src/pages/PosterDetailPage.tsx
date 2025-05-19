import { Heading, Spinner } from "@chakra-ui/react";
//import useGame from "../domain/game/useGame";
import { useParams } from "react-router-dom";
//import ExpandableText from "../components/ExpandableText";
//import GameAttributes from "../domain/game/GameAttributes";

const PosterDetailPage = () => {
  const { id } = useParams();
  //const { data: game, error, isLoading } = useGame(Number(id));

  //if (isLoading) return <Spinner />;
  //if (error || !game) throw error;

  return (
    <>
      {/* <Heading>{game.name}</Heading>
      <ExpandableText>{game.description_raw}</ExpandableText>
      <GameAttributes game={game} /> */}
    </>
  );
};

export default PosterDetailPage;