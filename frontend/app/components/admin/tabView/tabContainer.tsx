import { useAtomValue } from "jotai";
import { Input } from "../../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { TabCreatePoster } from "./tabCreatePoster";
import { TabPosterCard } from "./tabPosterCard";
import { useState } from "react";
import { postersAtom } from "~/atoms/postersAtom";

export const TabContainer = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [searchString, setSearchString] = useState("");
  const posters = useAtomValue(postersAtom);

  const changeTabTo = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="p-4 border border-black rounded-2xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="products">Products</TabsTrigger>
        <TabsTrigger value="add">Add Product</TabsTrigger>
      </TabsList>
      <TabsContent value="products">
        <Input
          placeholder="Filter products..."
          value={searchString}
          onChange={(event) => setSearchString(event.target.value.toLowerCase())}
          className="max-w-sm my-4"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {posters
            .filter(
              (poster) =>
                poster.artistFullName.toLowerCase().includes(searchString) ||
                poster.title.toLowerCase().includes(searchString) ||
                poster.createdAt.includes(searchString)
            )
            .map((poster) => (
              <TabPosterCard key={poster.title} poster={poster} />
            ))}
        </div>
      </TabsContent>

      <TabsContent value="add">
        <TabCreatePoster changeTabTo={changeTabTo} />
      </TabsContent>
    </Tabs>
  );
}
