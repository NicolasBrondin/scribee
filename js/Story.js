var Story = function(){
    this.lang,
    this.premium,
    this.image;
    this.title;
    this.path;
    this.scenes = [];
    this.current_scene;  
    
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
    
    this.play = function(){
        this.current_scene = this.scenes[0];
        this.current_scene.play();
    };
    
    this.set_user_answer = function(answers){
        this.current_scene.set_user_answer(answers);
    };
    
    this.next_scene = function(){
        var result = this.current_scene.check_answers();  
        if(result) {
            this.current_scene.stop();
            this.current_scene = this.scenes[this.scenes.indexOf(this.current_scene)+1];
            this.current_scene.play();
        } else {
            
        }
    };
    
}