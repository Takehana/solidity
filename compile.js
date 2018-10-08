const path = require ('path');
const fs = require ('fs');
const solc = require ('solc');

const inbox_path = path.resolve(__dirname, 'contracts', 'Simplef3d.sol');
const source = fs.readFileSync (inbox_path, 'utf8');

//compile the 'Simplef3d.sol' file to bytecode
module.exports = solc.compile(source, 1).contracts[':Simplef3d'];