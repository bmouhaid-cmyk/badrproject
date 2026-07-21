const fs = require('fs');
let c = fs.readFileSync('src/DigitalModules.jsx', 'utf8');

const durationLogic = `const val = e.target.value === '' ? '' : parseFloat(e.target.value);
                      let newCredits = val;
                      if (formData.product_id && formData.product_id !== 'NEW_PRODUCT') {
                        const prod = digitalInventory?.find(p => p.id === formData.product_id);
                        if (prod && prod.credit_rules && prod.credit_rules[val] !== undefined && prod.credit_rules[val] !== '') {
                          newCredits = parseFloat(prod.credit_rules[val]);
                        }
                      } else if (formData.product_id === 'NEW_PRODUCT') {
                        if (formData.new_product_credit_rules && formData.new_product_credit_rules[val] !== undefined && formData.new_product_credit_rules[val] !== '') {
                          newCredits = parseFloat(formData.new_product_credit_rules[val]);
                        }
                      }
                      setFormData({...formData, duration_months: val, credits_to_deduct: newCredits});`;

c = c.replace(/const val = e\.target\.value === '' \? '' : parseFloat\(e\.target\.value\);\s*setFormData\(\{\.\.\.formData, duration_months: val, credits_to_deduct: val\}\);/g, durationLogic);

const productLogic = `{
                      const pid = e.target.value;
                      let newCredits = formData.credits_to_deduct;
                      const val = formData.duration_months;
                      if (pid && pid !== 'NEW_PRODUCT') {
                        const prod = digitalInventory?.find(p => p.id === pid);
                        if (prod && prod.credit_rules && prod.credit_rules[val] !== undefined && prod.credit_rules[val] !== '') {
                          newCredits = parseFloat(prod.credit_rules[val]);
                        }
                      } else if (pid === 'NEW_PRODUCT') {
                        if (formData.new_product_credit_rules && formData.new_product_credit_rules[val] !== undefined && formData.new_product_credit_rules[val] !== '') {
                          newCredits = parseFloat(formData.new_product_credit_rules[val]);
                        }
                      }
                      setFormData({...formData, product_id: pid, credits_to_deduct: newCredits});
                    }`;

c = c.replace(/setFormData\(\{\.\.\.formData, product_id: e\.target\.value\}\)/g, productLogic);

fs.writeFileSync('src/DigitalModules.jsx', c);
console.log('Patched');
