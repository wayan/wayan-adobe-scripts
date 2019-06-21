#target photoshop;    
#include "lib/Wayan/Watermark.jsx";

app.bringToFront();    
var logoFile = "e:/roman/scripts/pavel.png"; // Watermark file should be large for resize down works better than up  
var LogoSize = 3; // percent of document height to resize Watermark to  
var LogoMargin = 3;                                         // percent of Document height the Watermark should have as a margin  
  
  
Wayan.Watermark.placeWatermark(logoFile, LogoSize, LogoMargin);             // Place Watermark  into the bottom right of document  
  
  
