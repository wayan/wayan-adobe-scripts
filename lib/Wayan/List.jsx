if (typeof Wayan === 'undefined'){
	var Wayan = {};
}

(function(wayan){
    var list = {};
    list.flatMap = function(f, ar){
        var l = ar.length, res = [];
        for(var i = 0; i < l; i++){
            var arr = f(ar[i]), ll = arr.length;
            for(var ii=0; ii < ll; ii++){
                res.push(arr[ii]);
            }
        }
        return res;
    };

    list.map = function(f, ar){
        var l = ar.length, res = [];
        for(var i = 0; i < l; i++){
            res.push( f(ar[i]) );
        }
        return res;
    };

	list.join = function(sep, ar){
		var l = ar.length, res = '', first = true;
        for(var i = 0; i < l; i++){
			if (!first){
				res = res + sep;
			}
			first = false;
			res = res + ar[i];
        }
        return res;
	};

    wayan.List = list;
})(Wayan);
/*
 vim:expandtab:ts=4:sw=4
*/
