import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "~/components/ui/button";
import type { types } from "~/lib/client";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Divider } from "~/components/Divider";
import { Toaster } from "sonner";
import { usePosterCreate } from "~/hooks/usePosterCreate";

interface TabCreatePosterProps {
  changeTabTo: (tab: string) => void;
}

export const TabCreatePoster = ({ changeTabTo }: TabCreatePosterProps) => {
  const { posterCreate, isCreating, onChangeActions, price, handleClickActions, filteredFormats } = usePosterCreate(changeTabTo);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Poster</CardTitle>
        <CardDescription>New poster can be created to be sold on AntikModerne.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-2">
        <div className="flex">
          <div className="space-y-1">
            <Label htmlFor="posterName">Poster name</Label>
            <Input
              value={posterCreate.title}
              onChange={(event) => onChangeActions.onChangeTitle(event.target.value)}
              id="posterName"
              type="text"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="artistName">Artist name</Label>
            <Input
              value={posterCreate.artistFullName}
              onChange={(event) => onChangeActions.onChangeArtistName(event.target.value)}
              id="artistName"
              type="text"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="posterImageUrl">The URL for the poster</Label>
          <Input
            value={posterCreate.posterImageUrl}
            onChange={(event) => onChangeActions.onChangeUrl(event.target.value)}
            id="posterImageUrl"
            type="text"
          />
        </div>
        <img
          key={posterCreate.posterImageUrl}
          className="w-40 h-40 border-4 border-gray-400 p-0.5 shadow-lg rounded-2xl"
          src={posterCreate.posterImageUrl ? posterCreate.posterImageUrl : "no-image.png"}
          alt={posterCreate.title}
        />

        <div className="flex">
          <div>
            <Label>Format</Label>
            <Select onValueChange={(e: types.Format) => onChangeActions.onFormatChange(e)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Formats</SelectLabel>
                  {filteredFormats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input value={price} onChange={(event) => onChangeActions.onPriceChange(event.target.value)} id="price" type="text" />
          </div>
        </div>
        <Button onClick={() => handleClickActions.onAddFormatPrice()}>Add the format with price to poster</Button>
        <Divider />
      </CardContent>
      <CardFooter className="w-full flex flex-col items-center justify-center">
        <Toaster />
        {posterCreate.formatPrices.map((formatPrice) => (
          <Card key={formatPrice.format} className="w-4/5 flex items-center justify-between gap-x-2">
            <div className="flex flex-col m-1 text-left">
              <p>format: {formatPrice.format}</p>
              <p>price: {formatPrice.price}</p>
            </div>
            <Button variant={"destructive"} onClick={() => handleClickActions.onRemoveFormatPrice(formatPrice.format)}>
              Remove
            </Button>
          </Card>
        ))}
        <Button variant={"destructive"} disabled={isCreating} onClick={() => handleClickActions.submitPoster()}>
          Add the created poster
        </Button>
      </CardFooter>
    </Card>
  );
}
