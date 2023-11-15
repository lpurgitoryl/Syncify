import { useEffect, useState } from "react";
import { SpotifyApi, AudioAnalysis, Image } from "@spotify/web-api-ts-sdk";
// import Box from "./components/BoxTest";
// import { Canvas } from "@react-three/fiber";

import PlayerDefault from "./components/PlayerDefault";
// import Throttle from "lodash/throttle";

interface nowPlaying {
  title: string;
  image: Image;
  artist: string;
  uris: string;
  songID: string;
  album: string;
}

interface statusInfo {
  isActive: boolean;
  firstSong: boolean;
  hasAnalyis: boolean;
  audioAnalyis: AudioAnalysis | undefined;
  nowPlaying?: nowPlaying | undefined;
  energy: number;
  songDuration: number;
  songProgress: number;
}

const stats: statusInfo = {
  isActive: false,
  firstSong: false,
  hasAnalyis: false,
  energy: 0,
  audioAnalyis: undefined,
  nowPlaying: undefined,
  songDuration: 0,
  songProgress: 0,
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
    console.log(sdk, user);
    setSpotUser(sdk);
  }

  async function getIsPlaying(sdk: SpotifyApi) {
    const temp = await sdk.player.getPlaybackState();

    if (temp === null) {
      console.log("Error! Please Check Network Connection");
      return;
    }
    if (temp.is_playing === null) {
      console.log("Error! Please Play A Song On Spotify");
      return;
    }
    if (temp.currently_playing_type != "track") {
      console.log("Error! Please Play A Song On Spotify");
      return;
    }

    stats.isActive = temp.is_playing;

    if (!stats.isActive && !stats.firstSong) {
      console.log("No Song is currently Playing");
      setAppInfo(stats);
      return;
    }

    stats.songProgress = temp.progress_ms;

    await getSongAnalysis(sdk, temp.item.id);
    await getTrackInfo(sdk, temp.item.id);

    setAppInfo(stats);
    console.log(stats);
  }

  async function getTrackInfo(sdk: SpotifyApi, id: string) {
    const temp = await sdk.tracks.get(id);
    const track: nowPlaying = {
      image: temp.album.images[0],
      title: temp.name,
      artist: temp.artists.map((artist) => artist.name).join(" "),
      uris: temp.uri,
      songID: temp.id,
      album: temp.album.name,
    };

    stats.songDuration = temp.duration_ms;
    stats.nowPlaying = track;
  }

  async function getSongAnalysis(sdk: SpotifyApi, id: string) {
    const temp = await sdk.tracks.audioAnalysis(id);
    if (temp === null) {
      stats.hasAnalyis = false;
      stats.firstSong = false;
      return;
    }
    stats.hasAnalyis = true;
    stats.firstSong = true;
    stats.audioAnalyis = temp;
  }

  async function loopy() {
    if (spotUser === null) {
      return;
    }
    // deal with this here bc i shouldnt call it multiple times
    setInterval(() => {
      getIsPlaying(spotUser);
    }, 800);
  }

  // inital sdk setup
  useEffect(() => {
    if (spotUser === null) {
      console.log("not logged in or error");
      return;
    }
    console.log("init sdk set up");

    // getIsPlaying(spotUser);
    loopy();
  }, [spotUser]);

  // call once every second so that the player is up to date with any changes

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
            <PlayerDefault
              img={appInfo === null ? undefined : appInfo.nowPlaying?.image}
              title={appInfo === null ? undefined : appInfo.nowPlaying?.title}
              artist={appInfo === null ? undefined : appInfo.nowPlaying?.artist}
              album={appInfo === null ? undefined : appInfo.nowPlaying?.album}
              startTime={appInfo === null ? undefined : appInfo.songProgress}
              endTime={appInfo === null ? undefined : appInfo.songDuration}
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
