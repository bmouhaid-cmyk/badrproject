const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'DigitalModules.jsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace parseInt for specific fields
code = code.replace(/parseInt\(([^)]*(duration_months|credits_to_deduct|restockAmount|quantity|creditsUsed))[^)]*\)/g, 'parseFloat($1)');
// Also replace `const val = parseInt(e.target.value);` in the duration_months onChange
code = code.replace(/const val = parseInt\(e\.target\.value\);/g, 'const val = parseFloat(e.target.value);');

// Add step="any" to credits_to_deduct input if missing
code = code.replace(/<input required type="number" min="0"/g, '<input required type="number" step="any" min="0"');

// Replace duration_months <select> with <input>
const selectRegex = /<select className="w-full border-gray-300 rounded-lg p-2 border" value=\{formData\.duration_months\} onChange=\{e => \{\s*const val = parseFloat\(e\.target\.value\);\s*setFormData\(\{\.\.\.formData, duration_months: val, credits_to_deduct: val\}\);\s*\}\}>\s*<option value=\{1\}>1 Mois<\/option>\s*<option value=\{3\}>3 Mois<\/option>\s*<option value=\{6\}>6 Mois<\/option>\s*<option value=\{12\}>12 Mois \(1 An\)<\/option>\s*<\/select>/g;

const replacementInput = `<input type="number" step="any" min="0" className="w-full border-gray-300 rounded-lg p-2 border focus:ring-2 focus:ring-purple-500" value={formData.duration_months} onChange={e => {
                      const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                      setFormData({...formData, duration_months: val, credits_to_deduct: val});
                    }} />`;

code = code.replace(selectRegex, replacementInput);

fs.writeFileSync(filePath, code);
console.log('Fixed parseInt and UI in DigitalModules.jsx');
