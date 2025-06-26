    function calculateDailyValue(nutrient, value) {
      const dv = {
        totalFat: 78,           // grams
        saturatedFat: 20,       // grams
        cholesterol: 300,       // mg
        sodium: 2300,           // mg
        totalCarbs: 275,        // grams
        dietaryFiber: 28,       // grams
        addedSugars: 50,        // grams
        protein: 50,            // grams

        vitaminA: 900,          // mcg RAE
        vitaminC: 90,           // mg
        vitaminD: 20,           // mcg
        vitaminE: 15,           // mg alpha-tocopherol
        vitaminK: 120,          // mcg
        thiamin: 1.2,           // mg
        riboflavin: 1.3,        // mg
        niacin: 16,             // mg NE
        vitaminB6: 1.7,         // mg
        folate: 400,            // mcg DFE
        folicAcid: 400,         // mcg DFE
        vitaminB12: 2.4,        // mcg
        biotin: 30,             // mcg
        pantothenicAcid: 5,     // mg
        phosphorus: 1250,       // mg
        iodine: 150,            // mcg
        magnesium: 420,         // mg
        zinc: 11,               // mg
        selenium: 55,           // mcg
        copper: 0.9,            // mg
        manganese: 2.3,         // mg
        chromium: 35,           // mcg
        molybdenum: 45,         // mcg
        chloride: 2300,         // mg
        choline: 550            // mg
      };
      const base = dv[nutrient];
      if (!base || !value) return '';
      const percent = Math.round((parseFloat(value) / base) * 100);
      return `${percent}%`;
    }


    // Update all vitamin labels when the format selector changes
    document.getElementById('vitaminFormat').addEventListener('change', function() {
      const fmt = this.value;  // "percentage" or "units"

      // Main vitamins
      const mainLabels = {
        vitaminD:    fmt === 'percentage' ? 'Vitamin D (%)'    : 'Vitamin D (mcg)',
        calcium:     fmt === 'percentage' ? 'Calcium (%)'       : 'Calcium (mg)',
        iron:        fmt === 'percentage' ? 'Iron (%)'          : 'Iron (mg)',
        potassium:   fmt === 'percentage' ? 'Potassium (%)'     : 'Potassium (mg)'
      };

      // Optional vitamins
      const optionalLabels = {
        vitaminA:          ['Vitamin A (%)',           'Vitamin A (mcg)'],
        vitaminC:          ['Vitamin C (%)',           'Vitamin C (mg)'],
        vitaminE:          ['Vitamin E (%)',           'Vitamin E (mg)'],
        vitaminK:          ['Vitamin K (%)',           'Vitamin K (mcg)'],
        thiamin:           ['Thiamin (%)',             'Thiamin (mg)'],
        riboflavin:        ['Riboflavin (%)',          'Riboflavin (mg)'],
        niacin:            ['Niacin (%)',              'Niacin (mg)'],
        vitaminB6:         ['Vitamin B6 (%)',          'Vitamin B6 (mg)'],
        folate:            ['Folate (%)',              'Folate (mcg DFE)'],
        vitaminB12:        ['Vitamin B12 (%)',         'Vitamin B12 (mcg)'],
        biotin:            ['Biotin (%)',              'Biotin (mcg)'],
        pantothenicAcid:   ['Pantothenic Acid (%)',    'Pantothenic Acid (mg)'],
        phosphorus:        ['Phosphorus (%)',          'Phosphorus (mg)'],
        iodine:            ['Iodine (%)',              'Iodine (mcg)'],
        magnesium:         ['Magnesium (%)',           'Magnesium (mg)'],
        zinc:              ['Zinc (%)',                'Zinc (mg)'],
        selenium:          ['Selenium (%)',            'Selenium (mcg)'],
        copper:            ['Copper (%)',              'Copper (mg)'],
        manganese:         ['Manganese (%)',           'Manganese (mg)'],
        chromium:          ['Chromium (%)',            'Chromium (mcg)'],
        molybdenum:        ['Molybdenum (%)',          'Molybdenum (mcg)'],
        chloride:          ['Chloride (%)',            'Chloride (mg)']
      };

      // Apply updates to main vitamins
      Object.entries(mainLabels).forEach(([key, text]) => {
        const lbl = document.getElementById(`label-${key}`);
        if (lbl) lbl.textContent = text;
      });

      // Apply updates to optional vitamins
      Object.entries(optionalLabels).forEach(([key, [percText, unitText]]) => {
        const lbl = document.getElementById(`label-${key}`);
        if (lbl) lbl.textContent = fmt === 'percentage' ? percText : unitText;
      });
    });

    // Initialize labels on page load
    document.getElementById('vitaminFormat').dispatchEvent(new Event('change'));

    // Toggle optional vitamins fields
    document.getElementById('showOptionalVitamins').addEventListener('change', function() {
      const wrapper = document.getElementById('optional-vitamin-fields');
      if (this.checked) {
        wrapper.style.display = '';   // clear inline to revert to CSS grid
      } else {
        wrapper.style.display = 'none';
      }
    });

    // Toggle visibility of vitamins section based on Include Vitamins checkbox
    const includeCheckbox = document.getElementById('includeVitamins');
    const vitaminsContainer = document.getElementById('vitamins-container');
    function toggleVitaminsContainer() {
      vitaminsContainer.style.display = includeCheckbox.checked ? '' : 'none';
    }
    includeCheckbox.addEventListener('change', toggleVitaminsContainer);
    // Initialize on page load
    toggleVitaminsContainer();


    document.getElementById('nutrition-form').addEventListener('submit', function (e) {
      e.preventDefault();
      const form = new FormData(this);
      const values = Object.fromEntries(form.entries());
      values.hideProteinDV = form.has('hideProteinDV');
      values.showOptionalVitamins = form.has('showOptionalVitamins');
      values.showVitaminUnits = form.has('showVitaminUnits');
      values.includeVitamins = form.has('includeVitamins');

      // Determine whether user input is %DV or units from the Vitamin Data Format dropdown
      const inputFormat = values.vitaminFormat || 'percentage';
      const nutrientBases = {
        vitaminD: 20, calcium: 1300, iron: 18, potassium: 4700,
        vitaminA: 900, vitaminC: 90, vitaminE: 15, vitaminK: 120,
        thiamin: 1.2, riboflavin: 1.3, niacin: 16, vitaminB6: 1.7,
        folate: 400, vitaminB12: 2.4, biotin: 30,
        pantothenicAcid: 5, phosphorus: 1250, iodine: 150, magnesium: 420,
        zinc: 11, selenium: 55, copper: 0.9, manganese: 2.3,
        chromium: 35, molybdenum: 45, chloride: 2300
      };
      Object.keys(nutrientBases).forEach(nutrient => {
        const raw = parseFloat(values[nutrient]);
        if (isNaN(raw)) return;
        if (inputFormat === 'percentage') {
          // raw is %DV: store percent directly, compute units
          values[`${nutrient}_percent`] = raw;
          values[`${nutrient}_unit`] = Math.round((raw / 100) * nutrientBases[nutrient] * 100) / 100;
        } else {
          // raw is unit: store units directly, compute %DV
          values[`${nutrient}_unit`] = raw;
          values[`${nutrient}_percent`] = Math.round((raw / nutrientBases[nutrient]) * 100);
        }
      });
      // Folic Acid: no conversion, use raw mcg input
      if (!isNaN(parseFloat(values.folicAcid))) {
        values.folicAcid_unit = parseFloat(values.folicAcid);
      }

      const label = document.createElement('div');
      label.className = 'label';

      label.innerHTML = `
        <header>
          <h1 class="bold">Nutrition Facts</h1>
          <div class="divider"></div>
          <p>${values.servingsPerContainer || 0} servings per container</p>
          <p class="bold">Serving size <span>${values.servingSizeQuantity || ''} ${values.servingSizeUnit || ''}</span></p>
        </header>

        <div class="divider large"></div>

        <div class="calories-info">
          <div class="left-container">
            <h2 class="bold small-text">Amount per serving</h2>
            <p>Calories</p>
          </div>
          <span>${values.calories}</span>
        </div>

        <div class="divider medium"></div>

        <div class="daily-value small-text">
          <p class="bold right no-divider">% Daily Value *</p>
          <div class="divider"></div>

          <p>
            <span><span class="bold">Total Fat</span> ${values.totalFat || 0}g</span>
            <span class="bold">${calculateDailyValue('totalFat', values.totalFat)}</span>
          </p>

          <p class="indent no-divider">
            Saturated Fat ${values.saturatedFat || 0}g
            <span class="bold">${calculateDailyValue('saturatedFat', values.saturatedFat)}</span>
          </p>
          <div class="divider"></div>

          <p class="indent no-divider">
            <span><em>Trans</em> Fat ${values.transFat || 0}g</span>
          </p>
          <div class="divider"></div>
          ${values.polyunsaturatedFat
            ? `
              <p class="indent no-divider">
                <span>Polyunsaturated Fat ${values.polyunsaturatedFat || 0}g</span>
              </p>
              <div class="divider"></div>
            `
            : ``
          }
          ${values.monounsaturatedFat
            ? `
              <p class="indent no-divider">
                <span>Monounsaturated Fat ${values.monounsaturatedFat || 0}g</span>
              </p>
              <div class="divider"></div>
            `
            : ``
          }

          <p>
            <span><span class="bold">Cholesterol</span> ${values.cholesterol || 0}mg</span>
            <span class="bold">${calculateDailyValue('cholesterol', values.cholesterol)}</span>
          </p>

          <p>
            <span><span class="bold">Sodium</span> ${values.sodium || 0}mg</span>
            <span class="bold">${calculateDailyValue('sodium', values.sodium)}</span>
          </p>

          <p>
            <span><span class="bold">Total Carbohydrate</span> ${values.totalCarbs || 0}g</span>
            <span class="bold">${calculateDailyValue('totalCarbs', values.totalCarbs)}</span>
          </p>

          <p class="indent no-divider">
            Dietary Fiber ${values.dietaryFiber || 0}g
            <span class="bold">${calculateDailyValue('dietaryFiber', values.dietaryFiber)}</span>
          </p>
          <div class="divider"></div>

          <p class="indent no-divider">
            Total Sugars ${values.totalSugars || 0}g
          </p>
          <div class="shortened"></div>

          <p class="double-indent no-divider">
            Includes ${values.addedSugars || 0}g Added Sugars
            <span class="bold">${calculateDailyValue('addedSugars', values.addedSugars)}</span>
          </p>
          <div class="divider"></div>
          ${values.sugarAlcohol
            ? `
              <p class="indent no-divider">
                Sugar Alcohol ${values.sugarAlcohol || 0}g
              </p>
              <div class="divider"></div>
            `
            : ``
          }

          <p class="no-divider">
            <span><span class="bold">Protein</span> ${values.protein || 0}g</span>
            ${!values.hideProteinDV 
              ? `<span class="bold">${calculateDailyValue('protein', values.protein)}</span>`
              : ``
            }
          </p>
          <div class="divider large"></div>
          ${
            values.includeVitamins
              ? `
                <p>
                  Vitamin D ${values.vitaminD_unit || 0}mcg
                  <span>${values.vitaminD_percent || 0}%</span>
                </p>
                <p>
                  Calcium ${values.calcium_unit || 0}mg
                  <span>${values.calcium_percent || 0}%</span>
                </p>
                <p>
                  Iron ${values.iron_unit || 0}mg
                  <span>${values.iron_percent || 0}%</span>
                </p>
                <p class="no-divider">
                  Potassium ${values.potassium_unit || 0}mg
                  <span>${values.potassium_percent || 0}%</span>
                </p>
              `
              : `
                <p class="no-divider" style="font-size: 0.6rem;">
                  Not a significant source of vitamin D, calcium, iron, and potassium
                </p>
                <div class="divider"></div>
              `
          }
          ${
            values.showOptionalVitamins ? `
            <div class="divider"></div>
              ${ values.vitaminA_unit ? `
                <p>
                  Vitamin A ${values.showVitaminUnits ? values.vitaminA_unit + 'mcg' : ''} <span>${values.vitaminA_percent}%</span>
                </p>
              ` : `` }
              ${ values.vitaminC_unit ? `
                <p>
                  Vitamin C ${values.showVitaminUnits ? values.vitaminC_unit + 'mg' : ''} <span>${values.vitaminC_percent}%</span>
                </p>
              ` : `` }
              ${ values.vitaminE_unit ? `
                <p>
                  Vitamin E ${values.showVitaminUnits ? values.vitaminE_unit + 'mg' : ''} <span>${values.vitaminE_percent}%</span>
                </p>
              ` : `` }
              ${ values.vitaminK_unit ? `
                <p>
                  Vitamin K ${values.showVitaminUnits ? values.vitaminK_unit + 'mcg' : ''} <span>${values.vitaminK_percent}%</span>
                </p>
              ` : `` }
              ${ values.thiamin_unit ? `
                <p>
                  Thiamin ${values.showVitaminUnits ? values.thiamin_unit + 'mg' : ''} <span>${values.thiamin_percent}%</span>
                </p>
              ` : `` }
              ${ values.riboflavin_unit ? `
                <p>
                  Riboflavin ${values.showVitaminUnits ? values.riboflavin_unit + 'mg' : ''} <span>${values.riboflavin_percent}%</span>
                </p>
              ` : `` }
              ${ values.niacin_unit ? `
                <p>
                  Niacin ${values.showVitaminUnits ? values.niacin_unit + 'mg' : ''} <span>${values.niacin_percent}%</span>
                </p>
              ` : `` }
              ${ values.vitaminB6_unit ? `
                <p>
                  Vitamin B6 ${values.showVitaminUnits ? values.vitaminB6_unit + 'mg' : ''} <span>${values.vitaminB6_percent}%</span>
                </p>
              ` : `` }
              ${ values.folate_unit ? `
                <p class="no-divider">
                  Folate ${values.showVitaminUnits ? values.folate_unit + 'mcg DFE' : ''} <span>${values.folate_percent}%</span>
                </p>
              ` : `` }
              ${ values.folicAcid_unit ? `
                <p>
                  &nbsp;&nbsp;(${values.folicAcid_unit}mcg folic acid)
                </p>
              ` : `` }
              ${ values.vitaminB12_unit ? `
                <p>
                  Vitamin B12 ${values.showVitaminUnits ? values.vitaminB12_unit + 'mcg' : ''} <span>${values.vitaminB12_percent}%</span>
                </p>
              ` : `` }
              ${ values.biotin_unit ? `
                <p>
                  Biotin ${values.showVitaminUnits ? values.biotin_unit + 'mcg' : ''} <span>${values.biotin_percent}%</span>
                </p>
              ` : `` }
              ${ values.pantothenicAcid_unit ? `
                <p>
                  Pantothenic Acid ${values.showVitaminUnits ? values.pantothenicAcid_unit + 'mg' : ''} <span>${values.pantothenicAcid_percent}%</span>
                </p>
              ` : `` }
              ${ values.phosphorus_unit ? `
                <p>
                  Phosphorus ${values.showVitaminUnits ? values.phosphorus_unit + 'mg' : ''} <span>${values.phosphorus_percent}%</span>
                </p>
              ` : `` }
              ${ values.iodine_unit ? `
                <p>
                  Iodine ${values.showVitaminUnits ? values.iodine_unit + 'mcg' : ''} <span>${values.iodine_percent}%</span>
                </p>
              ` : `` }
              ${ values.magnesium_unit ? `
                <p>
                  Magnesium ${values.showVitaminUnits ? values.magnesium_unit + 'mg' : ''} <span>${values.magnesium_percent}%</span>
                </p>
              ` : `` }
              ${ values.zinc_unit ? `
                <p>
                  Zinc ${values.showVitaminUnits ? values.zinc_unit + 'mg' : ''} <span>${values.zinc_percent}%</span>
                </p>
              ` : `` }
              ${ values.selenium_unit ? `
                <p>
                  Selenium ${values.showVitaminUnits ? values.selenium_unit + 'mcg' : ''} <span>${values.selenium_percent}%</span>
                </p>
              ` : `` }
              ${ values.copper_unit ? `
                <p>
                  Copper ${values.showVitaminUnits ? values.copper_unit + 'mg' : ''} <span>${values.copper_percent}%</span>
                </p>
              ` : `` }
              ${ values.manganese_unit ? `
                <p>
                  Manganese ${values.showVitaminUnits ? values.manganese_unit + 'mg' : ''} <span>${values.manganese_percent}%</span>
                </p>
              ` : `` }
              ${ values.chromium_unit ? `
                <p>
                  Chromium ${values.showVitaminUnits ? values.chromium_unit + 'mcg' : ''} <span>${values.chromium_percent}%</span>
                </p>
              ` : `` }
              ${ values.molybdenum_unit ? `
                <p>
                  Molybdenum ${values.showVitaminUnits ? values.molybdenum_unit + 'mcg' : ''} <span>${values.molybdenum_percent}%</span>
                </p>
              ` : `` }
              ${ values.chloride_unit ? `
                <p class="no-divider">
                  Chloride ${values.showVitaminUnits ? values.chloride_unit + 'mg' : ''} <span>${values.chloride_percent}%</span>
                </p>
              ` : `` }
            ` : `` }
        </div>

        ${
          values.includeVitamins
            ? `<div class="divider medium"></div>`
            : ``
        }

        <p class="note">
          * The % Daily Value (DV) tells you how much a nutrient in a serving of food
          contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
        </p>
      `;

      const output = document.getElementById('label-output');
      output.innerHTML = '';
      output.appendChild(label);

      // Download PNG (white background)
      document.getElementById('download-png').onclick = () => {
        html2canvas(label, { backgroundColor: '#ffffff' }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'nutrition-label.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      };
      // Download vector PDF via Puppeteer service
      document.getElementById('download-pdf').onclick = async () => {
        // Collect all inline <style> and external stylesheet <link> tags so the PDF keeps identical CSS
        const styleTags = [...document.head.querySelectorAll('style, link[rel="stylesheet"]')]
                          .map(tag => tag.outerHTML).join('\n');

        // Build a minimal HTML document containing just the label, and add a <base> tag for correct font URLs
        const htmlDoc = `
          <!doctype html>
          <html>
           <head>
            <base href="${window.location.origin}/">
            <meta charset="utf-8">
            ${styleTags}
            <style>
              body { margin: 0; }
              .pdf-wrapper {
                padding: 8px;                    /* 8px on every side */
                display: inline-block;
                background: white;               /* ensure a white backdrop */
              }
              @page { margin: 0; }        /* no extra printer margin */
            </style>
           </head>
           <body>
            <div class="pdf-wrapper">
              ${document.getElementById('label-output').innerHTML}
            </div>
           </body>
          </html>`;

        // Call the local Puppeteer micro‑service
        const resp = await fetch(`${window.PDF_SERVICE_URL}/api/pdf`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: htmlDoc })
        });
        if (!resp.ok) {
          alert('PDF service error: ' + (await resp.text()));
          return;
        }

        // Trigger browser download
        const blob = await resp.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'nutrition-label.pdf';
        link.click();
      };
    });