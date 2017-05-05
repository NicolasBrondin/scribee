var Scene = function(){
    
    this.expected_answer= [];
    this.given_answer=[];
    this.sound = null;
    this.elements = [];
    this.answers = [];
    this.words=[];
    this.parent = null;
    
    this.play_sound = function() {
          if(this.sound){
               this.sound.play();
          }
        document.getElementById('narrator-mouth').style.animationName = "mouth";
     },
    
    this.init = function(parent, data){
        this.words = data.words; 
        this.sound = new Audio(data.sound);
        this.parent = parent;
        this.elements = [].slice.call(document.getElementById('elements_container').children);
        this.answers = [].slice.call(document.getElementById('answers_container').children).filter(function(i){return [].slice.call(i.classList).indexOf('drop') != -1;});
        this.sound.onended = function(){document.getElementById('narrator-mouth').style.animationName = "";};
    };
    
    this.stop = function(){
        this.sound.pause();  
    };
    
    this.play = function(){
        //generate gamefield
        Game.given_answer = [];
        Game.answers = [];
        Game.elements = [];
document.getElementById('elements_container').innerHTML = "";
document.getElementById('answers_container').innerHTML = "";
        this.words.forEach(function(w){
            if(w.img){
                var d = document.createElement('div');
                d.classList = "drag";
                d.onmousedown = function(event){Game.pick_element(event)};
                d.ontouchstart = function(event){Game.pick_element(event)};
                d.setAttribute('data',w.data);
                var i = document.createElement('img');
                i.src= "img/"+w.img+".png";
                var l = document.createElement('div');
                l.innerHTML = w.label;
                d.appendChild(i);
                d.appendChild(l);
                
                Game.elements.push(d);
                
                var drop  = document.createElement('div');
                drop.classList = "drop slot";
                document.getElementById('answers_container').appendChild(drop);
                Game.answers.push(drop);
            } else {
                //<div class="drop slot"  ></div>
                var drop = document.createElement('div');
                drop.classList = "slot";
                var p = document.createElement('p');
                p.innerHTML = w.label;
                drop.appendChild(p);
                document.getElementById('answers_container').appendChild(drop);
                Game.answers.push(drop);
            }
            
            Game.elements = JS.array.shuffle(Game.elements);
            Game.elements.forEach(function(e){
                document.getElementById('elements_container').appendChild(e);
            });
            
        });
        
        document.getElementById('menu-container').style.display = "none";
        document.getElementById('game-container').style.display = "block";
        this.play_sound();

    };
    
    this.set_user_answer = function(answers){
        this.given_answer = answers;
    };
    
    this.check_answers = function(){
        
        console.log(this.given_answer);
        console.log(Game.elements);
        var err = false;
        Game.elements.forEach(function(e){
            console.log(e.attributes.data.value);
            console.log(this.given_answer[e.attributes.data.value]);
            if(this.given_answer[e.attributes.data.value] == e.attributes.data.value){
                JS.element.remove_class(e, "error");
            } else {
                JS.element.add_class(e, "error");
                err = true;
            }
        }.bind(this));
        if(!err){
             Game.play_sound('success');
            return true;
            
        } else {
             Game.play_sound('fail');
            return false;
        }

    };
};