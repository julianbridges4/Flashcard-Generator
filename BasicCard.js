function Basic(front, back) {
	if(this instanceof Basic) {
		this.front = front,
		this.back = back	
	} else {
		return new Basic(front, back);
	}
	
}

module.exports = Basic;