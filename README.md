# RoastRoute

RoastRoute — Expo (React Native) app to find and save favorite coffee shops.

## Quick start

```bash
git clone <your-repo>
cd RoastRoute
npm install
npx expo start


Structure

app/_layout.tsx — bottom tab layout (Finder, Favorites)

app/index.tsx — Finder: map + list + search

app/shop/[id].tsx — Shop detail (add/remove favorites)

app/favorites.tsx — Favorites tab

data/mock-coffee-shops.json — provided mock data

utils/storage.ts — AsyncStorage helpers


Most challenging part

Making the map and list stay in sync (tapping list recenters map, callouts navigate to detail) and ensuring favorites storage updates correctly across tabs was the trickiest bit. I solved it by keeping favorites in AsyncStorage with small helper functions, using useFocusEffect to reload favorites when the Favorites screen regains focus, and by keeping a mapRef to animate the region when a list item is selected.

components/ — reusable UI components

AI disclosure

I used ChatGPT to help structure the app and refine some implementation details. All code was assembled and tested manually in Expo.


---

## How to run everything (recap)

1. Create the Expo project (TypeScript template recommended).  
2. Add the files above into your project (`app/`, `components/`, `data/`, `utils/`).  
3. Install packages listed earlier.  
4. Run `npx expo start` and open in Expo Go or an emulator.

---

## Final notes / next steps

- This code satisfies the assignment constraints: Bottom tabs (Finder + Favorites), Finder shows Map and List from JSON, tapping markers or list items navigate to details, ShopDetail can add/remove favorites that persist in AsyncStorage, Favorites tab lists saved shops and navigates to details.
- I added **live search**, **map-list sync**, and **remove from favorites** (bonus features).
- If you want:
  - I can convert this to plain JavaScript (remove TypeScript types).
  - I can add swipe-to-delete on the favorites list.
  - I can implement custom map markers (SVG or image).
  - I can prepare a `git` commit-ready repo structure for you to push.

Tell me which of those you'd like next (or say “push to GitHub” and I’ll give you a step-by-step git commit + README content ready to paste).

