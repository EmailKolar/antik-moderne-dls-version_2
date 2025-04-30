import { useSetAtom } from "jotai";
import { useState } from "react";
import { postersAtom } from "~/atoms/postersAtom";
import type { types } from "~/lib/client";
import { toast } from "sonner";
import useAuthFetch from "./useAuthFetch";

const defaultPoster: types.PosterCreate = {
    title: "",
    artistFullName: "",
    posterImageUrl: "",
    formatPrices: [],
};

const formats = ["A4", "30x30 cm", "30x40 cm", "50x50", "50x70 cm", "70x70 cm", "70x100 cm", "100x100 cm", "100x140 cm"];

export const usePosterCreate = (changeTabTo: (tab: string) => void) => {
    const setPosters = useSetAtom(postersAtom);
    const [posterCreate, setPosterCreate] = useState<types.PosterCreate>(defaultPoster);
    const [format, setFormat] = useState<types.Format | null>();
    const [price, setPrice] = useState("1000");
    const [isCreating, setIsCreating] = useState(false);

    const filteredFormats = formats.filter((format) => !posterCreate.formatPrices.find((posterFormat) => posterFormat.format === format));

    const { authRequestClient } = useAuthFetch();

    const onChangeActions = {
        onChangeTitle: (title: string) => {
            setPosterCreate((cur) => ({ ...cur, title }));
        },
        onChangeArtistName: (artistName: string) => {
            setPosterCreate((cur) => ({ ...cur, artistFullName: artistName }));
        },
        onChangeUrl: (imageUrl: string) => {
            setPosterCreate((cur) => ({ ...cur, posterImageUrl: imageUrl }));
        },
        onFormatChange: (format: types.Format) => {
            setFormat(format);
        },
        onPriceChange: (price: string) => {
            setPrice(price);
        }
    }

    const handleClickActions = {
        submitPoster: async () => {
            if (isCreating || !isPosterCreationValid(posterCreate)) return;
            setIsCreating(true);

            try {
                if (!authRequestClient) return;
                const response = await authRequestClient.product.createPoster({ posterCreate });
                if (response && response.posters) setPosters(response.posters);
                changeTabTo("products");
            } catch (error) {
                triggerToaster("An error with the creation of the poster");
                console.error("Error");
            } finally {
                setIsCreating(false);
            }
        },
        onRemoveFormatPrice: (format: types.Format) => {
            if (!format) return;
            setPosterCreate((cur) => ({ ...cur, formatPrices: [...cur.formatPrices.filter((formatPrice) => formatPrice.format !== format)] }));
        },
        onAddFormatPrice: () => {
            const priceNumber = Number(price);
            if (!priceNumber) {
                triggerToaster("The price must be number!")
                setPrice("1000");
                return;
            }

            if (!format) return;

            setPosterCreate((cur) => ({ ...cur, formatPrices: [...cur.formatPrices, { format: format, price: priceNumber }] }));
            setPrice("1000");
            setFormat(null);
        }
    }

    const triggerToaster = (description: string) => {
        toast("Failed to create poster", {
            description,
        });
    }

    const isPosterCreationValid = (posterCreate: types.PosterCreate) => {
        if (posterCreate.artistFullName.length === 0) {
            triggerToaster("Artist name for the poster is missing");
            return false;
        } else if (posterCreate.title.length === 0) {
            triggerToaster("Poster title is missing");
            return false;
        } else if (posterCreate.formatPrices.length === 0) {
            triggerToaster("At least one format with price have to be defined");
            return false;
        }
        return true;
    }

    return { posterCreate, isCreating, onChangeActions, price, handleClickActions, filteredFormats };
}