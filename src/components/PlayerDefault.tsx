// import * as Switch from "@radix-ui/react-switch";
import { Image } from "@spotify/web-api-ts-sdk";

interface UIProps {
  img: Image | undefined;
  title: string | undefined;
  artist: string | undefined;
  album: string | undefined;
}

function PlayerDefault({ img, title, artist, album }: UIProps) {
  return (
    <>
      <section className="flex justify-center items-center flex-col h-screen w-screen">
        {/* <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          DOC PIP
        </button>
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          FUll SCREEN
        </button>
        <Switch.Root className="w-[42px] h-[25px] bg-zinc-400 rounded-full relative data-[state=checked]:bg-black outline-none cursor-pointer">
          <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root> */}
        {/* </div> */}

        <div className="h-full w-full flex align-center justify-center">
          <div className="flex flex-col flex-shrink-0 w-full justify-center px-10 gap-12">
            <div className="relative">
              <img
                src={img === undefined ? "nosong.png" : img.url}
                className="rounded-2xl h-auto w-full shadow-md bg-black"
              />
            </div>
            <div className="flex flex-col w-full text-white break-words">
              <h1 className="text-4xl font-bold">
                {title === undefined ? "No Song Is Playing" : title}
              </h1>
              <h2 className="text-2xl font-bold">
                {artist === undefined ? "Please Play A Song" : artist}
              </h2>
              <h3 className="text-xl font-semibold opacity-80">
                {album === undefined ? "" : album}
              </h3>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlayerDefault;
