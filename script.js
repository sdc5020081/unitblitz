const units = {
    length: {
        kilometer: 1000,     // Common
        meter: 1,            // Common
        centimeter: 0.01,    // Common
        millimeter: 0.001,   // Common
        inch: 0.0254,        // Common
        foot: 0.3048,        // Common
        yard: 0.9144,        // Common
        mile: 1609.34,       // Common
        lightyear: 9460730472580800, // Fun
        astronomicalunit: 149597870700, // Fun
        parsec: 30856775814671900     // Fun
    },
    weight: {
        ton: 1000,           // Common (metric ton, 1000 kg)
        kilogram: 1,         // Common
        gram: 0.001,         // Common
        milligram: 0.000001, // Common
        pound: 0.453592,     // Common
        ounce: 0.0283495,    // Common
        solarmass: 1.989e30, // Fun
        earthmass: 5.972e24  // Fun
    },
    volume: {
        kiloliter: 1000,     // Common
        liter: 1,            // Common
        milliliter: 0.001,   // Common
        gallon: 3.78541,     // Common
        quart: 0.946353,     // Common
        pint: 0.473176,      // Common
        cubiclightyear: 8.467e48, // Fun
        cubickilometer: 1e9      // Fun
    },
    temperature: {
        celsius: (val) => val,
        fahrenheit: (val) => (val * 9/5) + 32,
        kelvin: (val) => val + 273.15
    }
};

function switchCategory(category) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.setAttribute('aria-expanded', 'false');
    });
    // Show the selected tab content
    const selectedTab = document.getElementById(`${category}-tab`);
    selectedTab.style.display = 'block';
    selectedTab.setAttribute('aria-expanded', 'true');
    // Update aria-selected on tabs
    document.querySelectorAll('.tabs button').forEach(tab => {
        tab.setAttribute('aria-selected', tab.getAttribute('onclick').includes(category) ? 'true' : 'false');
    });
    // Populate dropdowns for the selected category
    populateDropdowns(category);
    // Trigger real-time conversion
    convertRealTime(category);
}

function populateDropdowns(category) {
    const fromUnit = document.getElementById(`fromUnit-${category}`);
    const toUnit = document.getElementById(`toUnit-${category}`);

    // Clear existing options
    fromUnit.innerHTML = '';
    toUnit.innerHTML = '';

    // Use existing units as-is (common units first, fun units after)
    for (let unit in units[category]) {
        let option1 = new Option(unit.charAt(0).toUpperCase() + unit.slice(1), unit);
        let option2 = new Option(unit.charAt(0).toUpperCase() + unit.slice(1), unit);
        fromUnit.add(option1);
        toUnit.add(option2);
    }
}

function convertRealTime(category) {
    const inputValue = parseFloat(document.getElementById(`inputValue-${category}`).value);
    const fromUnit = document.getElementById(`fromUnit-${category}`).value;
    const toUnit = document.getElementById(`toUnit-${category}`).value;
    const resultDiv = document.getElementById(`result-${category}`);

    if (isNaN(inputValue) || inputValue === 0) {
        resultDiv.textContent = "Please enter a valid non-zero number!";
        resultDiv.style.color = "#e74c3c"; // Red for errors
        setTimeout(() => {
            resultDiv.style.color = getResultColor();
            resultDiv.textContent = "Result: ";
        }, 2000);
        return;
    }

    let result;
    if (category === 'temperature') {
        const fromFunc = units.temperature[fromUnit];
        const toFunc = units.temperature[toUnit];
        result = toFunc(fromFunc(inputValue));
    } else {
        const fromValue = units[category][fromUnit];
        const toValue = units[category][toUnit];
        result = (inputValue * fromValue) / toValue;
    }

    // Handle large numbers for fun units by adjusting precision
    if (result >= 1000000 || result <= 0.000001) {
        resultDiv.textContent = `Result: ${result.toExponential(4)} ${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`;
    } else {
        resultDiv.textContent = `Result: ${result.toFixed(4)} ${toUnit.charAt(0).toUpperCase() + toUnit.slice(1)}`;
    }
    resultDiv.style.color = getResultColor();
}

function getResultColor() {
    return document.body.classList.contains('dark-mode') ? '#a0e6a0' : '#2ecc71';
}

function convert() {
    // Determine current category from visible tab
    const visibleTab = document.querySelector('.tab-content[aria-expanded="true"]');
    const category = visibleTab.id.replace('-tab', '');
    convertRealTime(category);
}

// Dark Mode Toggle
document.getElementById('darkModeToggle').addEventListener('click', () => {
    // Toggle dark mode on body
    document.body.classList.toggle('dark-mode');
    // Toggle dark mode on header
    document.querySelector('header').classList.toggle('dark-mode');
    // Toggle dark mode on converter-box
    document.querySelector('.converter-box').classList.toggle('dark-mode');
    // Toggle dark mode on all select, input, and button elements
    document.querySelectorAll('select, input, button').forEach(element => {
        element.classList.toggle('dark-mode');
    });
    // Toggle dark mode on all result divs
    document.querySelectorAll('#result, #result-weight, #result-volume, #result-temperature').forEach(element => {
        element.classList.toggle('dark-mode');
    });
    // Update toggle icon
    const toggleIcon = document.querySelector('.toggle-icon');
    toggleIcon.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});

// Real-time input listener for each category
['length', 'weight', 'volume', 'temperature'].forEach(category => {
    document.getElementById(`inputValue-${category}`).addEventListener('input', () => convertRealTime(category));
    document.getElementById(`fromUnit-${category}`).addEventListener('change', () => convertRealTime(category));
    document.getElementById(`toUnit-${category}`).addEventListener('change', () => convertRealTime(category));
});

// Load initial state (Length tab by default)
window.onload = () => {
    switchCategory('length');
    convertRealTime('length'); // Ensure initial conversion works for Length
};

// Add keyboard support for accessibility
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            convert();
        }
    });
});