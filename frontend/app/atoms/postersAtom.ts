import {atom} from "jotai";
import type { types } from "~/lib/client";

export const postersAtom = atom<types.PosterDto[]>([]);