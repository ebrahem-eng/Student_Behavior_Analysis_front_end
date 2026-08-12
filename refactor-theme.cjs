const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-\[\#0B0F19\]/g, replacement: 'bg-background' },
  { regex: /bg-slate-900/g, replacement: 'bg-card' },
  { regex: /bg-slate-950/g, replacement: 'bg-background' },
  { regex: /bg-slate-800/g, replacement: 'bg-muted' },
  { regex: /text-white/g, replacement: 'text-foreground' },
  { regex: /text-slate-200/g, replacement: 'text-card-foreground' },
  { regex: /text-slate-300/g, replacement: 'text-muted-foreground' },
  { regex: /text-slate-400/g, replacement: 'text-muted-foreground' },
  { regex: /text-gray-300/g, replacement: 'text-muted-foreground' },
  { regex: /text-gray-400/g, replacement: 'text-muted-foreground' },
  { regex: /border-white\/10/g, replacement: 'border-border' },
  { regex: /border-white\/20/g, replacement: 'border-border' },
  { regex: /bg-white\/10/g, replacement: 'bg-secondary' },
  { regex: /bg-white\/5/g, replacement: 'bg-secondary/50' },
  { regex: /hover:bg-white\/10/g, replacement: 'hover:bg-accent hover:text-accent-foreground' },
  { regex: /hover:text-white/g, replacement: 'hover:text-foreground' },
  { regex: /focus:text-white/g, replacement: 'focus:text-foreground' },
  { regex: /focus:bg-white\/10/g, replacement: 'focus:bg-accent focus:text-accent-foreground' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let updated = false;
      
      for (const rule of replacements) {
        if (rule.regex.test(content)) {
          content = content.replace(rule.regex, rule.replacement);
          updated = true;
        }
      }
      
      if (updated) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory(srcDir);
console.log("Refactoring complete.");
