#target bridge
#include "Wayan/Convert.jsx"
#include 'Wayan/PhotoMerge.jsx'

function replaceMenuCommand(menuId, text, command){
    var currentMenuElement = MenuElement.find(menuId);
    if (currentMenuElement){
        MenuElement.remove(menuId);
    }

    // Create the menu element
    var menuElement = new MenuElement( "command", text, "at the end of " + wayanMenuId, menuId);
    menuElement.onSelect = command;
}

var wayanMenuId = 'Wayan.Utilities';
if (!MenuElement.find(wayanMenuId)){
    // Create the menu element
       var newMenu = new MenuElement( "menu", "Wayan Utilities", "after Help", wayanMenuId );
}

var convertedPhotoRoot = $.getenv('WAYAN_CONVERTED_PHOTO_ROOT');
if (convertedPhotoRoot){
    replaceMenuCommand(
        'convertSelectionsToPhotoshop', 
        "Convert selected photos to JPEG keeping structure at " + convertedPhotoRoot, 
        function (m) { 
            // Define the behavior (what happens when the item is selected)
            var txt = m.text;
            // Display result as UI, as this is UI sample
            Wayan.Convert.convertSelectionsToPhotoshop(new Folder(convertedPhotoRoot));
        }
    );
}

replaceMenuCommand(
    'mergeBridgeGroups',
    'Merge bridge focus stacks',
    function(m){
        Wayan.PhotoMerge.mergeBridgeGroups();
    }
);


// vim: expandtab:ts=4:sw=4:
