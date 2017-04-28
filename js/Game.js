var Game = {
     stories: [],
     given_answer:[],
     selected_element: null,
     score: 0,
     elements: [],
     answers: [],
     current_story: null,
     play_sound: function() {
          this.current_story.play_sound();
     },
     pick_element: function(e){
         Game.selected_element = e.target.parentElement;
         Game.selected_element.style.border = "none";
         e.preventDefault();
     },
     release_element: function(e){
         console.log(e);
         if(Game.selected_element){
             //Need to check position
             console.log(Game.answers);
             var position = Game.answers.find(function(a){
                 var rect1 = JS.element.get_rect(a);
                 var rect2 = JS.element.get_rect(Game.selected_element);
                 //console.log(rect1, rect2);
                 return rect2.x > rect1.x && rect2.x < (rect1.x + rect1.w) && rect2.y > rect1.y && rect2.y < (rect1.y + rect1.h);
             }.bind(this));
             console.log(position);
             if(position && [].slice.call(position.classList).indexOf('drop') != -1){
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
             console.log(Game.answers);
             Game.given_answer = Game.answers.map(function(a){
                 console.log(a);
                 if(  [].slice.call(a.classList).indexOf('drop') != -1){
                    return a.children[0] ? parseInt(a.children[0].attributes.data.value) : null;
                 }
             });

         }
         Game.selected_element = null;
     }.bind(this),
     move_element: function(e){
          var position = JS.mouse.move(e);
          if(this.selected_element){
              JS.element.move(this.selected_element, position.x-document.getElementById('story-container').offsetLeft, position.y+document.getElementById('elements_container').offsetTop);
          }
     },
     next_scene: function(){
        this.current_story.next_scene();
     },
     init: function(){
         
         Game.init_from_files();
     }.bind(this),
     play: function(id){
         var s = Game.stories.find(function(story){
             return id === story.path;
         });
         Game.current_story = s;
         Game.current_story.play();
     }.bind(this),
    show_menu : function(){
        document.getElementById('menu-container').style.display = "block";
        document.getElementById('game-container').style.display = "none";
    },
    init_from_files : function(){
        JS.file.load("data/stories.json", function(data){
            if(data){
                data.stories.forEach(function(story_path){
                    JS.file.load("data/"+story_path+"/story_manifest.json", function(story){
                        if(story){
                            
                            var s = new Story();
                            s.init(story);
                            Game.stories.push(s);
                            console.log(Game.stories);
                            Game.add_menu_story(s);
                        } else {
                            console.error("Error while loading story at path", story_path);
                        }
                    });
                });
            } else {
                console.error("Error while loading config files");
            }
        });
    },
    add_menu_story: function(story){
        var b = document.createElement('button');
        b.onclick = function(){Game.play(story.path)};
        var i = document.createElement('img');
        i.src = story.image;
        b.appendChild(i);
        document.getElementById("menu-buttons").appendChild(b);
    }
};
