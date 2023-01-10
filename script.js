let minefield = {
	width: "to be assigned",
	height: "to be assigned",
	map: [],
}
let keys = [];

function keyPressed(){
	keys[keyCode] = true;
}
function keyReleased(){
	keys[keyCode] = false;
}
function flag(_i,_g){
	minefield.map[_i][_g].type = "flagged";
}
function setup() {
	// Init Canvas
  createCanvas(windowWidth,windowHeight);
	minefield.width = floor(windowWidth / 20);
	minefield.height = floor(windowHeight / 20);
	// Build the raw map
	for (let i = 0; i < minefield.width; i++) {
		let to_push = [];
		for (let g = 0; g < minefield.height; g++) {
			to_push.push(random() < 0.1 ? {type:"hidden_bomb"} : {type:"hidden_safe"});
		}
		minefield.map.push(to_push)
	}
	minefield.map.iterate2D((cell,i,g)=>{
		if(cell.type == "hidden_bomb"){
			return;
		}
		let new_cell = {
			type: "hidden_safe",
			close: countClose(i,g,"hidden_bomb"),
		}
		return new_cell;
	})
}
function draw() {
	background(155);
	// Draw the visual map
	function update(){
	minefield.map.iterate2D((cell,i,g) => {
		switch(cell.type) {
			case "bomb":
			 	fill(255,0,0);
				noStroke();
				break;
			case "safe":
				fill(0,255,0);
				noStroke();
				break;
			case "hidden_bomb":
				fill(205);
				stroke(175);
				break;
			case "hidden_safe":
				fill(205);
				stroke(175);
				break;
			case "flagged":
				fill(0,0,205);
				stroke(175);
				break;
		}
		strokeWeight(2);
		if( isMouseOver(i * 20,g * 20, 20, 20) && (cell.type == "hidden_bomb" || cell.type == "hidden_safe") ){
			stroke(0);
			if(mouseIsPressed){
				activateCell(i,g)
			}
			if(keys[32]){
				flag(i,g);
			}
		}
		rect(i * 20, g * 20, 20, 20);
		if(cell.type == "safe" && cell.close != 0){
			fill(0,0,0);
			noStroke();
			textSize(12);
			text(cell.close, i * 20 + 5, g * 20 + 10);
		}
	});
	}
	update();
		
	minefield.map.iterate2D((cell,i,g) => {
		if(cell.type == "safe" && countClose(i,g,"flagged") == cell.close){
			for(let x = -1;x < 2;x++){
				for(let y = -1;y < 2;y++){
					if(x == 0 && y == 0){
						continue;
					}
					try{
						if(minefield.map[i + x][g + y].type != "flagged" && minefield.map[i + x][g + y].type != "safe"){
							activateCell(i + x,g + y);
						}
					}catch(e){
						// Avoids OOB errors
					}
				}
			}
		}
		if(cell.type == "safe" && (8-cell.close) == countClose(i,g,"safe")){
			for(let x = -1;x < 2;x++){
				for(let y = -1;y < 2;y++){
					if(x == 0 && y == 0){
						continue;
					}
					try{
						if(minefield.map[i + x][g + y].type != "flagged" && minefield.map[i + x][g + y].type != "safe"){
							flag(i + x,g + y);
						}
					}catch(e){
						// Avoids OOB errors
					}
				}
			}
		}
	});
	
}
