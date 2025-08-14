import React from "react";
import gif from './gif-unscreen.gif'
function Heading() {
  return (
    <div className="text-4xl flex font-mono font-semibold justify-center gap-2 py-8">
      <div>ChatMate</div>
      <div className="h-14 w-14 py-1"><img src={gif} alt="" /></div>
    </div>
  );
}
export default Heading;
