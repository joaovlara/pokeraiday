import { z } from "zod";

export const PokemonSchema = z.object({
  id: z.number(),
  name: z.string(),
  sprites: z.object({
    front_default: z.string().url().nullable(),
    other: z.object({
      ["official-artwork"]: z.object({
        front_default: z.string().url().nullable(),
      }),
    }).optional(), // <- adiciona o campo "other"
  }),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      stat: z.object({ name: z.string() }),
    })
  ),
  types: z.array(
    z.object({
      type: z.object({ name: z.string() }),
    })
  ),
  moves: z.array(
    z.object({
      move: z.object({ name: z.string() }),
      version_group_details: z.array(
        z.object({
          level_learned_at: z.number(),
          move_learn_method: z.object({ name: z.string() }),
          version_group: z.object({ name: z.string() }),
        })
      ),
    })
  ),
});

export type PokemonAPI = z.infer<typeof PokemonSchema>;
