// import * as Switch from "@radix-ui/react-switch";
import * as Slider from "@radix-ui/react-slider";
import { Image } from "@spotify/web-api-ts-sdk";
import formatDuration from "format-duration";

interface UIProps {
  img: Image | undefined;
  title: string | undefined;
  artist: string | undefined;
  album: string | undefined;
  startTime: number | undefined;
  endTime: number | undefined;
}

function formatPercentage(
  startMS: number | undefined,
  endMS: number | undefined
): number {
  if (startMS === undefined || endMS === undefined) {
    return 0;
  }

  let temp = startMS / endMS;
  temp = temp * 100;
  console.log("slider value at", temp);
  return temp;
}

// function bgClassNames(img: Image | undefined): string {
//   if (img === undefined) {
//     return `absolute h-screen w-screen bg-[url("nosong.png")] bg-cover blur-lg`;
//   }

//   return `absolute h-screen w-screen bg-[url(${img})] bg-cover blur-lg`;
// }
// className="absolute h-screen w-screen bg-[url(https://placekitten.com/1400)] bg-cover blur-lg"
function PlayerDefault({
  img,
  title,
  artist,
  album,
  startTime,
  endTime,
}: UIProps) {
  return (
    <>
      <section className="flex justify-center items-center flex-col h-screen w-screen">
        {/* <div className="absolute bg-cover bg-center transition-[background] duration-[2s] ease-in-out z-[-10] h-full w-full blur-2xl transform-gpu">
          <img
            className="h-full w-full bg-auto"
            src={img === undefined ? "nosong.png" : img.url}
          ></img>
        </div> */}

        <div className="h-full w-full flex align-center justify-center">
          <div className="flex flex-col flex-shrink-0 w-full justify-center px-10 gap-12 md:flex-row md:items-center lg:px-28">
            <div className="relative lg:w-10/12">
              <img
                src={img === undefined ? "nosong.png" : img.url}
                className="rounded-2xl h-auto w-full shadow-md bg-black "
              />
            </div>
            <div className="flex flex-col w-full text-white break-words lg:gap-4">
              <h1 className="text-4xl font-bold lg:text-8xl">
                {title === undefined ? "No Song Is Playing" : title}
              </h1>

              <h2 className="text-2xl font-bold lg:text-4xl">
                {artist === undefined ? "Please Play A Song" : artist}
              </h2>
              <h3 className="text-xl font-semibold opacity-80 lg:text-2xl">
                {album === undefined ? "" : album}
              </h3>

              <div className="pt-4">
                <div className="flex justify-between text-lg font-medium text-white lg:text-2xl">
                  <span>
                    {startTime === undefined
                      ? "0:00"
                      : formatDuration(startTime)}
                  </span>
                  <span>
                    {endTime === undefined ? "0:00" : formatDuration(endTime)}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center w-full"
                  defaultValue={[0]}
                  max={100}
                  step={1}
                  value={[formatPercentage(startTime, endTime)]}
                >
                  <Slider.Track className="relative flex-grow h-2 bg-gray-700 rounded-full lg:h-4">
                    <Slider.Range className="absolute bg-white rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-3 h-3 bg-white shadow rounded-xl lg:h-6 lg:w-6"
                    aria-label="TrackProgress"
                  />
                </Slider.Root>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default PlayerDefault;

{
  /* <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          DOC PIP
        </button>
        <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
          FUll SCREEN
        </button>
        <Switch.Root className="w-[42px] h-[25px] bg-zinc-400 rounded-full relative data-[state=checked]:bg-black outline-none cursor-pointer">
          <Switch.Thumb className="block w-[21px] h-[21px] bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]" />
        </Switch.Root> */
}
