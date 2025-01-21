import { useEffect, useState } from "react";
import { SpotifyApi, AudioAnalysis, Image } from "@spotify/web-api-ts-sdk";
// import Box from "./components/BoxTest";
// import { Canvas } from "@react-three/fiber";

import PlayerDefault from "./components/PlayerDefault";
import Debounce from "lodash/debounce";
import UserOverlay from "./components/UserOverlay";

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
  const [intervalID, setIntervalID] = useState(0);

  async function authSpotifyUser() {
    const myUrlPattern = "http://localhost:5173/";
    let isLocal = true;

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname.indexOf(myUrlPattern) >= 0
    ) {
     // alert("It's a local server!");
    } else {
      isLocal = false;
     // alert("It's not a local server!" + window.location.hostname);
    }

    const sdk = SpotifyApi.withUserAuthorization(
      import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      isLocal
        ? import.meta.env.VITE_LOCAL_REDIRECT_TARGET
        : import.meta.env.VITE_DEV_REDIRECT_TARGET,
      [
        "user-read-playback-state",
        "user-modify-playback-state",
        "user-read-currently-playing",
        "user-read-email",
      ]
    );

    // this is just to create the redirect, I dont actually use the user's email info
    const user = await sdk.currentUser.profile();
    console.log(sdk, user);
    setSpotUser(sdk);
  }

  async function getIsPlaying(sdk: SpotifyApi | null) {
    if (sdk === null) {
      console.log("Error! User not logged in yet");
      return;
    }
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

    if (!stats.isActive) {
      console.log("No Song is currently Playing");
      return;
    }

    if (
      stats.nowPlaying != undefined &&
      temp.item.name === stats.nowPlaying?.title
    ) {
      console.log("same song, update only progress");
      stats.songProgress = temp.progress_ms;
      console.log(stats.songProgress);
      setAppInfo(stats);
      return;
    }

    // else this is a totally new track so update all info
    stats.songProgress = temp.progress_ms;
    stats.songDuration = temp.item.duration_ms;

    console.log(temp);

    // await getSongAnalysis(sdk, temp.item.id);
    await getTrackInfo(sdk, temp.item.id);

    setAppInfo(stats);
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

    stats.nowPlaying = track;
  }

  // async function getSongAnalysis(sdk: SpotifyApi, id: string) {
  //   const temp = await sdk.tracks.audioAnalysis(id);
  //   if (temp === null) {
  //     stats.hasAnalyis = false;
  //     stats.firstSong = false;
  //     return;
  //   }
  //   stats.hasAnalyis = true;
  //   stats.firstSong = true;
  //   stats.audioAnalyis = temp;
  // }

  // increment counter every second to update isPlaying
  // A debounced function is a function that delays its execution a certain amount of milliseconds after the last call was received
  // This is called every 500ms
  // 8 hours is 57600ms
  const debounceInterval = Debounce(() => {
    let temp = intervalID;
    temp += 1;
    const eightHours = 57600;
    if (temp >= eightHours) {
      temp = 0;
    }
    setIntervalID(temp);
  }, 500);

  // inital sdk setup
  useEffect(() => {
    if (spotUser === null) {
      console.log("not logged in or error");
      return;
    }
    console.log("Spotify Sync Connected");

    getIsPlaying(spotUser);
    debounceInterval();
  }, [spotUser, intervalID]);

  return (
    <>
      <div className="h-screen w-screen">
        <UserOverlay
          img={appInfo === null ? undefined : appInfo.nowPlaying?.image}
        />

        {spotUser == null ? (
          <div className="flex justify-center items-center flex-col h-screen gap-4">
            <h1 className="text-3xl text-center md:text-5xl text-white font-bold">
              Welcome! Please Connect your spotify account
            </h1>
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
