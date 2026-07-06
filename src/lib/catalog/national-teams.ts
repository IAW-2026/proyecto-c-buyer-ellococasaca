export type NationalTeam = {
  id: string;
  name: string;
  confederation: "CONMEBOL" | "UEFA" | "CONCACAF" | "CAF" | "AFC" | "OFC";
};

export const NATIONAL_TEAMS: NationalTeam[] = [
  { id: "argentina", name: "Argentina", confederation: "CONMEBOL" },
  { id: "brasil", name: "Brasil", confederation: "CONMEBOL" },
  { id: "uruguay", name: "Uruguay", confederation: "CONMEBOL" },
  { id: "alemania", name: "Alemania", confederation: "UEFA" },
  { id: "espana", name: "España", confederation: "UEFA" },
  { id: "francia", name: "Francia", confederation: "UEFA" },
];

export function getNationalTeamById(id: string | undefined): NationalTeam | undefined {
  if (!id) return undefined;
  return NATIONAL_TEAMS.find((t) => t.id === id);
}
