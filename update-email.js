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
  { old: /your@email\.com/g, new: 'ruthanshoppingspot@gmail.com' },
  { old: /info@ruthan\.com/g, new: 'ruthanshoppingspot@gmail.com' },
  { old: /support@ruthan\.com/g, new: 'ruthanshoppingspot@gmail.com' }
];

walkDir('./frontend', (filePath) => {
  if (filePath.endsWith('.js') && !filePath.includes('node_modules') && !filePath.includes('.next')) {
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

walkDir('./backend', (filePath) => {
    if (filePath.endsWith('.js') && !filePath.includes('node_modules')) {
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

