import { type types } from "~/lib/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Divider } from "~/components/Divider";
import { IoTrashOutline } from "react-icons/io5";
import { useSetAtom } from "jotai";
import { postersAtom } from "~/atoms/postersAtom";
import useAuthFetch from "~/hooks/useAuthFetch";

interface TabProductCardProps {
  poster: types.PosterDto;
}

export const TabPosterCard = ({ poster }: TabProductCardProps) => {
  const setPosters = useSetAtom(postersAtom);
  const { authRequestClient } = useAuthFetch();

  const handleDeletePoster = async () => {
    if (!authRequestClient) return;

    const response = await authRequestClient.product.deletePoster(poster.id);
    if (response?.posters) {
      setPosters(response?.posters);
    }
  };

  return (
    <Card className="flex flex-col items-center">
      <CardHeader className="text-center flex-col justify-center items-center">
        <div className="flex gap-x-1">
          <CardTitle>{poster.title}</CardTitle>
          <IoTrashOutline onClick={() => handleDeletePoster()} className="cursor-pointer text-red-500" />
        </div>
        <div className="flex text-sm font-serif">
          <p>Created:</p>
          <p className="ml-1 italic">{`${new Date().toISOString().split("T")[0]}`}</p>
        </div>
      </CardHeader>

      <Divider />

      <CardContent className="mt-2 flex flex-col items-center">
        <img
          key={poster.id}
          className="w-40 h-40 border-4 border-gray-400 p-0.5 shadow-lg rounded-2xl hover:scale-150 transition-transform duration-150"
          src={poster.posterImageUrl}
          alt={poster.title}
        />
      </CardContent>

      <Divider />
      <CardFooter className="flex-col justify-between text-sm font-serif">
        <div className="flex ">
          <p>Artist:</p>
          <p className="ml-1 italic">{`${poster.artistFullName}`}</p>
        </div>
        <p>{`${poster.formatPrices[0].price.toFixed(2)}.-`}</p>
      </CardFooter>
    </Card>
  );
};
