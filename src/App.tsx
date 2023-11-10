import "./App.css";

// LOG IN WITH SPOTIFY WORKS

// import { SpotifyApi } from "@spotify/web-api-ts-sdk";

// const sdk = SpotifyApi.withUserAuthorization(
//   import.meta.env.VITE_SPOTIFY_CLIENT_ID,
//   import.meta.env.VITE_REDIRECT_TARGET,
//   [
//     "user-read-playback-state",
//     "user-modify-playback-state",
//     "user-read-currently-playing",
//     "user-read-email",
//   ]
// );
// const items = await sdk.search("The Beatles", ["artist"]);

// console.table(
//   items.artists.items.map((item) => ({
//     name: item.name,
//     followers: item.followers.total,
//     popularity: item.popularity,
//   }))
// );

function App() {
  // const [spotprofile, setProfile] = useState<UserProfile>();

  return (
    <>
      <div className=" bg-slate-500 h-screen">
        <a>hello</a>
      </div>
    </>
  );
}

export default App;
