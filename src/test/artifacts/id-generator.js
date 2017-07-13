var gen = {};

gen.prefix = "abcdefghij1234";
gen.filler = "0000000000";
gen.stacker = 0;

gen.get = function() {
	gen.stacker++;

	var variable = (gen.filler+gen.stacker).slice(-10);

	return gen.prefix+variable
};



module.exports = gen;
