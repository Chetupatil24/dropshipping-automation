const fs = require('fs');

const filePath = './frontend/pages/cart.js';
let content = fs.readFileSync(filePath, 'utf8');

const replacements = [
  { old: /from-purple-600 via-pink-500 to-orange-400/g, new: 'from-blue-600 via-blue-700 to-purple-900' },
  { old: /from-purple-600 to-pink-500/g, new: 'from-blue-600 to-teal-600' },
  { old: /hover:from-purple-600 hover:to-pink-500/g, new: 'hover:from-blue-600 hover:to-teal-600' }
];

replacements.forEach(r => {
  content = content.replace(r.old, r.new);
});

fs.writeFileSync(filePath, content);
console.log('Updated cart.js');
