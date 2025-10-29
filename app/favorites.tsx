// app/favorites.tsx
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import coffeeShops from "../data/mock-coffee-shops.json";
import { getFavoriteIds, removeFavoriteId } from "../utils/storage";

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<any[]>([]);

  const loadFavorites = async () => {
    const ids = await getFavoriteIds();
    const favs = (coffeeShops as any[]).filter((s) => ids.includes(s.id));
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const confirmRemove = (id: string, name: string) => {
    Alert.alert(
      "Remove favorite",
      `Remove ${name} from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await removeFavoriteId(id);
            loadFavorites();
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16 }}>
          You haven't saved any favorites yet!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={favorites}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push(`/shop/${item.id}`)}
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.addr}>{item.address}</Text>
            <Text style={styles.meta}>
              ⭐ {item.rating.toFixed(1)} • {item.specialty}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => confirmRemove(item.id, item.name)}
          >
            <Text style={{ color: "white" }}>Remove</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  item: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  name: { fontWeight: "700", fontSize: 16 },
  addr: { color: "#666", marginTop: 4 },
  meta: { color: "#444", marginTop: 6 },
  removeBtn: {
    backgroundColor: "#ef4444",
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
});
