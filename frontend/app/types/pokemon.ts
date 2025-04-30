export interface Pokemon {
  id: number,
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  name: string,
  game_indices: {
    game_index: number;
    version: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    back_default: string,
    back_female: string,
    back_shiny: string,
    back_shiny_female: string,
    front_default: string,
    front_female: string,
    front_shiny: string,
    front_shiny_female: string
    versions: {
      'generation-i': {
        'red-blue': {
          back_default: string;
          back_gray: string;
          back_transparent: string;
          front_default: string;
          front_gray: string;
          front_transparent: string;
        };
        yellow: {
          back_default: string;
          back_gray: string;
          back_transparent: string;
          front_default: string;
          front_gray: string;
          front_transparent: string;
        };
      };
      'generation-ii': {
        crystal: {
          back_default: string;
          back_shiny: string;
          back_shiny_transparent: string;
          back_transparent: string;
          front_default: string;
          front_shiny: string;
          front_shiny_transparent: string;
          front_transparent: string;
        };
        gold: {
          back_default: string;
          back_shiny: string;
          front_default: string;
          front_shiny: string;
        };
        silver: {
          back_default: string;
          back_shiny: string;
          front_default: string;
          front_shiny: string;
        };
      };
      'generation-iv': {
        'diamond-pearl': {
          back_default: string;
          back_female: string;
          back_shiny: string;
          back_shiny_female: string;
          front_default: string;
          front_female: string;
          front_shiny: string;
          front_shiny_female: string;
        };
        platinum: {
          back_default: string;
          back_female: string;
          back_shiny: string;
          back_shiny_female: string;
          front_default: string;
          front_female: string;
          front_shiny: string;
          front_shiny_female: string;
        };
      };
      'generation-vii': {
        'ultra-sun-ultra-moon': {
          front_default: string;
          front_female: string;
          front_shiny: string;
          front_shiny_female: string;
        };
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
}


// SOME OF FULL OBJECT fetched directly from pokeapi
//   {
//     "abilities": [
//         {
//             "ability": {
//                 "name": "overgrow",
//                 "url": "https://pokeapi.co/api/v2/ability/65/"
//             },
//             "is_hidden": false,
//             "slot": 1
//         },
//         {
//             "ability": {
//                 "name": "chlorophyll",
//                 "url": "https://pokeapi.co/api/v2/ability/34/"
//             },
//             "is_hidden": true,
//             "slot": 3
//         }
//     ],
//     "base_experience": 142,
//     "game_indices": [
//         {
//             "game_index": 9,
//             "version": {
//                 "name": "red",
//                 "url": "https://pokeapi.co/api/v2/version/1/"
//             }
//         },
//         {
//             "game_index": 9,
//             "version": {
//                 "name": "blue",
//                 "url": "https://pokeapi.co/api/v2/version/2/"
//             }
//         },
//         {
//             "game_index": 9,
//             "version": {
//                 "name": "yellow",
//                 "url": "https://pokeapi.co/api/v2/version/3/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "gold",
//                 "url": "https://pokeapi.co/api/v2/version/4/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "silver",
//                 "url": "https://pokeapi.co/api/v2/version/5/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "crystal",
//                 "url": "https://pokeapi.co/api/v2/version/6/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "ruby",
//                 "url": "https://pokeapi.co/api/v2/version/7/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "sapphire",
//                 "url": "https://pokeapi.co/api/v2/version/8/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "emerald",
//                 "url": "https://pokeapi.co/api/v2/version/9/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "firered",
//                 "url": "https://pokeapi.co/api/v2/version/10/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "leafgreen",
//                 "url": "https://pokeapi.co/api/v2/version/11/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "diamond",
//                 "url": "https://pokeapi.co/api/v2/version/12/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "pearl",
//                 "url": "https://pokeapi.co/api/v2/version/13/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "platinum",
//                 "url": "https://pokeapi.co/api/v2/version/14/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "heartgold",
//                 "url": "https://pokeapi.co/api/v2/version/15/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "soulsilver",
//                 "url": "https://pokeapi.co/api/v2/version/16/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "black",
//                 "url": "https://pokeapi.co/api/v2/version/17/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "white",
//                 "url": "https://pokeapi.co/api/v2/version/18/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "black-2",
//                 "url": "https://pokeapi.co/api/v2/version/21/"
//             }
//         },
//         {
//             "game_index": 2,
//             "version": {
//                 "name": "white-2",
//                 "url": "https://pokeapi.co/api/v2/version/22/"
//             }
//         }
//     ],
//     "height": 10,
//     "held_items": [],
//     "id": 2,
//     "is_default": true,
//     "name": "ivysaur",
//     "order": 2,
//     "species": {
//         "name": "ivysaur",
//         "url": "https://pokeapi.co/api/v2/pokemon-species/2/"
//     },
//     "sprites": {
//         "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/2.png",
//         "back_female": null,
//         "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/2.png",
//         "back_shiny_female": null,
//         "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
//         "front_female": null,
//         "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/2.png",
//         "front_shiny_female": null,
//         "other": {
//             "dream_world": {
//                 "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg",
//                 "front_female": null
//             },
//             "home": {
//                 "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/2.png",
//                 "front_female": null,
//                 "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/2.png",
//                 "front_shiny_female": null
//             },
//             "official-artwork": {
//                 "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/2.png",
//                 "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/2.png"
//             },
//             "showdown": {
//                 "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/2.gif",
//                 "back_female": null,
//                 "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/back/shiny/2.gif",
//                 "back_shiny_female": null,
//                 "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/2.gif",
//                 "front_female": null,
//                 "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/2.gif",
//                 "front_shiny_female": null
//             }
//         },
//         "versions": {
//             "generation-i": {
//                 "red-blue": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/2.png",
//                     "back_gray": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/back/gray/2.png",
//                     "back_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/back/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/2.png",
//                     "front_gray": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/gray/2.png",
//                     "front_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/2.png"
//                 },
//                 "yellow": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/2.png",
//                     "back_gray": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/back/gray/2.png",
//                     "back_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/back/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/2.png",
//                     "front_gray": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/gray/2.png",
//                     "front_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/yellow/transparent/2.png"
//                 }
//             },
//             "generation-ii": {
//                 "crystal": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/2.png",
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/back/shiny/2.png",
//                     "back_shiny_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/shiny/2.png",
//                     "back_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/back/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/shiny/2.png",
//                     "front_shiny_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/shiny/2.png",
//                     "front_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/crystal/transparent/2.png"
//                 },
//                 "gold": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/2.png",
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/back/shiny/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/shiny/2.png",
//                     "front_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/gold/transparent/2.png"
//                 },
//                 "silver": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/2.png",
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/back/shiny/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/shiny/2.png",
//                     "front_transparent": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-ii/silver/transparent/2.png"
//                 }
//             },
//             "generation-iii": {
//                 "emerald": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/shiny/2.png"
//                 },
//                 "firered-leafgreen": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/2.png",
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/back/shiny/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen/shiny/2.png"
//                 },
//                 "ruby-sapphire": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/2.png",
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/back/shiny/2.png",
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/2.png",
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/ruby-sapphire/shiny/2.png"
//                 }
//             },
//             "generation-iv": {
//                 "diamond-pearl": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/2.png",
//                     "back_female": null,
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/back/shiny/2.png",
//                     "back_shiny_female": null,
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/diamond-pearl/shiny/2.png",
//                     "front_shiny_female": null
//                 },
//                 "heartgold-soulsilver": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/2.png",
//                     "back_female": null,
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/back/shiny/2.png",
//                     "back_shiny_female": null,
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/shiny/2.png",
//                     "front_shiny_female": null
//                 },
//                 "platinum": {
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/2.png",
//                     "back_female": null,
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/back/shiny/2.png",
//                     "back_shiny_female": null,
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/platinum/shiny/2.png",
//                     "front_shiny_female": null
//                 }
//             },
//             "generation-v": {
//                 "black-white": {
//                     "animated": {
//                         "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/2.gif",
//                         "back_female": null,
//                         "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/back/shiny/2.gif",
//                         "back_shiny_female": null,
//                         "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/2.gif",
//                         "front_female": null,
//                         "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/shiny/2.gif",
//                         "front_shiny_female": null
//                     },
//                     "back_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/2.png",
//                     "back_female": null,
//                     "back_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/back/shiny/2.png",
//                     "back_shiny_female": null,
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/shiny/2.png",
//                     "front_shiny_female": null
//                 }
//             },
//             "generation-vi": {
//                 "omegaruby-alphasapphire": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/omegaruby-alphasapphire/shiny/2.png",
//                     "front_shiny_female": null
//                 },
//                 "x-y": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vi/x-y/shiny/2.png",
//                     "front_shiny_female": null
//                 }
//             },
//             "generation-vii": {
//                 "icons": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/icons/2.png",
//                     "front_female": null
//                 },
//                 "ultra-sun-ultra-moon": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/2.png",
//                     "front_female": null,
//                     "front_shiny": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-vii/ultra-sun-ultra-moon/shiny/2.png",
//                     "front_shiny_female": null
//                 }
//             },
//             "generation-viii": {
//                 "icons": {
//                     "front_default": "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/2.png",
//                     "front_female": null
//                 }
//             }
//         }
//     },
//     "types": [
//         {
//             "slot": 1,
//             "type": {
//                 "name": "grass",
//                 "url": "https://pokeapi.co/api/v2/type/12/"
//             }
//         },
//         {
//             "slot": 2,
//             "type": {
//                 "name": "poison",
//                 "url": "https://pokeapi.co/api/v2/type/4/"
//             }
//         }
//     ],
//     "weight": 130
// }