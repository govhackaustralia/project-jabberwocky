/** For portal.govhack.org/handbook **/
var HB = (function(){
    'use strict';
    
    return {
        enableSidebarDrag: enableSidebarDrag,
        groupHeadings: groupHeadings,
        storage: new handbookStorage(),
    };
    
    
    /** 
     * Specifically, make the sidebar variable in width
     */
    function enableSidebarDrag(selectorSidebar, selectorMain){
        
        if (!selectorSidebar) throw 'Argument 1 must be a CSS selector';
        if (!selectorMain) throw 'Argument 2 must be a CSS selector';
        
        var elemSidebar = document.querySelector(selectorSidebar); 
        var elemMain = document.querySelector(selectorMain);
        
        elemSidebar.addEventListener('click', function init() {
            elemSidebar.removeEventListener('click', init, false);
            elemSidebar.className = elemSidebar.className + ' resizable';
            var resizer = document.createElement('div');
            resizer.className = 'resizer-handle';
            elemSidebar.appendChild(resizer);
            resizer.addEventListener('mousedown', initDrag, false);
        }, false);

        var startX, sidebarStartWidth, sidebarMinWidth, mainStartLeft;
        // var startY, startHeight;

        function initDrag(e) {
            startX = e.clientX;
            // startY = e.clientY;
            sidebarStartWidth = parseInt(document.defaultView.getComputedStyle(elemSidebar).width, 10);
            sidebarMinWidth = parseInt(document.defaultView.getComputedStyle(elemSidebar).minWidth, 10);
            mainStartLeft = parseInt(document.defaultView.getComputedStyle(elemMain).left, 10);
            // startHeight = parseInt(document.defaultView.getComputedStyle(elemSidebar).height, 10);
            document.documentElement.addEventListener('mousemove', doDrag, false);
            document.documentElement.addEventListener('mouseup', stopDrag, false);
        }

        function doDrag(e) {
            if (sidebarStartWidth + e.clientX - startX > sidebarMinWidth){
                elemSidebar.style.width = (sidebarStartWidth + e.clientX - startX) + 'px';
                elemMain.style.left = (mainStartLeft + e.clientX - startX) + 'px';                
            }
            // elemSidebar.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopDrag(e) {
            document.documentElement.removeEventListener('mousemove', doDrag, false);
            document.documentElement.removeEventListener('mouseup', stopDrag, false);
        }
    }
    
    /**
     * Implements a grouping spec as per what our collapse plugin expects:
     * https://github.com/danielstocks/jQuery-Collapse#usage
     * 
     * @param jQuery element
     */
    function groupHeadings($elem, headingTagNames){
        
        if (!$elem) throw 'No jQuery element was provided in argument 1';
        headingTagNames = headingTagNames || ['h1', 'h2'];

        var $shadow = $('<div>');
        var $subcontent = $('<div>');
        $elem.children().each(function(){
            var $this = $(this);
            var tagName = $this.prop('tagName').toLowerCase();
            if (~headingTagNames.indexOf(tagName)){
                // Wrap up the old one, push it into shadow.
                $this.addClass('heading-toggle');
                $subcontent.clone().appendTo($shadow);
                $this.clone().appendTo($shadow);
                $subcontent = $('<div>');
            }
            else {
                $this.appendTo($subcontent);
            }
        });
        if ($subcontent){
            $subcontent.clone().appendTo($shadow);
        }
        // Switcharoo
        $elem.empty();
        $shadow.children().appendTo($elem);
        // delete $shadow;
    }
    
    /**
     * An IO class for localStorage (or could be made into 
     * a adapter, later down the track)
     */
    function handbookStorage(){
        
        if (!window.localStorage){
            console.warn('No localstorage');
            return;
        }
        this.get = function(key){
            window.localStorage.getItem(lsk(key));
        }
        this.set = function(key, value){
            window.localStorage.setItem(lsk(key), value);
        }
        
        //========================
        
        var eventIDKey = 'event_gid';
        var eventNameKey = 'event_name';
        this.hasEvent = function(){
            return !!window.localStorage.getItem(lsk(eventIDKey));
        }
        this.getEvent = function(){
            return {
                id: window.localStorage.getItem(lsk(eventIDKey)),
                name: window.localStorage.getItem(lsk(eventNameKey))
            };
        }
        this.setEvent = function(values){
            if (typeof values === 'string'){
                var gid = values;
                values = { gid: gid };
            }
            // if (!values.gid) throw 'Argument 1 must be an object that contains field `gid`';
            // values = $.extend({ 
                // gid: 'sydney',
                // name: 'sydney'
            // }, values || {});
            window.localStorage.setItem(lsk(eventIDKey), values.gid);
            window.localStorage.setItem(lsk(eventNameKey), values.name);
        }
        
        // Alias
        this.hasVenue = this.hasEvent;
        this.getVenue = this.getEvent;
        this.setVenue = this.setEvent;
        
        
        //========================
        
        function lsk(key){
            var localStorageKey = 'govhackhandbook';
            return [localStorageKey, key].join('_');
        }
        
    }
    
    
}());