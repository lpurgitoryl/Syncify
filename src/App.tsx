import { useEffect, useState } from "react";
import { SpotifyApi, AudioAnalysis, Image } from "@spotify/web-api-ts-sdk";
// import Box from "./components/BoxTest";
// import { Canvas } from "@react-three/fiber";
import Nav from "./components/UI";
interface nowPlaying {
  title: string;
  image: Image | undefined;
  artist: string;
  uris: string;
  songID: string;
}

interface statusInfo {
  isActive: boolean;
  firstSong: boolean;
  hasAnalyis: boolean;
  audioAnalyis: AudioAnalysis | undefined;
  energy: number;
  nowPlaying?: nowPlaying | undefined;
}

const stats: statusInfo = {
  isActive: false,
  firstSong: false,
  hasAnalyis: false,
  energy: 0,
  audioAnalyis: undefined,
  nowPlaying: undefined,
};

function App() {
  const [appInfo, setAppInfo] = useState<statusInfo | null>(null);
  const [spotUser, setSpotUser] = useState<SpotifyApi | null>(null);

  async function authSpotifyUser() {
    const sdk = SpotifyApi.withUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      import.meta.env.VITE_REDIRECT_TARGET,
      [
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-email",
      ]
    );

    const user = await sdk.currentUser.profile();
    console.log(user.email);
    setSpotUser(sdk);
  }

  async function getIsPlaying(sdk: SpotifyApi) {
    const temp = await sdk.player.getPlaybackState();

    if (temp === null) {
      return;
    }
    if (temp.is_playing === null) {
      return;
    }
    if (temp.currently_playing_type != "track") {
      return;
    }

    stats.isActive = temp.is_playing;
    await getSongAnalytics(sdk, temp.item.id);
    await getTrackInfo(sdk, temp.item.id);

    setAppInfo(stats);
  }

  async function getTrackInfo(sdk: SpotifyApi, id: string) {
    const temp = await sdk.tracks.get(id);
    const track: nowPlaying = {
      image: temp.album.images[0],
      title: temp.name,
      artist: temp.artists[0].name,
      uris: temp.uri,
      songID: temp.id,
    };

    stats.nowPlaying = track;
  }

  async function getSongAnalytics(sdk: SpotifyApi, id: string) {
    const temp = await sdk.tracks.audioAnalysis(id);
    stats.hasAnalyis = true;
    stats.firstSong = false;
    stats.audioAnalyis = temp;
  }

  useEffect(() => {
    if (spotUser === null) {
      console.log("not logged in or error");
      return;
    }
    console.log("here");

    getIsPlaying(spotUser);
  }, [spotUser]);

  return (
    <>
      <div className="h-screen w-screen bg-slate-600/75">
        {spotUser == null ? (
          <div className="flex justify-center items-center flex-col h-screen ">
            <h1>Welcome! Please Connect your spotify account</h1>
            <button
              onClick={authSpotifyUser}
              className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
            >
              Login to Spotify
            </button>
          </div>
        ) : (
          <>
            <Nav
              img={appInfo === null ? undefined : appInfo.nowPlaying?.image}
            />
            {/* <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Box position={[-1.2, 0, 0]} />
              <Box position={[1.2, 0, 0]} />
            </Canvas> */}
          </>
        )}
      </div>
    </>
  );
}

export default App;
