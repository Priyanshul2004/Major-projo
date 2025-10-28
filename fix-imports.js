const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace old import paths with new ones
    content = content.replace(/@\/components\/ui\//g, '@/shared/components/ui/');
    content = content.replace(/@\/components\/AppSidebar/g, '@/shared/components/AppSidebar');
    content = content.replace(/@\/components\/DashboardCard/g, '@/shared/components/DashboardCard');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixImportsInFile(filePath);
    }
  });
}

// Start from the features directory
walkDir('./src/features');
console.log('Import fixing completed!');
