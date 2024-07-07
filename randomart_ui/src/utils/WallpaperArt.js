import React, { useRef, useEffect } from 'react';

const WallpaperArt = (props) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const valueToColor = (value, startColor, endColor) => {
      value = Math.max(0, Math.min(value, 1));
    
      const r = Math.round(startColor[0] + (endColor[0] - startColor[0]) * value);
      const g = Math.round(startColor[1] + (endColor[1] - startColor[1]) * value);
      const b = Math.round(startColor[2] + (endColor[2] - startColor[2]) * value);
  
      return [r,g,b];
    };

      const randomEvalFunc = (props) => {
        const chooseFunc = (num_args) => {
          const rand = Math.random() ;
          for (let i = 0, acc = 0; i < props.funcs[num_args-1].length; i++) {
              acc += props.funcs[num_args-1][i].prob;
              if (rand <= acc) return {"func":props.funcs[num_args-1][i].func, "string":props.funcs[num_args-1][i].string};
          }
          console.log("chooseFunc Messed Up");
          return {"func":props.funcs[num_args-1][0].func, "string":props.funcs[num_args-1][0].string};
        };

        const buildTree = (currentDepth) => {
          if (currentDepth === 0) {
              const nodeFunc =chooseFunc(2)
              return {"func":nodeFunc.func, "children":[], "string": nodeFunc.string};
          }
  
          const children = [];

          children.push(buildTree(currentDepth - 1));

          for (let i = 0; i < props.max_children-1; i++) {
              if (Math.random() <= props.child_prob) {
                  children.push(buildTree(currentDepth - 1));
              }
          }
  
          const nodeFunc= chooseFunc(children.length);

          const node = {"func":nodeFunc.func, "children":children, "string":nodeFunc.string};

          return node;
        };

        return buildTree(props.depth);
    };

    const evalTree = (x, y, node) => {
      if (node.children.length === 0) {
        return node.func(x,y)
      }
      else {
        const childResults = node.children.map(child => evalTree(x,y,child));
        return node.func(...childResults);
      }

    };

    const printTree = (node) => {
      if (node.children.length === 0) {
        return node.string("x","y")
      }
      else {
        const childResults = node.children.map(child => printTree(child));
        return node.string(...childResults);
      }
    };
    
    const generateArt = (props, ctx, clientWidth, clientHeight, scaleFactor) => {
      const imageData = ctx.createImageData(clientWidth * scaleFactor, clientHeight * scaleFactor);
      const data = imageData.data;
      const tree = randomEvalFunc(props);
      console.log(printTree(tree));
      for (let y = 0; y < clientHeight * scaleFactor; y++) {
        for (let x = 0; x < clientWidth * scaleFactor; x++) {
          const value = evalTree(x / (scaleFactor * clientWidth), y / (scaleFactor * clientHeight), tree);
          const color = valueToColor(value, [0, 0, 0], [255, 255, 255]);
          const index = (y * clientWidth * scaleFactor + x) * 4;
          data[index] = color[0]; // R
          data[index + 1] = color[1]; // G
          data[index + 2] = color[2]; // B
          data[index + 3] = 255; // A
        }
      }
    
      ctx.putImageData(imageData, 0, 0);
    };    

    
    const drawArt = (canvas, props) => {
      const ctx = canvas.getContext('2d');
      const scaleFactor = window.devicePixelRatio || 1;
      
      if (!ctx) {
        return;
      }
    
      canvas.width = canvas.offsetWidth * scaleFactor;
      canvas.height = canvas.offsetHeight * scaleFactor;
      ctx.scale(scaleFactor, scaleFactor);
      const { clientWidth, clientHeight } = canvas;
      generateArt(props, ctx, clientWidth, clientHeight, scaleFactor);
    };

    const canvas = canvasRef.current;
    if (canvas) {
      drawArt(canvas, props);
    };

    const handleClick = (event) => {
      drawArt(canvas,props);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default WallpaperArt;
