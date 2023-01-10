function isMouseOver(_x,_y,_w,_h){
	return mouseX > _x && mouseX < _x + _w && mouseY > _y && mouseY < _y + _h;
}
function activateCell(_i,_g){
	// Swap cell to live
	let converted = minefield.map[_i][_g].type == "hidden_safe" ? "safe" : "bomb";
	minefield.map[_i][_g].type = converted;

	// Active adjacent cells if it's a 0 cell
	if( converted == "safe" && minefield.map[_i][_g].close == 0 ){
		for(let i = -1; i < 2; i++){
			for(let g = -1; g < 2; g++){
				if( i == 0 && g == 0 ){
					continue;
				}
				try{
					if( minefield.map[i+_i][g+_g].type == "hidden_safe" ){
						activateCell( _i + i, _g + g );
					}
				}catch(e){
					//Avoid OOB errors
				}
			}
		}
	}
}
function countClose(_i,_g,_type){
	let count = 0;
	for(let i = -1;i < 2;i++){
		for(let g = -1;g < 2;g++){
			try{
				if( !(i == 0 && g == 0) && minefield.map[_i + i][_g + g].type == _type){
					count++;
				}
			}catch(e){
				//Avoids OOB errors
			}
		}
	}
	return count;
}
Array.prototype.iterate2D = function(_callback){
	for (let i = 0; i < this.length; i++) {
		for (let g = 0; g < this[i].length; g++) {
			let res = _callback(this[i][g],i,g);
			this[i][g] = res !== undefined ? res : this[i][g];
		}
	}
}
