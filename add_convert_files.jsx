#target bridge
#include 'Wayan/Convert.jsx'

(function(root){
	function addContextMenuItem() {
        /**
         The context in which this snippet can run; Bridge must be running.
         @type String
        */
        this.requiredContext = "\tAdobe Bridge must be running.\n\tExecute against Bridge CC 2018 as the Target.\n";
        
        /**
         The unique identifier for the new menu item command
         @type String
        */
	    this.menuID = "wayanConvertSelectedFiles";
    }


    addContextMenuItem.prototype.run = function() {
        // Must run in Bridge 
        if(BridgeTalk.appName != "bridge") {
            return false;
        }

		// Stop the menu element from being added again if the snippet has already run
        var menuElement = MenuElement.find(this.menuID);
        if (!menuElement){
            // create the menu element
            menuElement = new MenuElement("command", "Convert all selected files: ", "at the end of Thumbnail", this.menuID);
        }

        // What to do when the menu item is selected
        menuElement.onSelect = function(m) {
            Wayan.Convert.convertSelectionsToPhotoshop( root );
        };

        // When to display the menu item
        menuElement.onDisplay = function() {
            try {
                menuElement.enabled = app.document.selections.length >= 1;
                // Check if the thumbnail is a container
                var label = "Convert files to " + root.fullName;
                if(app.document.selections[0].container) {
                    menuElement.text = label + ': Folder';
                }
                else
                {
                    menuElement.text = label + ': File';
                }
            }
            catch(error){ $.writeln(error); }
        };

		return true;
	};

   new addContextMenuItem().run();
})(new File(
	'/c/roman/kundilka'
) );

/* 
vim:expandtab:ts=4:sw=4:
*/
