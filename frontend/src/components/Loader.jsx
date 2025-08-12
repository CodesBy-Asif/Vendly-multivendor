// components/Loader.tsx
import loaderJson from "../assets/loader.json"; // Your local animation file
import Lottie from "lottie-react";
const Loader = () => {
  return (
    <div className="flex items-center justify-center ">
      <Lottie
        autoplay
        loop
        animationData={loaderJson}
        className="w-[50%] aspect-[1/1]"
      />
    </div>
  );
};

export default Loader;
