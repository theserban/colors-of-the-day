function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000' : '#FFF'; // Adjust threshold as needed
}

function generateSeed(date) {
    var hash = 0;
    for (var i = 0; i < date.length; i++) {
        var char = date.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function pseudoRandom(seed) {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


function generateOppositeColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60; // Saturation between 60% and 100%
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40; // Lightness between 40% and 60%
    
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`;
    
    const primaryHex = HSLToHex(baseHue, saturation, lightness);
    const secondaryHex = HSLToHex((baseHue + 180) % 360, saturation, lightness);
    
    return { primaryColor, secondaryColor, primaryHex, secondaryHex };
}

// Analogous Harmony
function generateAnalogousColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60;
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40;
    
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${(baseHue + 30) % 360}, ${saturation}%, ${lightness}%)`; // +30 degrees for analogous
    
    return {
        primaryColor,
        secondaryColor,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex((baseHue + 30) % 360, saturation, lightness)
    };
}

// Triadic Harmony
function generateTriadicColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60;
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40;
    
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${(baseHue + 120) % 360}, ${saturation}%, ${lightness}%)`; // +120 degrees for triadic
    
    return {
        primaryColor,
        secondaryColor,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex((baseHue + 120) % 360, saturation, lightness)
    };
}

// Split-Complementary Harmony
function generateSplitComplementaryColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60;
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40;
    
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;    
    return {
        primaryColor,
        secondaryColor: splitComp1,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex((baseHue + 150) % 360, saturation, lightness)
    };
}

// Tetradic Harmony
function generateTetradicColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const secondHue = (baseHue + 120) % 360; // +120 degrees for the second color
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60;
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40;
    
    // The first complementary pair
    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const complementaryColor = `hsl(${(baseHue + 180) % 360}, ${saturation}%, ${lightness}%)`;
    
    return {
        primaryColor,
        secondaryColor: complementaryColor,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex((baseHue + 180) % 360, saturation, lightness)
    };
}

// Square Harmony
function generateSquareColorsForDate(date) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60;
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40;
    
    // Four colors spaced evenly (90 degrees apart)
    const secondHue = (baseHue + 90) % 360;
    
    return {
        primaryColor: `hsl(${baseHue}, ${saturation}%, ${lightness}%)`,
        secondaryColor: `hsl(${secondHue}, ${saturation}%, ${lightness}%)`,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex(secondHue, saturation, lightness)
    };
}



function HSLToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}



function displayColors(primaryColor, secondaryColor, primaryHex, secondaryHex) {
    const primaryColorBox = document.getElementById('primaryColor');
    const secondaryColorBox = document.getElementById('secondaryColor');
    primaryColorBox.style.backgroundColor = primaryColor;
    secondaryColorBox.style.backgroundColor = secondaryColor;
    document.getElementById('primaryHex').textContent = primaryHex;
    document.getElementById('secondaryHex').textContent = secondaryHex;
    primaryColorBox.style.color = setTextContrast(primaryHex);
    secondaryColorBox.style.color = setTextContrast(secondaryHex);

    // Set the primary color as a CSS variable
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}


function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

function getColorsForDate(date) {
    const colors = localStorage.getItem(date);
    return colors ? JSON.parse(colors) : null;
}

function changeDate(date) {
    let colors = getColorsForDate(date);
    if (!colors) {
        // Randomly select a color harmony
        const harmonySelector = Math.floor(pseudoRandom(generateSeed(date) + 3) * 3); // Generate a number between 0 and 2
        switch (harmonySelector) {
            case 0:
                colors = generateOppositeColorsForDate(date);
                break;
            case 1:
                colors = generateAnalogousColorsForDate(date);
                break;
            case 2:
                colors = generateTriadicColorsForDate(date);
                break;
            case 3:
                colors = generateSplitComplementaryColorsForDate(date);
                break;
            case 4:
                colors = generateTetradicColorsForDate(date);
                break;
            case 5:
                colors = generateSquareColorsForDate(date);
                break;
        }
        storeColorsForDate(date, colors);
    }
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    document.getElementById('datePicker').max = today;
    document.getElementById('datePicker').value = today;
    changeDate(today); // Initialize with stored or new colors for today
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Ensure the switch reflects the current theme
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('click', toggleTheme);
});

function copyToClipboard(hexId) {
    const hexCode = document.querySelector(hexId).textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
        
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
document.addEventListener('DOMContentLoaded', () => {
    // Other initialization code

    // Initialize Flatpickr with maxDate set to today
    flatpickr("#datePicker", {
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        defaultDate: new Date(), // Sets today's date as default
        maxDate: new Date(), // Prevents selection of future 
        disableMobile: true, // Disables the mobile-friendly version
        onChange: function(selectedDates, dateStr, instance) {
            changeDate(dateStr); // Updates the application based on the selected date
        }
    });
     document.querySelector("#datePicker").setAttribute("autocomplete", "nope");
});
document.addEventListener("DOMContentLoaded", function() {
  // Get the value of the CSS variable
  const rootStyle = getComputedStyle(document.documentElement);
  const themeColor = rootStyle.getPropertyValue('--primary-color').trim();

  // Check if a meta theme-color tag already exists
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');

  if(metaThemeColor) {
    // If it exists, just update its content
    metaThemeColor.setAttribute("content", themeColor);
  } else {
    // If it does not exist, create it and append to <head>
    metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute("name", "theme-color");
    metaThemeColor.setAttribute("content", themeColor);
    document.getElementsByTagName('head')[0].appendChild(metaThemeColor);
  }
});

