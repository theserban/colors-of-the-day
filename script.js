// This function remains unchanged
function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000' : '#FFF';
}

// Updated to incorporate dynamic color harmonies based on date
function generateColorHarmoniesForDate(dateString) {
    // Convert dateString to a hash for consistent base hue generation
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
        let char = dateString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    let baseHue = Math.abs(hash) % 360;

    // Use baseHue to generate color harmonies
    const harmonyTypes = ['analogous', 'complementary', 'triadic', 'tetradic'];
    const selectedType = harmonyTypes[Math.abs(hash) % harmonyTypes.length];
    let colors;
    switch (selectedType) {
        case 'analogous':
            colors = [baseHue, (baseHue + 30) % 360, (baseHue + 60) % 360];
            break;
        case 'complementary':
            colors = [baseHue, (baseHue + 180) % 360];
            break;
        case 'triadic':
            colors = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
            break;
        case 'tetradic':
            colors = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
            break;
    }

    const primaryColor = `hsl(${colors[0]}, 100%, 50%)`;
    const secondaryColor = `hsl(${colors[1]}, 100%, 50%)`;
    const primaryHex = HSLToHex(colors[0], 100, 50);
    const secondaryHex = HSLToHex(colors[1], 100, 50);

    return { primaryColor, secondaryColor, primaryHex, secondaryHex };
}

// Updated to use generateColorHarmoniesForDate with date-based logic
function generateColorsForUTCDate() {
    const todayUTC = new Date(Date.now());
    todayUTC.setMinutes(todayUTC.getMinutes() + todayUTC.getTimezoneOffset()); // Convert to UTC
    let dateString = todayUTC.toISOString().slice(0, 10).replace(/-/g, '');

    let colors = getColorsForDate(dateString);
    if (!colors) {
        colors = generateColorHarmoniesForDate(dateString);
        storeColorsForDate(dateString, colors);
    }
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
}

// This function remains unchanged
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

// This function remains unchanged
function displayColors(primaryColor, secondaryColor, primaryHex, secondaryHex) {
    // Implementation remains the same
}

// This function remains unchanged
function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

// This function remains unchanged
function getColorsForDate(date) {
    return JSON.parse(localStorage.getItem(date));
}

// Updated to use generateColorHarmoniesForDate with selected date logic
function changeDate(selectedDateString) {
    const selectedDate = new Date(selectedDateString);
    selectedDate.setMinutes(selectedDate.getMinutes() + selectedDate.getTimezoneOffset());
    let dateString = selectedDate.toISOString().slice(0, 10).replace(/-/g, '');

    let colors = getColorsForDate(dateString);
    if (!colors) {
        colors = generateColorHarmoniesForDate(dateString);
        storeColorsForDate(dateString, colors);
    }
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
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
}

function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

function getColorsForDate(date) {
    const colors = localStorage.getItem(date);
    return colors ? JSON.parse(colors) : null;
}


document.getElementById('datePicker').addEventListener('change', function() {
    changeDate(this.value);
});

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    document.getElementById('datePicker').max = today;
    document.getElementById('datePicker').value = today;
    const colors = generateColorsForUTCDate();
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
});

function copyToClipboard(hexId) {
    const hexCode = document.querySelector(hexId).textContent;
    navigator.clipboard.writeText(hexCode).then(() => {
        alert(hexCode + ' copied to clipboard!');
    }, (err) => {
        console.error('Could not copy text: ', err);
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

function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Initialize the first tab as active on load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.tablinks').click();
});