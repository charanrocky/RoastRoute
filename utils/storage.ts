// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "favorites";

export async function getFavoriteIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("getFavoriteIds", e);
    return [];
  }
}

export async function saveFavoriteIds(ids: string[]) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch (e) {
    console.error("saveFavoriteIds", e);
  }
}

export async function addFavoriteId(id: string) {
  const ids = await getFavoriteIds();
  if (!ids.includes(id)) {
    ids.push(id);
    await saveFavoriteIds(ids);
  }
}

export async function removeFavoriteId(id: string) {
  let ids = await getFavoriteIds();
  ids = ids.filter((x) => x !== id);
  await saveFavoriteIds(ids);
}
