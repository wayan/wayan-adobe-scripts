#include 'Wayan/List.jsx' 
#include 'Wayan/Util.jsx' 

if (typeof Wayan === 'undefined'){
	var Wayan = {};
}

(function(wayan){
    if (wayan.convert){
	    return;
    }

    var convert = {};
	convert.openCameraRaw = function(source){
		var keyNull = charIDToTypeID( 'null' );
		var keyAs = charIDToTypeID( 'As  ' );
		var adobeCameraRawID = stringIDToTypeID( "Adobe Camera Raw" );
		var desc = new ActionDescriptor();
		desc.putPath( keyNull, source );

		var returnDesc = executeAction( charIDToTypeID( 'Opn ' ), desc, DialogModes.NO );
		if ( returnDesc.hasKey( keyAs ) ) {
			if ( returnDesc.hasKey( keyNull ) ) {
				return true;
			}
		}
		return false;
	}

    convert.convert = function(source, target){
        this.openCameraRaw(source);
        this.saveAsJpeg(target);
		app.activeDocument.close( SaveOptions.DONOTSAVECHANGES );
    };

    convert.saveAsJpeg = function(target){
        var historyState = app.activeDocument.activeHistoryState;
        app.activeDocument.flatten();
        app.activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        //RemoveAlphaChannels();
	    var jpegOptions = new JPEGSaveOptions();
	    jpegOptions.quality = 10;
	    jpegOptions.embedColorProfile = true;
	    app.activeDocument.saveAs( target, jpegOptions );
        app.activeDocument.activeHistoryState = historyState;
    }

    convert.getTargetFor = function(source, root){
        /* looking up - drive is not skipped */
        var paths = [], 
            targetBasename = source.name.replace(/\.[^\.]+$/, '.jpg'),
            targetPath = source.parent.fullName.replace(/^\/?/, '');
        return new File( root.fullName + '/' + targetPath + '/' + targetBasename );
    };

    convert.getBundledTargetFor = function(source, root, bundle){
        if (bundle.length < 2){
            return this.getTargetFor(source, root);
        }

        /* looking up - drive is skipped */
        var bundlePart = 'bundle-' + bundle[0].name.replace(/\.[^\.]+$/, ''),
            paths = [], 
            targetBasename = source.name.replace(/\.[^\.]+$/, '.jpg'),
            targetPath = source.parent.fullName.replace(/^\/?/, '');
        return new File( root.fullName + '/' + targetPath + '/' + bundlePart + '/' + targetBasename );
    };

    convert.makeTargetDir = function(dir){
        return dir.exists 
            || (dir.parent && this.makeTargetDir(dir.parent) && dir.create()); 
    };

    convert.convertIntoStruct = function(source, root){
        var target = this.getTargetFor(source, root), targetDir = target.parent;
        if (this.makeTargetDir(targetDir)){
            $.writeln('Converting ' + source + ' into ' + target);
            this.convert(source, target);
        }
    };

    convert.convertSelectionsToPhotoshopUngrouped = function(root){
		var files = Wayan.List.flatMap(
            function(f){ return f.spec instanceof File? [f.spec]: []; },
            app.document.selections
        );

        var commands = Wayan.List.map(
            function(f){
                    return 'Wayan.Convert.convertIntoStruct('
                        + Wayan.Util.dumpFile(f) + ',' + Wayan.Util.dumpFile(root)
                        + ");";
            },
            files
       );
       var body = "#include 'Wayan/Convert.jsx'\n"
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
    };

    /* each bundle has its own directory, named bundle-FIRSTNAME */
    convert.convertSelectionsToPhotoshop = function(root){
       // return this.convertSelectionsToPhotoshopUngrouped(root);
        var self = this, 
            commands = Wayan.List.flatMap(
            function(g){
                var files = Wayan.List.flatMap(
                    function(t){ return t.spec instanceof File? [ t.spec ]: []; },
                    g
                );
                return Wayan.List.flatMap(
                    function(source){
                        var target = self.getBundledTargetFor(source, root, files), targetDir = target.parent;
                        if (self.makeTargetDir(targetDir)){
                            return [ 
                                'Wayan.Convert.convert('
                                    + Wayan.Util.dumpFile(source) + ',' + Wayan.Util.dumpFile(target)
                                    + ");"
                                ];
                        }
                        else {
                            return [];
                        }
                    },
                    files,
                );
            },
            app.document.groupedSelections
       );
       var body = "#include 'Wayan/Convert.jsx'\n"
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
    };

    wayan.Convert = convert;
})(Wayan);

/*
 vim:expandtab:ts=4:sw=4:
*/
