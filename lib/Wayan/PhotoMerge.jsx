#include 'Wayan/List.jsx' 

if (typeof Wayan === 'undefined'){
	var Wayan = {};
}

(function(wayan){

    if (wayan.PhotoMerge){
	    return;
    }
	// on localized builds we pull the $$$/Strings from a .dat file
	$.localize = true;


    if (BridgeTalk.appName === 'photoshop'){

        // Put header files in a "Stack Scripts Only" folder.  The "...Only" tells
        // PS not to place it in the menu.  For that reason, we do -not- localize that
        // portion of the folder name.
        var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
                                                + localize("$$$/private/LoadStack/StackScriptOnly=Stack Scripts Only/");

        $.evalFile(g_StackScriptFolderPath + "LatteUI.jsx");

        $.evalFile(g_StackScriptFolderPath + "StackSupport.jsx");

        $.evalFile(g_StackScriptFolderPath + "CreateImageStack.jsx");
    }

    var photomerge = {};

    function dumpFile(f){
        return 'new File("' + f.fullName + '")';
    }

    function savePSD(saveFile){   
        psdSaveOptions = new PhotoshopSaveOptions();   
        psdSaveOptions.embedColorProfile = true;   
        psdSaveOptions.alphaChannels = true;    
        psdSaveOptions.layers = true;    
        activeDocument.saveAs(saveFile, psdSaveOptions, true, Extension.LOWERCASE);   
    }  

    function outputFile(files){
        var f = files[0].fullName.replace(/\.[^\.]+$/, '');  
        return new File(f + '-' + files.length+ '-merged.psd'); 
    }

    photomerge.mergeFiles = function(files){
        var loadLayers = new ImageStackCreator( 'wayan', 'zlatohlavek');

        // LoadLayers is less restrictive than MergeToHDR
        loadLayers.mustBeSameSize			= false;	// Images' height & width don't need to match
        loadLayers.mustBeUnmodifiedRaw		= false;	// Exposure adjustements in Camera raw are allowed
        loadLayers.mustNotBe32Bit			= false;	// 32 bit images
        loadLayers.createSmartObject		= false;	// If true, option to create smart object is checked.
	    loadLayers.stackElements = Wayan.List.map(function(f){ return new StackElement(f); }, files);

	    var stackDoc = loadLayers.loadStackLayers();
	    // Nuke the "destination" layer that got created (M2HDR holdover)
	    stackDoc.layers['wayan'].remove();

	    //loadLayers.alignStack(stackDoc);
	    selectAllLayers(stackDoc, 1);
	    alignLayersByContent();
//	    selectAllLayers(stackDoc, 1);

	    var desc = new ActionDescriptor();  
	    desc.putEnumerated( charIDToTypeID('Aply'), stringIDToTypeID('autoBlendType'), stringIDToTypeID('maxDOF') );  
	    desc.putBoolean( charIDToTypeID('ClrC'), true );  
	    executeAction( stringIDToTypeID('mergeAlignedLayers'), desc, DialogModes.NO );  

        app.activeDocument.mergeVisibleLayers();
        savePSD( outputFile(files));
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);  
            
    };

    photomerge.mergeBridgeGroups = function(){
        return photomerge.mergeGroups(app.document.groupedSelections);
    };

    photomerge.mergeBridgeSelection = function(){
        return photomerge.mergeGroups([app.document.selections]);
    };
    
    photomerge.mergeGroups = function(groups){ 
        var commands = Wayan.List.flatMap(
            function(g){
                var files = Wayan.List.flatMap(
                    function(t){ return t.spec instanceof File? [ dumpFile(t.spec) ]: []; },
                    g
                );
                return files.length < 2 
                    ? []
                    : [ 'Wayan.PhotoMerge.mergeFiles(['
                        + Wayan.List.join( "\n,", files) 
                        + "\n]);"
                    ];
            },
            groups
       );
       var body = "#include 'Wayan/PhotoMerge.jsx'\n"
       + Wayan.List.join( "\n", commands);

        var btMsg = new BridgeTalk();
	    // Photoshop is the target
	    btMsg.target = "photoshop";
	    // The string containing the script is the body
	    btMsg.body = body;
	    // Bridge handles any errors  that occur when sending the initial message
	    btMsg.onError = function( errorMsg ) {
		    retval = false; 
		    $.writeln(eObj.body); 
	    };
        btMsg.onResult = function( resultMsg ) {
            $.writeln("In Bridge - result of sending initial message to Photoshop = " + resultMsg.body);
        };
	    btMsg.send();
        return btMsg;
    };

    wayan.PhotoMerge = photomerge;
})(Wayan);
/*
 vim:expandtab:ts=4:sw=4:
*/
