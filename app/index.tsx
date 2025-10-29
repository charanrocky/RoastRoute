// app/index.tsx
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import coffeeShopsData from "../data/mock-coffee-shops.json";

const { height, width } = Dimensions.get("window");

type Shop = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  rating: number;
  specialty: string;
};

export default function FinderScreen() {
  const router = useRouter();
  const mapRef = useRef<MapView | null>(null);

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // load location
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // default to LA if denied
          setUserLocation({ latitude: 34.052235, longitude: -118.243683 });
        } else {
          const pos = await Location.getCurrentPositionAsync({});
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      } catch (e) {
        console.warn("Location error", e);
        setUserLocation({ latitude: 34.052235, longitude: -118.243683 });
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  const shops: Shop[] = useMemo(() => coffeeShopsData as Shop[], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return shops;
    return shops.filter((s) => s.name.toLowerCase().includes(q));
  }, [shops, query]);

  const goToShop = (id: string) => {
    router.push(`/shop/${id}`);
  };

  // map-list sync: center map on shop
  const centerOnShop = (shop: Shop) => {
    setSelectedId(shop.id);
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: shop.latitude,
          longitude: shop.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        500
      );
    }
  };

  if (loadingLocation || !userLocation) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading location & map...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search coffee shops..."
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
      </View>

      <MapView
        ref={(r) => (mapRef.current = r)}
        style={styles.map}
        initialRegion={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
      >
        {filtered.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={{ latitude: shop.latitude, longitude: shop.longitude }}
            title={shop.name}
            description={shop.address}
            pinColor={selectedId === shop.id ? "#3b82f6" : undefined}
            onCalloutPress={() => goToShop(shop.id)}
          />
        ))}
      </MapView>

      <View style={styles.listContainer}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.listItem,
                selectedId === item.id ? styles.listItemSelected : null,
              ]}
              onPress={() => {
                centerOnShop(item);
              }}
              onLongPress={() => goToShop(item.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.shopName}>{item.name}</Text>
                <Text style={styles.shopAddr}>{item.address}</Text>
                <Text style={styles.shopMeta}>
                  ⭐ {item.rating.toFixed(1)} • {item.specialty}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => goToShop(item.id)}
              >
                <Text style={{ color: "white" }}>Details</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ padding: 12 }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { height: height * 0.5, width },
  listContainer: { flex: 1 },
  listItem: {
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  listItemSelected: { backgroundColor: "#e6f0ff" },
  shopName: { fontSize: 16, fontWeight: "700" },
  shopAddr: { color: "#666", marginTop: 4 },
  shopMeta: { color: "#444", marginTop: 6 },
  detailsBtn: {
    backgroundColor: "#3b82f6",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchContainer: { padding: 12, backgroundColor: "#fff" },
  searchInput: {
    backgroundColor: "#f1f3f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
});
