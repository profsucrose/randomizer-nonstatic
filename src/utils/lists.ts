export async function getLists() {
  const listsRaw = await (await fetch('/api/list')).json();
    return listsRaw
}

/**
  A string hashing function based on Daniel J. Bernstein's popular 'times 33' hash algorithm.
  Adapted from https://github.com/MatthewBarker/hash-string/blob/master/source/hash-string.js
*/
export function hashString(text: string) {
  let hash = 5381;
  let index = text.length;

  while (index) {
    hash = (hash * 33) ^ text.charCodeAt(--index);
  }

  return (hash >>> 0).toString(36);
}