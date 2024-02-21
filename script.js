function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0,2), 16);
    const g = parseInt(hex.substr(2,2), 16);
    const b = parseInt(hex.substr(4,2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#000' : '#FFF'; // Adjust threshold as needed
}

function generateOppositeColors() {
    const baseHue = Math.floor(Math.random() * 360);
    const primaryColor = `hsl(${baseHue}, 100%, 50%)`;
    const secondaryColor = `hsl(${(baseHue + 180) % 360}, 100%, 50%)`;
    const primaryHex = HSLToHex(baseHue, 100, 50);
    const secondaryHex = HSLToHex((baseHue + 180) % 360, 100, 50);
    return { primaryColor, secondaryColor, primaryHex, secondaryHex };
}

function displayColors() {
    const { primaryColor, secondaryColor, primaryHex, secondaryHex } = generateOppositeColors();
    const primaryColorBox = document.getElementById('primaryColor');
    const secondaryColorBox = document.getElementById('secondaryColor');
    primaryColorBox.style.backgroundColor = primaryColor;
    secondaryColorBox.style.backgroundColor = secondaryColor;
    document.getElementById('primaryHex').textContent = primaryHex;
    document.getElementById('secondaryHex').textContent = secondaryHex;
    // Set text color based on background color brightness
    primaryColorBox.style.color = setTextContrast(primaryHex);
    secondaryColorBox.style.color = setTextContrast(secondaryHex);
}

// Convert HSL to Hex (helper function)
function HSLToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0'); // Convert to Hex and format
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString();
    document.getElementById('datePicker').max = today;
    document.getElementById('datePicker').value = today;
    let storedColors = getColorsForDate(today);
    if (!storedColors) {
        storedColors = generateOppositeColors();
        storeColorsForDate(today, storedColors);
    }
    displayColors(storedColors.primaryColor, storedColors.secondaryColor, storedColors.primaryHex, storedColors.secondaryHex);
});

function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

function getColorsForDate(date) {
    const colors = localStorage.getItem(date);
    return colors ? JSON.parse(colors) : null;
}

function changeDate(date) {
    const colors = getColorsForDate(date);
    if (colors) {
        displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
    } else {
        const newColors = generateOppositeColors();
        storeColorsForDate(date, newColors);
        displayColors(newColors.primaryColor, newColors.secondaryColor, newColors.primaryHex, newColors.secondaryHex);
    }
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

// Other functions (generateOppositeColors, setTextContrast, HSLToHex) remain unchanged

document.addEventListener('DOMContentLoaded', () => {
    const userLocale = navigator.language || 'default';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const today = new Date().toLocaleDateString(userLocale, options).replace(/\//g, '-');
    // Adjusting date format for input compatibility
    const formattedToday = today.split('-').reverse().join('-');

    document.addEventListener('DOMContentLoaded', () => {
    // Get today's date in the correct format
    const today = new Date().toISOString().split('T')[0];

    // Set the max attribute to today, preventing future dates from being selected
    document.getElementById('datePicker').max = today;

    // Setting today's date as the value if needed or any logic that runs on DOMContentLoaded
    document.getElementById('datePicker').value = today;
    changeDate(today); // Initialize colors for today based on the existing logic in your script
});

    changeDate(formattedToday); // Initialize colors for today
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
  localStorage.setItem('theme', newTheme); // Store theme preference
}

// Initialize theme on page load based on user's preference
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light theme
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
});
