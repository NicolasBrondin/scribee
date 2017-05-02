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
                document.getElementById('elements_container').appendChild(d);
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
            
            
            
        });
        
        document.getElementById('menu-container').style.display = "none";
        document.getElementById('game-container').style.display = "block";
        this.play_sound();
        //document.getElementById('narrator-screen').style.display = "block";
    };
    
    this.set_user_answer = function(answers){
        this.given_answer = answers;
        console.log(answers);
    };
    
    this.check_answers = function(){
        /*Game.given_answer.forEach(function(a,i){
            if(a !== i){
                
            } else {
                
            }
        });*/
        var err = false;
        Game.elements.forEach(function(e,i){
            if(this.given_answer[i] === i){
                e.style.border = "none";
            } else {
                e.style.border = "4px solid #e74c3c";
                err = true;
            }
        }.bind(this));
        if(!err){
            return true;
        } else {
            return false;
        }
        /*
          Game.expected_answer.forEach(function(a,i){
              //console.log(Game.elements);
              if([].slice.call(a.classList).indexOf('drop') != -1){
                  if(Game.given_answer[i] != null && Game.given_answer[i] ==a){
                      Game.elements[a].style.border = "none";
                      Game.elements[a].style.margin = "5px";
                  }else {
                      console.log(Game.given_answer[i], a);
                      Game.elements[a].style.border = "4px solid #e74c3c";
                      Game.elements[a].style.margin = "0";
                  }
              }
          });
          if(JSON.stringify(Game.expected_answer) === JSON.stringify(Game.given_answer)){
              Game.score ++;
              alert("Gagné");
          } else {
              Game.score --;
          }
         console.log(Game.score);*/
    };
};