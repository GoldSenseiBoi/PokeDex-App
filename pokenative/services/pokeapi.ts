const BASE_URL = 'https://pokeapi.co/api/v2';

export async function get<T>(pathOrUrl: string): Promise<T> {
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${BASE_URL}${pathOrUrl}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`PokeAPI error ${res.status} on ${url}`);
  return res.json() as Promise<T>;
}
