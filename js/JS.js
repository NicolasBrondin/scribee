var JS = {
    mouse: {
        move: function(e){
            var x,y;

            
            if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
            var touch = e.touches[0] || e.changedTouches[0];
            x = touch.pageX;
            y = touch.pageY;
          } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
            x = e.pageX;
            y = e.pageY;
          }

             if (x < 0){x = 0;}
             if (y < 0){y = 0;}  
            return {x:x, y:y};
        }
    },
    element: {
        move: function(element, x,y){
             element.style.position = "absolute" ;
             element.style.left = x+"px";
             element.style.top = y+"px";
        },
        get_rect: function(element){
            return {x: element.offsetLeft, y: element.offsetTop, w: element.offsetWidth, h: element.offsetHeight};
        }
    }
    
};
