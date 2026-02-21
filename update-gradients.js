const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const replacements = [
  { old: /from-purple-600 via-pink-500 to-orange-400/g, new: 'from-blue-600 via-blue-700 to-purple-900' },
  { old: /from-purple-600 to-pink-500/g, new: 'from-blue-600 to-teal-600' },
  { old: /from-purple-600 via-pink-500 to-red-500/g, new: 'from-blue-600 via-teal-500 to-blue-800' },
  { old: /hover:from-purple-700 hover:to-pink-600/g, new: 'hover:from-teal-600 hover:to-secondary' },
  { old: /hover:from-purple-600 hover:to-pink-500/g, new: 'hover:from-blue-600 hover:to-teal-600' },
  { old: /text-purple-500/g, new: 'text-blue-600' },
  { old: /text-purple-600/g, new: 'text-blue-700' },
  { old: /focus:ring-purple-500/g, new: 'focus:ring-blue-500' },
  { old: /hover:text-purple-500/g, new: 'hover:text-blue-500' },
  { old: /hover:text-pink-500/g, new: 'hover:text-teal-500' },
  { old: /bg-purple-300\/20/g, new: 'bg-teal-300/20' }
];

walkDir('./frontend/pages', (filePath) => {
  if (filePath.endsWith('.js') && !filePath.includes('login.js') && !filePath.includes('cart.js') && !filePath.includes('index.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(r => {
      content = content.replace(r.old, r.new);
    });
    
    if (content !== original) {
      console.log(`Updated ${filePath}`);
      fs.writeFileSync(filePath, content);
    }
  }
});
