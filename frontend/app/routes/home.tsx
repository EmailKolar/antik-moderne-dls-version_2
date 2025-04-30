import type { Route } from "./+types/home";
import { NavLink } from "react-router";
import getRequestClient from "~/lib/getRequestClient";
import { PosterDisplayer } from "~/components/posters/postersDisplayer";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { postersAtom } from "~/atoms/postersAtom";
import type { types } from "~/lib/client";

export function meta({}: Route.MetaArgs) {
  return [{ title: "ANTIK MODERNE" }, { name: "description", content: "Welcome to Antik Moderne!" }];
}

export function loader({}: Route.LoaderArgs) {
  return (async () => {
    try {
      const posters = await getRequestClient(undefined, true).product.getPosters();

      return posters;
    } catch (e) {
      console.error("Error fethcing posters", e);
      return { posters: [] as types.PosterDto[] };
    }
  })();
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posters: fetchedPosters } = loaderData;
  const [posters, setPosters] = useAtom(postersAtom);

  useEffect(() => {
    if (posters.length > 0) return;
    if (fetchedPosters) {
      setPosters(fetchedPosters);
    }
  }, [fetchedPosters, setPosters]);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="flex flex-col w-[95%] h-[700px]">
        <img key="poster-hero.jpg" src="/poster-hero.png" alt="poster-hero" className="w-full h-full object-cover" />
        <div className="absolute flex flex-col top-1/5 left-1/5">
          <h1 className="text-6xl text-white text-left font-bold mb-4">Welcome to Antik Moderne</h1>
          <p className=" pt-4 w-1/2 text-white text-left text-2xl mb-6">
            Discover a curated collection of timeless posters that blend the elegance of the past with the modern
            aesthetic.
          </p>
          <NavLink
            to="/posters"
            className="px-6 py-2 font-medium bg-white text-black w-fit transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
          >
            Shop Now →
          </NavLink>
        </div>
      </div>
      <div className="flex items-center w-[90%]">
        <h1 className="text-6xl text-black text-center font-bold mb-10 pt-10 mr-6">Featured Posters</h1>
        <NavLink to="/posters" className="hover:underline hover:cursor-pointer mt-2">
          See All →
        </NavLink>
      </div>
      <PosterDisplayer />
    </div>
  );
}
