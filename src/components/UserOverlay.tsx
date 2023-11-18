import { Image } from "@spotify/web-api-ts-sdk";

interface UserOverlayProps {
  img: Image | undefined;
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function UserOverlay({ img }: UserOverlayProps) {
  return (
    <>
      <div className="absolute bg-cover bg-center transition-[background] duration-[2s] ease-in-out z-[-10] h-full w-full blur-2xl transform-gpu">
        <img
          className="h-full w-full bg-auto"
          src={img === undefined ? "nosong.png" : img.url}
        ></img>
      </div>
      <div className="transition-opacity duration-700 ease-in opacity-0 hover:opacity-100 z-30 w-full h-1/3 absolute top-6 left-0 right-0 flex items-start justify-center">
        <div
          className="flex flex-row items-center gap-2 px-4 py-2 bg-white/10 border-2 border-white/40 text-white/80 rounded-full"
          onClick={toggleFullScreen}
        >
          <svg
            className="cursor-pointer"
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.66675 6.66666H13.3334V9.33332H9.33341V13.3333H6.66675V6.66666ZM18.6667 6.66666H25.3334V13.3333H22.6667V9.33332H18.6667V6.66666ZM22.6667 18.6667H25.3334V25.3333H18.6667V22.6667H22.6667V18.6667ZM13.3334 22.6667V25.3333H6.66675V18.6667H9.33341V22.6667H13.3334Z"
              fill="white"
            ></path>
          </svg>
        </div>
      </div>
    </>
  );
}

export default UserOverlay;
