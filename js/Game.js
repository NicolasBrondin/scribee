var Game = {
     stories: [],
     given_answer:[],
     selected_element_parent: null,
     selected_element: null,
     score: 0,
     settings: {
         mute: false
     },
     progress: {
        stories: []  
     },
     sounds: {
         background: new Audio("audio/background.mp3"),
         drag: new Audio("audio/drag.mp3"),
         drop: new Audio("audio/drop.mp3"),
         success: new Audio("audio/success.mp3"),
         finish: new Audio("audio/finish.mp3"),
         fail: new Audio("audio/fail.mp3")
     },
     elements: [],
     answers: [],
     current_story: null,
     play_voice: function() {
          this.current_story.play_sound();
     },
     play_sound: function(id){
         if(id != 'background' || this.settings.mute == false){
            this.sounds[id].play();
         }
     },
     stop_sound: function(id){
         this.sounds[id].pause();
     },
     toggle_background_sound: function(){
         this.settings.mute = !this.settings.mute;
         if(!this.settings.mute){
             this.play_sound('background');
             document.getElementById('music-toggle').innerHTML = '<img src="img/btn-music.png"/>';
         } else {
             this.stop_sound('background');
             document.getElementById('music-toggle').innerHTML = '<img src="img/btn-music-off.png"/>';
         }
         
         JS.local_storage.set("settings",this.settings);
     },
     pick_element: function(e){
         Game.selected_element = e.target.parentElement;
         
         Game.play_sound('drag');
          var position = JS.mouse.move(e);
              JS.element.move(Game.selected_element, position.x - document.getElementById('story-container').offsetLeft  - document.getElementById('game-container').offsetLeft - (Game.selected_element.getBoundingClientRect().width/2), position.y - document.getElementById('story-container').offsetTop - document.getElementById('game-container').offsetTop - (Game.selected_element.getBoundingClientRect().height/2));
          
         Game.selected_element_parent = Game.selected_element.parentElement;
         JS.element.remove_class(Game.selected_element, "error");
         e.preventDefault();
         document.getElementById('story-container').appendChild(Game.selected_element);
         this.current_story.hide_tutorial();
     },
     release_element: function(e){
         if(Game.selected_element){
             //Need to check position
             var position = Game.answers.filter(function(a){return [].slice.call(a.classList).indexOf('drop') != -1}).find(function(a){
                 var rect1 = JS.element.get_rect(a);
                 var rect2 = JS.element.get_rect(Game.selected_element);
                 return (rect2.x + (rect2.w/2)) > (rect1.x - 40) && (rect2.x + (rect2.w/2)) < (rect1.x + rect1.w +40) && (rect2.y + (rect2.h/2)) > (rect1.y-40) && (rect2.y + (rect2.h/2)) < (rect1.y + rect1.h + 40);
             }.bind(this));
              
             if(position){
                 
                Game.play_sound('drag');
                 if(position.children.length > 0){
                     //fails because parent is story-container
                     JS.element.remove_class(position.children[0], "error");
                     Game.selected_element_parent.appendChild(position.children[0]);
                    
                 }
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 position.appendChild(Game.selected_element);
             } else {
                 Game.play_sound('drop');
                 JS.element.move(Game.selected_element,0,0);
                 Game.selected_element.style.position = 'relative';
                 document.getElementById('elements_container').appendChild(Game.selected_element);
             }
             JS.element.remove_class(Game.selected_element, "error");
             var answer = Game.answers.filter(function(a){ return [].slice.call(a.classList).indexOf('drop') != -1});
             answer = answer.map(function(a){
                 
                return a.children[0] ? parseInt(a.children[0].attributes.data.value) : null;
             });
             Game.current_story.set_user_answer(answer);

         }
         Game.selected_element = null;
     }.bind(this),
     move_element: function(e){
          var position = JS.mouse.move(e);
          if(Game.selected_element){
              JS.element.move(Game.selected_element, position.x - document.getElementById('story-container').offsetLeft - document.getElementById('game-container').offsetLeft - (Game.selected_element.getBoundingClientRect().width/2), position.y - document.getElementById('story-container').offsetTop  - document.getElementById('game-container').offsetTop - (Game.selected_element.getBoundingClientRect().height/2));
          
          }
     },
     next_scene: function(){
        this.current_story.next_scene();
     },
     init: function(){
         Game.settings = JS.local_storage.get("settings") || {mute:false};
         Game.progress = JS.local_storage.get("progress") || {stories:[]};
         Game.init_from_files();
         Game.sounds.background.loop = true;
         Game.sounds.background.volume = 0.3;
     }.bind(this),
     play: function(id){
         var s = Game.stories.find(function(story){
             return id === story.path;
         });
         Game.current_story = s;
         if(Game.settings.mute == false){
            Game.play_sound('background');
             document.getElementById('music-toggle').innerHTML = '<img src="img/btn-music.png"/>';
         }else {
             document.getElementById('music-toggle').innerHTML = '<img src="img/btn-music-off.png"/>';
         }
         document.getElementById('transition').style.visibility = "visible";
         document.getElementById('left-curtain').style.animationName = 'curtain-left';
         document.getElementById('right-curtain').style.animationName = 'curtain-right';
         setTimeout(Game.current_story.play,2500);
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
                            
                            
                            if(Game.stories.length == data.stories.length){
                                Game.build_menu();
                            }
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
    build_menu: function(){
        
        document.getElementById("menu-buttons").innerHTML = "";
        
        Game.stories.forEach(function(story){
            Game.add_menu_story(story);
        });
        
        var b = document.createElement('button');
        b.classList = "disabled";
        var i = document.createElement('img');
        i.src = 'img/plus.png';
        i.classList = "story-image";
        var d = document.createElement('div');
        d.classList = "story-name";
        d.innerHTML = "Bientôt...";
        b.appendChild(i);
        b.appendChild(d);
        document.getElementById("menu-buttons").appendChild(b);
        
        
        
    },
    add_menu_story: function(story){
        var b = document.createElement('button');
        b.onclick = function(){Game.play(story.path)};
        if(Game.progress.stories.indexOf(story.title) != -1){
            b.classList = "finished";
        }
        var i = document.createElement('img');
        i.classList = "story-image";
        i.src = story.image;
        var d = document.createElement('div');
        d.classList = "story-name";
        d.innerHTML = story.title;
        var c = document.createElement('div');
        c.classList = "story-check";
        var ci = document.createElement('img');
        ci.src = 'img/check.png';
        c.appendChild(ci);
        b.appendChild(i);
        b.appendChild(d);
        b.appendChild(c);
        document.getElementById("menu-buttons").appendChild(b);
    },
    finished_story: function(title){
        this.progress.stories.push(title);
        JS.local_storage.set("progress", this.progress);
        document.getElementById('bravo').style.animationName = "splash";
        Game.play_sound('finish');
        //Need to redraw menu
        this.build_menu();
        this.show_menu();
    }
};
