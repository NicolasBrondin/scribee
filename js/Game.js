var Game = {
     expected_answer: [4,0,3,2,1],
     given_answer:[],
     selected_element: null,
     sound: new Audio('audio/voice.mp3'),
     score: 0,
     elements: [],
     answers: [],
     play_sound: function() {
          if(Game.sound){
               Game.sound.play();
          }
     },
     pick_element: function(e){

         Game.selected_element = e.target.parentElement;
         Game.selected_element.style.border = "none";
         e.preventDefault();
     },
     release_element: function(e){
         if(Game.selected_element){
             //Need to check position
             //console.log(Game.answers);
             var position = Game.answers.find(function(a){
                 var rect1 = JS.element.get_rect(a);
                 var rect2 = JS.element.get_rect(Game.selected_element);
                 //console.log(rect1, rect2);
                 return rect2.x > rect1.x && rect2.x < (rect1.x + rect1.w) && rect2.y > rect1.y && rect2.y < (rect1.y + rect1.h);
             }.bind(this));
             //console.log(position);
             if(position /* && position.classList.indexOf('drop')!= -1*/){
                 if(position.children.length > 0){
                    position.children[0].style.margin = "5px";
                    position.children[0].style.border = "none";
                     Game.selected_element.parentElement.appendChild(position.children[0]);
                 }
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 position.appendChild(Game.selected_element);
                 Game.selected_element.style.margin = "5px";
               /* Game.selected_element.style.left = JS.element.get_rect(position).x; 
                Game.selected_element.style.top = JS.element.get_rect(position).y; */
                 //console.log(Game.selected_element);
             } else {
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 document.getElementById('elements_container').appendChild(Game.selected_element);
             }
             Game.given_answer = Game.answers.map(function(a){
                 
                 return a.children[0] ? parseInt(a.children[0].attributes.data.value) : null;
             });

         }
         Game.selected_element = null;
     }.bind(this),
     move_element: function(e){
         console.log(e);
          var position = JS.mouse.move(e);
         console.log(position);
          if(this.selected_element){
              JS.element.move(this.selected_element, position.x-document.getElementById('story-container').offsetLeft, position.y+document.getElementById('elements_container').offsetTop);
          }
     },
     check_answers: function(){
        console.log(Game.expected_answer);
         console.log(Game.given_answer);
          Game.expected_answer.forEach(function(a,i){
              //console.log(Game.elements);
              if(Game.given_answer[i] != null && Game.given_answer[i] ==a){
                  Game.elements[a].style.border = "none";
                  Game.elements[a].style.margin = "5px";
              }else {
                  console.log(Game.given_answer[i], a);
                  Game.elements[a].style.border = "4px solid #e74c3c";
                  Game.elements[a].style.margin = "0";
              }
          });
          if(JSON.stringify(Game.expected_answer) === JSON.stringify(Game.given_answer)){
              Game.score ++;
              alert("Gagné");
          } else {
              Game.score --;
          }
         console.log(Game.score);
     },
     init: function(){
         Game.elements = [].slice.call(document.getElementById('elements_container').children);
         Game.answers = [].slice.call(document.getElementById('answers_container').children).filter(function(i){console.log(i); return [].slice.call(i.classList).indexOf('drop') != -1;});
         Game.sound.onended = function(){document.getElementById('narrator-screen').style.display = "none";};
     }.bind(this),
     play: function(){
         document.getElementById('menu-container').style.display = "none";
         document.getElementById('game-container').style.display = "block";
         Game.play_sound();
         document.getElementById('narrator-screen').style.display = "block";
     }.bind(this),
    show_menu : function(){
        document.getElementById('menu-container').style.display = "block";
         document.getElementById('game-container').style.display = "none";
    }
};
