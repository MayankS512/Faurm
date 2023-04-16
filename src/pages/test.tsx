import React from 'react'

const test = () => {
  return (
    <div><textarea
    className="w-full h-full p-2 my-2 overflow-hidden text-2xl text-center rounded-sm resize-none sm:w-1/2 bg-neutral-800"
    autoFocus={true}
    onChange={(e) => {
      console.log(e.target.scrollHeight, e.target.scrollTop);

      e.target.style.height = "";
      e.target.style.height = e.target.scrollHeight + "px";
    }}
    onKeyDownCapture={(e) => {
      if (e.key === "Enter") e.preventDefault();
    }}
  ></textarea></div>
  )
}

export default test