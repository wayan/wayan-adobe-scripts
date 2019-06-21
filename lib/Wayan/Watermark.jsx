if (typeof Wayan === 'undefined'){
	alert('dedi');
	var Wayan = {};
}


(function(wayan){

function placeWatermark (Image,Size,Margin){    
	  if(!documents.length) return;   // if no document return  
	  try{    
		    var doc = app.activeDocument; // set Doc object to active document  
		    app.displayDialogs = DialogModes.NO; // Dialog off   
		    var strtRulerUnits = app.preferences.rulerUnits; // Save Users ruler units   
		    var strtTypeUnits = app.preferences.typeUnits; // Save Users Type units   
		    app.preferences.rulerUnits = Units.PIXELS; // work with pixels   
		    app.preferences.typeUnits = TypeUnits.PIXELS; // work with pixels   
		    var fileObj = new File(Image);                 // the passed file  
		    if(!fileObj.exists){   // If file does not exits tell user   
			      alert(fileObj.name  + " does not exist!");    
			      return;    
			      }    
		    placeFile(fileObj); // Place in file the Watermark png file  
		    activeDocument.activeLayer.resize(100 ,100,AnchorPosition.MIDDLECENTER); // Insure Place did not scale layer    
		    var SB = activeDocument.activeLayer.bounds; // get layers bounds   
		    var layerHeight = SB[3] - SB[1]; // get layers height    
		    var resizePercent = (100/layerHeight)*(Size/100*doc.height.value); // Percent to resize by   
		    activeDocument.activeLayer.resize(resizePercent ,resizePercent,AnchorPosition.MIDDLECENTER);  // Resize width and height by percentage   
		    SB = activeDocument.activeLayer.bounds; // get resized layers bounds    
		    activeDocument.activeLayer.translate(-SB[0].value,-SB[1].value); // Move resized layer to top left canvas corner   
		    var LayerWidth = (SB[2].value - SB[0].value);    
		    var LayerHeight = (SB[3].value - SB[1].value);    
		    marginSize = Margin/100*doc.height.value; // move resized watermark into the document lower right corner with some margin  
		    activeDocument.activeLayer.translate((doc.width.value -marginSize - LayerWidth),( doc.height.value -marginSize - LayerHeight));  
		    }  
	  catch(e) { alert(e + ': on line ' + e.line); } // inform user of error    
	  finally{    
		    app.preferences.rulerUnits = strtRulerUnits; // Restore user ruler units    
		    app.preferences.typeUnits = strtTypeUnits; // Restore user type units      
		    };    
};   
  
function placeFile(placeFile) {    
    var desc21 = new ActionDescriptor();    
    desc21.putPath( charIDToTypeID('null'), new File(placeFile) );    
    desc21.putEnumerated( charIDToTypeID('FTcs'), charIDToTypeID('QCSt'), charIDToTypeID('Qcsa') );    
    var desc22 = new ActionDescriptor();    
    desc22.putUnitDouble( charIDToTypeID('Hrzn'), charIDToTypeID('#Pxl'), 0.000000 );    
    desc22.putUnitDouble( charIDToTypeID('Vrtc'), charIDToTypeID('#Pxl'), 0.000000 );    
    desc21.putObject( charIDToTypeID('Ofst'), charIDToTypeID('Ofst'), desc22 );    
    executeAction( charIDToTypeID('Plc '), desc21, DialogModes.NO );    
};  

wayan.Watermark = { placeWatermark: placeWatermark };
})(Wayan);
