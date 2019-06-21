#include 'Wayan/List.jsx' 

if (typeof Wayan === 'undefined'){
	var Wayan = {};
}

(function(wayan){
    if (wayan.Util){
	    return;
    }
    var util = {};

    util.dumpFile = function(f){
        return 'new File("' + f.fullName + '")';
    };

    wayan.Util = util;
})(Wayan);
/*
 vim:expandtab:ts=4:sw=4:
*/
