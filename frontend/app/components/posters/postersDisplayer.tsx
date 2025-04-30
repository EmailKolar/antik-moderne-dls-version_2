import { useAtomValue } from "jotai";
import { Link, redirect } from "react-router";
import { postersAtom } from "~/atoms/postersAtom";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import type { types } from "~/lib/client";
import { useState } from "react";

export const PosterDisplayer = () => {
  const posters = useAtomValue(postersAtom);

  const [selectedFormats, setSelectedFormats] = useState<Record<string, types.FormatPriceDto>>({});

  const getCurrentFormatPrice = (posterId: number, formatPrices: types.FormatPriceDto[]): types.FormatPriceDto => {
    return selectedFormats[posterId] || formatPrices[0];
  };

  const handleViewPoster = (posterId: number) => {
    redirect(`/poster/${posterId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-[90%]">
      {posters.map((poster) => {
        const currentFormatPrice = getCurrentFormatPrice(poster.id, poster.formatPrices);

        return (
          <Link
            to={`/poster/${poster.id}`}
            key={poster.id}
            className="w-[22rem] h-auto p-3 flex flex-col justify-center items-center rounded-lg hover:border hover:border-[#cfcfcf] hover:cursor-pointer"
          >
            <img src={poster.posterImageUrl} alt={poster.title} className="w-[95%] h-full rounded-lg" />
            <div className="flex justify-between w-[90%] pt-2">
              <div className="flex flex-col items-start">
                <p className="font-semibold">{poster.title}</p>
                <p className="italic">
                  <span className="font-semibold">Artist:</span> {poster.artistFullName}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex flex-col items-end">
                  <Select
                    onValueChange={(format) => {
                      const selectedFormat = poster.formatPrices.find((fp) => fp.format === format);
                      if (selectedFormat) {
                        setSelectedFormats((prev) => ({
                          ...prev,
                          [poster.id]: selectedFormat,
                        }));
                      }
                    }}
                    defaultValue={currentFormatPrice.format}
                  >
                    <SelectTrigger className="w-[60px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Formats:</SelectLabel>
                        {poster.formatPrices.map((formatPrice: types.FormatPriceDto) => (
                          <SelectItem key={formatPrice.format} value={formatPrice.format}>
                            {formatPrice.format}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <p className="italic text-right">{currentFormatPrice.price} dkk,-</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleViewPoster(poster.id)}
              className="border border-black p-2 font-semibold drop-shadow-mg hover:cursor-pointer hover:scale-105 mt-2"
            >
              View Poster →
            </button>
          </Link>
        );
      })}
    </div>
  );
};
