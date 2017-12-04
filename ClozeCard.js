function Cloze(full, partial, cloze) {
	if(this instanceof Cloze) {
		this.full = full;
		this.partial = partial;
		this.cloze = cloze;	
	} else {
		return new Cloze(full, partial, cloze);
	}
}

module.exports = Cloze;