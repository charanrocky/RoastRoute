// app/shop/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import coffeeShops from "../../data/mock-coffee-shops.json";
import {
  addFavoriteId,
  getFavoriteIds,
  removeFavoriteId,
} from "../../utils/storage";

export default function ShopDetail() {
  const { id } = useLocalSearchParams() as { id: string };
  const router = useRouter();
  const shop = (coffeeShops as any[]).find((s) => s.id === id);

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    (async () => {
      const ids = await getFavoriteIds();
      setIsFavorite(ids.includes(id));
    })();
  }, [id]);

  if (!shop) {
    return (
      <View style={styles.center}>
        <Text>Shop not found</Text>
      </View>
    );
  }

  const onAdd = async () => {
    await addFavoriteId(id);
    setIsFavorite(true);
    Alert.alert("Saved", `${shop.name} added to favorites.`);
  };

  const onRemove = async () => {
    await removeFavoriteId(id);
    setIsFavorite(false);
    Alert.alert("Removed", `${shop.name} removed from favorites.`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shop.name}</Text>
      <Text style={styles.addr}>{shop.address}</Text>
      <Text style={styles.meta}>⭐ {shop.rating.toFixed(1)}</Text>
      <Text style={styles.meta}>☕ {shop.specialty}</Text>

      <View style={{ height: 20 }} />

      {!isFavorite ? (
        <TouchableOpacity style={styles.primaryBtn} onPress={onAdd}>
          <Text style={styles.primaryTxt}>Add to Favorites</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.dangerBtn} onPress={onRemove}>
          <Text style={styles.primaryTxt}>Remove from Favorites</Text>
        </TouchableOpacity>
      )}

      <View style={{ height: 12 }} />

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.secondaryTxt}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  addr: { color: "#666", marginBottom: 8 },
  meta: { fontSize: 16, marginBottom: 6 },
  primaryBtn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  dangerBtn: {
    backgroundColor: "#ef4444",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  primaryTxt: { color: "white", fontWeight: "700" },
  secondaryBtn: { alignItems: "center", padding: 12 },
  secondaryTxt: { color: "#3b82f6", fontWeight: "700" },
});
