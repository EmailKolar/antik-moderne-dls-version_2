import {atom} from "jotai";
import type { types } from "~/lib/client";

export const cartAtom = atom<types.BasketDto>();