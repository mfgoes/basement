// background-change.js
const greyShades = [
    "#f0f0f0", // Light Grey
    "#d3d3d3", // Light Grey 2
    "#a9a9a9", // Dark Grey
    "#808080", // Grey
    "#505050"  // Darker Grey
  ];
  const pastelColors = [
    "#FFF9C4", // Light pastel yellow
    "#FFEB3B", // Bright yellow
    "#F9FBE7", // Pale yellow
    "#FFECB3", // Light golden yellow
    "#FFFB8A", // Light pastel yellow-green
    "#F9F1B1", // Soft lemon yellow
    "#FFEE58", // Vivid yellow
    "#FFF176", // Light butter yellow
    "#FFEB8A", // Light sunflower yellow
    "#F8F8A2"  // Soft butter yellow
  ];
  
  
  function changeBackgroundColor() {
    const randomCol = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    document.body.style.backgroundColor = randomCol; // Change background color of the body
  }
  
  export { changeBackgroundColor };
  