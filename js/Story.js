var Story = function(){
    this.lang,
    this.premium,
    this.image;
    this.title;
    this.path;
    this.scenes = [];
    this.current_scene;  
    this.tutorial_timer;
    this.play_sound = function(){
        this.current_scene.play_sound();
    };
    
    this.init = function(data){
        this.lang = data.lang;
        this.premium = data.premium;
        this.image = 'data/'+data.path+'/'+data.image;
        this.title = data.title;
        this.path = data.path;
        data.scenes.forEach(function(scene){
            var s = new Scene();
            scene.sound = 'data/'+data.path+'/'+scene.sound;
            s.init(this, scene);
            this.scenes.push(s);
        }.bind(this));
    };
    
    this.show_tutorial = function(){
        
        //Getting ui elements
        var hand = document.getElementById('cursor-hand');
        hand.style.visibility = 'visible';
        var hand_position = JS.element.refactor_bounding(hand.getBoundingClientRect());
        var element_position = JS.element.refactor_bounding(Game.elements[0].getBoundingClientRect());
        var drop_position = JS.element.refactor_bounding(Game.answers[1].getBoundingClientRect());//to be changed
        console.log(hand_position);
        console.log(element_position);
        console.log(drop_position);
        //Set hand position equals to first card position
        JS.element.move(hand, element_position.x + element_position.width, element_position.y + element_position.height);
        
        //Distance and vector calculation
        var delta_x = drop_position.x + drop_position.width  - hand_position.x;
        var delta_y = drop_position.y -  hand_position.y ;
        var ratio = delta_x / delta_y;
        console.log(delta_x, delta_y);
        var speed = 2;
        var t = 0;
        
        //Every 20ms
        this.tutorial_timer = setInterval(function(){
            
            //Update hand position
            hand_position = JS.element.refactor_bounding(hand.getBoundingClientRect());
            if( (drop_position.y - hand_position.y) > 0 ){
            JS.element.move(hand, element_position.x +  element_position.width + ( t * speed * ratio), element_position.y +( t * speed) + element_position.height);
            
            } else {
                //If movement is finished, starts over
                setTimeout(function(){t = 0; JS.element.move(hand, element_position.x + element_position.width,element_position.y+ element_position.height);},1000);
            }
            t++;
        },10)  ;
    }.bind(this);
    
    this.hide_tutorial = function(){
        clearInterval(this.tutorial_timer);
        document.getElementById('cursor-hand').style.visibility = 'hidden';
    };
    
    this.play = function(){
        setInterval(function(){document.getElementById('transition').style.visibility = "hidden";},2500);
        this.current_scene = this.scenes[0];
        this.current_scene.play();
        var hand = document.getElementById('cursor-hand');
        var element_position = JS.element.refactor_bounding(Game.elements[0].getBoundingClientRect());
        console.log(element_position);
        console.log( element_position.x + element_position.width,  element_position.y + element_position.height)
        
        JS.element.move(hand, element_position.x + element_position.width, element_position.y + element_position.height);
        setTimeout(this.show_tutorial,1000);
        
    }.bind(this);
    
    this.set_user_answer = function(answers){
        this.current_scene.set_user_answer(answers);
    };
    
    this.next_scene = function(){
        var result = this.current_scene.check_answers();  
        if(result) {
            this.current_scene.stop();
            if(this.scenes[this.scenes.indexOf(this.current_scene)+1]){
                this.current_scene = this.scenes[this.scenes.indexOf(this.current_scene)+1];
                this.current_scene.play();
            } else {
                Game.finished_story(this.title);
                
            }
        }
    };
    
}