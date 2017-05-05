var JS = {
    array: {
        shuffle: function(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
          }

          return array;
}
    },
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
        refactor_bounding: function(b){
            if(b.x != null){
                return b;
            } else {
                return { x: b.left, y: b.top, width: b.width, height: b.height };
            }
        },
        add_class: function(element, c){
            element.classList += " "+c;  
        },
        remove_class: function(element, c){
            var s = element.classList + " "; 
            s = s.replace(" "+c+" ", " ");
            element.classList = s;
        },
        move: function(element, x,y){
             element.style.position = "absolute" ;
             element.style.left = x+"px";
             element.style.top = y+"px";
        },
        get_rect: function(element){
            var b = element.getBoundingClientRect();
            //return {x: element.offsetLeft + element.scrollLeft + element.parentElement.offsetLeft, y: element.offsetTop + element.scrollTop  + element.parentElement.offsetTop, w: element.offsetWidth, h: element.offsetHeight};
            return {x: b.left, y: b.top, w: b.width, h: b.height};
        }
    },
    file: {
        load: function(file, callback){
            var request = new XMLHttpRequest();
            request.onreadystatechange = function() {
              if(request.readyState === 4) {
                if(request.status === 200) { 
                  callback(JSON.parse(request.responseText));
                } else {
                  console.error('An error occurred during your request: ', request.status + ' ' + request.statusText);
                } 
              }
            }

            request.open('Get', file, true);
            request.send();
        }
    }
    
};
