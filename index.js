! function(name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition();
  else if (typeof define == 'function') define(definition);
  else this[name] = definition();
}('sticky', function() {

  var stickyCommon = function(el, elAnchor, top) {
    var requiredOriginalStyles = ['position', 'top', 'left'];

    const POSITION_RELATIVE = 0;
    const POSITION_FIXED = 1;

    var requiredTop = top || 0;
    var originalRect = calcRect(el);
    var lastPosition = POSITION_RELATIVE;
    var getLastPosition = (function(){
      return(function(){
        return(lastPosition);
      });
    })();
    var setLastPosition = (function(){
      return(function(newLastPosition){
        lastPosition = newLastPosition;
      });
    })();


    var lastWindowTop = 0;
    var styles = {
      position: 'fixed',
      top: requiredTop + 'px',
      left: originalRect.left + 'px',
      width: originalRect.width + 'px',
    }
    el.style['z-index'] = 1000 + originalRect.top;
    var originalStyles = {}
    requiredOriginalStyles.forEach(function(key) {
      originalStyles[key] = el.style[key];
    });

    function calcElementPosition(msg){
      el.innerHTML += msg;
      var windowScroll = getWindowScroll();
        var lastPosition = getLastPosition();
        if (lastPosition == POSITION_RELATIVE && windowScroll.top > originalRect.top - requiredTop) {
          setLastPosition(POSITION_FIXED);
          for (key in styles) {
            var value = styles[key];
            if (key === "left") {
              var rect = calcRect(elAnchor);
              value = rect.rawLeft + "px";
            }
            el.style[key] = value;
          }
        } else if (lastPosition == POSITION_FIXED && windowScroll.top <= originalRect.top - requiredTop) {
          setLastPosition(POSITION_RELATIVE);
          for (key in originalStyles) {
            el.style[key] = originalStyles[key];
          }
        }
    }

//     window.addEventListener("touchmove", function(){calcElementPosition("A");});

    window.addEventListener("scroll", function(){calcElementPosition("");});

    window.addEventListener("resize", function(){
      if (getWindowScroll().top > originalRect.top - requiredTop) {
        var rect = calcRect(elAnchor);
        value = rect.rawLeft + "px";
        el.style["left"] = value;
      }
    });

    function calcRect(el) {
      var rect = el.getBoundingClientRect();
      var windowScroll = getWindowScroll()
      return {
        left: rect.left + windowScroll.left,
        top: rect.top + windowScroll.top,
        width: rect.width,
        height: rect.height,
        rawLeft: rect.left,
      }
    }

    function getWindowScroll() {
      return {
        top: window.pageYOffset || document.documentElement.scrollTop,
        left: window.pageXOffset || document.documentElement.scrollLeft
      }
    }
  }

  var stickyAndroidChrome = function(el, elAnchor, top) {
    var originalTop = el.style['top'];
    var requiredTop = top || 0;
    var elBoundingClientRect = el.getBoundingClientRect();
    var originalRectTop = elBoundingClientRect.top + getWindowTop();
    el.style["z-index"] = 9999 + originalRectTop;

    var onscroll;
    if (window.onscroll) {
      onscroll = window.onscroll;
    }

    window.onscroll = function(event) {
      var windowTop = getWindowTop();
      if (windowTop > originalRectTop - requiredTop) {
        el.style["top"] = (windowTop - originalRectTop + requiredTop)+"px";
      } else {
        el.style["top"] = originalTop;
      }
      onscroll && onscroll(event)
    }

    function getWindowTop() {
      return ( window.pageYOffset || document.documentElement.scrollTop );
    }
  }

  var stickyFirefox = function(el, elAnchor, top) {
    el.innerHTML = "Firefox";
    el.style["z-index"] = 9999 + el.getBoundingClientRect().top;
    el.style["position"] = "sticky";
    el.style["top"] = (top || 0) + "px";
  }

  var ua = navigator.userAgent;
  var stickyFunction = stickyCommon;

  if ((/Android/i.test(ua)) && (/Chrome/i.test(ua)) && !(/Version/i.test(ua))){
    stickyFunction = stickyAndroidChrome;
  } else if ((/Firefox/i.test(ua))){
    stickyFunction = stickyFirefox;
  }

  return(stickyFunction);
});