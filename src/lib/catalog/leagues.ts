export type Team = {
  id: string;
  name: string;
};

export type League = {
  id: string;
  name: string;
  country: string;
  teams: Team[];
};

// Catálogo estático (Etapa 2) para armar filtros dependientes.
// En Etapa 3 debería coordinarse con Seller para que los IDs sean consistentes.
export const LEAGUES: League[] = [
  {
    id: "premier-league",
    name: "Premier League",
    country: "Inglaterra",
    teams: [
      { id: "manchester-city", name: "Manchester City" },
      { id: "liverpool", name: "Liverpool" },
      { id: "arsenal", name: "Arsenal" },
      { id: "manchester-united", name: "Manchester United" },
    ],
  },
  {
    id: "laliga",
    name: "LaLiga",
    country: "España",
    teams: [
      { id: "real-madrid", name: "Real Madrid" },
      { id: "barcelona", name: "FC Barcelona" },
      { id: "atletico-madrid", name: "Atlético de Madrid" },
    ],
  },
  {
    id: "serie-a",
    name: "Serie A",
    country: "Italia",
    teams: [
      { id: "juventus", name: "Juventus" },
      { id: "inter", name: "Inter" },
      { id: "milan", name: "AC Milan" },
    ],
  },
  {
    id: "liga-profesional-arg",
    name: "Liga Profesional",
    country: "Argentina",
    teams: [
      { id: "boca-juniors", name: "Boca Juniors" },
      { id: "river-plate", name: "River Plate" },
      { id: "racing", name: "Racing Club" },
      { id: "independiente", name: "Independiente" },
    ],
  },
];

export function getLeagueById(id: string): League | undefined {
  return LEAGUES.find((l) => l.id === id);
}

export function getTeamById(teamId: string): { team: Team; league: League } | undefined {
  for (const league of LEAGUES) {
    const team = league.teams.find((t) => t.id === teamId);
    if (team) return { team, league };
  }
  return undefined;
}

export function getTeamsByLeagueId(leagueId: string | undefined): Team[] {
  if (!leagueId) return [];
  return getLeagueById(leagueId)?.teams ?? [];
}
