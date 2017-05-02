var Game = {
     stories: [],
     given_answer:[],
     selected_element_parent: null,
     selected_element: null,
     score: 0,
     sound: new Audio("audio/background.mp3"),
     elements: [],
     answers: [],
     current_story: null,
     play_sound: function() {
          this.current_story.play_sound();
     },
     pick_element: function(e){
         Game.selected_element = e.target.parentElement;
         Game.selected_element_parent = Game.selected_element.parentElement;
         JS.element.remove_class(Game.selected_element, "error");
         e.preventDefault();
         document.getElementById('story-container').appendChild(Game.selected_element);
     },
     release_element: function(e){
         if(Game.selected_element){
             //Need to check position
             var position = Game.answers.filter(function(a){return [].slice.call(a.classList).indexOf('drop') != -1}).find(function(a){
                 var rect1 = JS.element.get_rect(a);
                 var rect2 = JS.element.get_rect(Game.selected_element);
                 return rect2.x > rect1.x && rect2.x < (rect1.x + rect1.w) && rect2.y > rect1.y && rect2.y < (rect1.y + rect1.h);
             }.bind(this));
             if(position){
                 if(position.children.length > 0){
                     //fails because parent is story-container
                     JS.element.remove_class(position.children[0], "error");
                     Game.selected_element_parent.appendChild(position.children[0]);
                    
                 }
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 position.appendChild(Game.selected_element);
             } else {
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 document.getElementById('elements_container').appendChild(Game.selected_element);
             }
             JS.element.remove_class(Game.selected_element, "error");
             var answer = Game.answers.filter(function(a){ return [].slice.call(a.classList).indexOf('drop') != -1});
             answer = answer.map(function(a){
                 console.log(a);
                return a.children[0] ? parseInt(a.children[0].attributes.data.value) : null;
             });
             Game.current_story.set_user_answer(answer);

         }
         Game.selected_element = null;
     }.bind(this),
     move_element: function(e){
          var position = JS.mouse.move(e);
          if(Game.selected_element){
              JS.element.move(Game.selected_element, position.x-document.getElementById('story-container').offsetLeft, position.y+document.getElementById('elements_container').offsetTop);
          
          }
     },
     next_scene: function(){
        this.current_story.next_scene();
     },
     init: function(){
         
         Game.init_from_files();
         Game.sound.loop = true;
         Game.sound.play();
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
        var d = document.createElement('div');
        d.innerHTML = story.title;
        b.appendChild(i);
        b.appendChild(d);
        document.getElementById("menu-buttons").appendChild(b);
    }
};
