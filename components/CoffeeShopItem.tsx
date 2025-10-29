// components/CoffeeShopItem.tsx
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function CoffeeShopItem({ shop }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/shop/${shop.id}`)}
    >
      <Text style={styles.name}>{shop.name}</Text>
      <Text style={styles.addr}>{shop.address}</Text>
      <Text style={styles.meta}>
        ⭐ {shop.rating.toFixed(1)} • {shop.specialty}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  name: { fontSize: 16, fontWeight: "700" },
  addr: { color: "#666", marginTop: 6 },
  meta: { color: "#444", marginTop: 8 },
});
