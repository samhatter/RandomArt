import WallpaperArt from "../utils/WallpaperArt"
function Art() {
return <WallpaperArt funcs ={[
    [
      {"prob":0.25, "func": (x) => x**2, "string": (x) => `${x}**2`},
      {"prob":0.25, "func": (x) => Math.abs(Math.cos(Math.PI*2*x)), "string": (x) => `abs(cos(2pi${x}))`},
      {"prob":0.25, "func": (x) => 1/(1+Math.exp(-x + 0.5)), "string": (x) => `1/(1+exp(-${x}+0.5))`},
      {"prob":0.25, "func": (x) => 10*x - Math.floor(10*x), "string": (x) => `10${x} - floor(10${x})}`},
    ],
    [
      {"prob":0.25, "func": (x,y) => Math.sqrt(2)*Math.sqrt((x-0.5)**2+(y-0.5)**2), "string": (x,y) => `sqrt(2)*sqrt((${x}-0.5)^2+(${y}-0.5)^2)`},
      {"prob":0.25, "func": (x,y) => (x+y)/2, "string": (x,y) => `(${x}+${y})/2`},
      {"prob":0.25, "func": (x,y) => Math.abs(1-x-y), "string": (x,y) => `abs(1-${x}-${y})`},
      {"prob":0.25, "func": (x,y) => Math.max(x,y), "string": (x,y) => `max(${x}, ${y})`},
      
    ]
  ]} depth={3} max_children={2} child_prob ={0.5}/>
};
export default Art