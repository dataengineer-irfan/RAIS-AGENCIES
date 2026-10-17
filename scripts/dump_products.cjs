const fs = require('fs');
const content = fs.readFileSync('./src/data/catalogue.ts', 'utf8');

// Quick parser for products in catalogue.ts
const productRegex = /sku:\s*'([^']+)',\s*categoryCode:\s*'([^']+)',\s*categoryName:\s*'([^']+)',\s*name:\s*'([^']+)',\s*brand:\s*'([^']+)',\s*pack:\s*'([^']+)',\s*hsn:\s*'([^']+)',/g;

let match;
let count = 0;
const products = [];
while ((match = productRegex.exec(content)) !== null) {
  count++;
  products.push({
    index: count,
    sku: match[1],
    categoryCode: match[2],
    categoryName: match[3],
    name: match[4],
    brand: match[5],
    pack: match[6],
    hsn: match[7]
  });
}

console.log('Parsed Products count:', products.length);
products.forEach(p => {
  console.log(`${p.index}. [${p.sku}] ${p.name} | ${p.brand} | ${p.pack} | ${p.categoryCode} | HSN:${p.hsn}`);
});
