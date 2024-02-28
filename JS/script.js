function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#363636' : '#FFF'; // Adjust threshold as needed
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
	adjustCountdownVisibility(date);
}

document.addEventListener('DOMContentLoaded', () => {
	    // Adjust to use local date components
        const today = new Date();
        const localDateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
        
        document.getElementById('currentDate').textContent = today.toLocaleDateString();
        document.getElementById('datePicker').max = localDateStr;
        document.getElementById('datePicker').value = localDateStr;
        changeDate(localDateStr); // Initialize with stored or new colors for today
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        // Ensure the switch reflects the current theme
        const themeToggle = document.getElementById('themeToggle');
        themeToggle.checked = savedTheme === 'dark';
        themeToggle.addEventListener('click', toggleTheme);
});

function copyToClipboard(hexId, colorContext) {
	const hexCode = document.querySelector(hexId).textContent;
	navigator.clipboard.writeText(hexCode).then(() => {
		// Select the custom alert element
		const alertBox = document.getElementById('customAlert');
		// Get the color based on the color context
		const color = document.getElementById(colorContext).style.backgroundColor;
		// Set the custom alert's background color using CSS variables
		alertBox.style.backgroundColor = `var(--bg-color, ${color})`;
		// Set text color to white
		alertBox.style.color = 'white';
		// Show the custom alert
		alertBox.style.display = 'block';

		setTimeout(() => {
			alertBox.style.display = 'none';
		}, 2000);
	});
}


function startCountdown() {
	function updateCountdown() {
		const now = new Date();
		const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
		const msLeft = tomorrow - now; // Milliseconds until midnight

		const hours = Math.floor(msLeft / (1000 * 60 * 60));
		const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

		document.getElementById('countdown').textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;

		// Reset countdown at midnight (when there's no time left until tomorrow)
		if (msLeft <= 1000) {
			clearInterval(countdownInterval); // Stop the countdown
			changeDate(tomorrow.toISOString().split('T')[0]); // Update colors for the new day
		}
	}

	const countdownInterval = setInterval(updateCountdown, 1000); // Update countdown every second
	updateCountdown(); // Initialize countdown immediately
}

// Call this function when the page is loaded or when you want the countdown to start
document.addEventListener('DOMContentLoaded', startCountdown);

function updateCountdown() {
	const now = new Date();
	const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
	const msLeft = tomorrow - now; // Milliseconds until midnight

	const hours = Math.floor(msLeft / (1000 * 60 * 60));
	const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
	const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);

	document.getElementById('countdown').textContent = `Time left: ${hours}h ${minutes}m ${seconds}s`;

	// Check if it's time to update to a new day
	if (msLeft <= 1000) {
		clearInterval(countdownInterval); // Stop the countdown
		// Recalculate the date to ensure it's the next day
		const nextDay = new Date();
		nextDay.setDate(now.getDate() + 1); // Increment the day
		const localDateStr = nextDay.getFullYear() + '-' + (nextDay.getMonth() + 1).toString().padStart(2, '0') + '-' + nextDay.getDate().toString().padStart(2, '0');
		changeDate(localDateStr); // Update colors for the new day
	}
}

// Example usage within your countdown visibility function
function adjustCountdownVisibility(selectedDate) {
	const today = new Date();
	const currentDateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

	const countdownElement = document.getElementById('countdown');

	if (selectedDate === currentDateStr) {
		countdownElement.style.visibility = '';
		countdownElement.style.opacity = 1;
	} else {
		countdownElement.style.visibility = 'hidden';
		countdownElement.style.opacity = 0;
		countdownElement.style.transition = 'opacity 0.5s';
	}

}



// Adjust the initialization code for the date picker
document.addEventListener('DOMContentLoaded', () => {
	// Existing initialization code

	// Date picker change event listener
	document.getElementById('datePicker').addEventListener('change', function() {
		const selectedDate = this.value;
		changeDate(selectedDate); // Update the application based on the selected date
		adjustCountdownVisibility(selectedDate); // Show or hide the countdown based on the selected date
	});

	// Additional initialization code as needed
});
document.addEventListener('DOMContentLoaded', () => {
	const today = new Date();
	const localDateStr = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');

	// Set the initial visibility of the countdown based on the current date
	adjustCountdownVisibility(localDateStr);
});


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

function parseColorValues(colorValues) {
	var colorValuesArray = colorValues.match(/\b[0-9A-Fa-f]{3}\b|[0-9A-Fa-f]{6}\b/g);
	if (colorValuesArray) {
		colorValuesArray = colorValuesArray.map(
			function(item) {
				if (item.length === 3) {
					var newItem = item.toString().split('');
					newItem = newItem.reduce(function(acc, it) {
						return acc + it + it;
					}, '');
					return newItem;
				}
				return item;
			}
		);
	}
	return colorValuesArray; // this could be null if there are no matches
}

// Pad a hexadecimal string with zeros if it needs it
function pad(number, length) {
	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}
	return str;
}

// Convert a hex string into an object with red, green, blue numeric properties
// '501214' => { red: 80, green: 18, blue: 20 }
function hexToRGB(colorValue) {
	return {
		red: parseInt(colorValue.substr(0, 2), 16),
		green: parseInt(colorValue.substr(2, 2), 16),
		blue: parseInt(colorValue.substr(4, 2), 16)
	}
}

// Convert an integer to a 2-char hex string
// for sanity, round it and ensure it is between 0 and 255
// 43 => '2b'
function intToHex(rgbint) {
	return pad(Math.min(Math.max(Math.round(rgbint), 0), 255).toString(16), 2);
}

// Convert one of our rgb color objects to a full hex color string
// { red: 80, green: 18, blue: 20 } => '501214'
function rgbToHex(rgb) {
	return intToHex(rgb.red) + intToHex(rgb.green) + intToHex(rgb.blue);
}

// Shade one of our rgb color objects to a distance of i*10%
function rgbShade(rgb, i) {
	return {
		red: Math.max(0, Math.round(rgb.red * (1 - 0.1 * i))),
		green: Math.max(0, Math.round(rgb.green * (1 - 0.1 * i))),
		blue: Math.max(0, Math.round(rgb.blue * (1 - 0.1 * i)))
	};
}

// Tint one of our rgb color objects to a distance of i*10%
function rgbTint(rgb, i) {
	return {
		red: Math.min(255, Math.round(rgb.red + (255 - rgb.red) * i * 0.1)),
		green: Math.min(255, Math.round(rgb.green + (255 - rgb.green) * i * 0.1)),
		blue: Math.min(255, Math.round(rgb.blue + (255 - rgb.blue) * i * 0.1))
	};
}

// Calculate shades of a color in 10% increments
function calculateShades(colorValue) {
	const color = hexToRGB(colorValue);
	const shadeValues = [];

	for (let i = 1; i <= 10; i++) {
		shadeValues.push(rgbToHex(rgbShade(color, i)));
	}
	return shadeValues;
}

// Calculate tints of a color in 10% increments
function calculateTints(colorValue) {
	const color = hexToRGB(colorValue);
	const tintValues = [];

	for (let i = 1; i <= 10; i++) {
		tintValues.push(rgbToHex(rgbTint(color, i)));
	}
	return tintValues;
}

function shareColors() {
	const svgNS = "http://www.w3.org/2000/svg";
	const svg = document.createElementNS(svgNS, 'svg');
	svg.setAttribute('width', '2000');
	svg.setAttribute('height', '1600');

	const primaryHex = document.getElementById('primaryHex').textContent;
	const secondaryHex = document.getElementById('secondaryHex').textContent;
	const selectedDate = document.getElementById('datePicker').value;

	function drawRectWithText(x, y, width, height, fillColor, textColor, text) {
		const rect = document.createElementNS(svgNS, 'rect');
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
		rect.setAttribute('fill', fillColor);
		svg.appendChild(rect);

		const textElement = document.createElementNS(svgNS, 'text');
		textElement.setAttribute('x', x + width / 2);
		textElement.setAttribute('y', y + height / 2);
		textElement.setAttribute('text-anchor', 'middle');
		textElement.setAttribute('alignment-baseline', 'middle');
		textElement.setAttribute('fill', textColor);
		textElement.setAttribute('font-family', 'Lexend');
		textElement.setAttribute('font-weight', 'bold');
		textElement.setAttribute('font-size', '30px');

		textElement.textContent = text;
		svg.appendChild(textElement);
	}

	// Adjusted dimensions and positions
	const columnWidth = 1000;
	const rectWidth = columnWidth / 2;
	const rectHeight = (1600 / 10); //
	const tintsAndShadesHeight = (1600 - rectHeight) / 10;

	// Draw primary color rectangle
	drawRectWithText(0, 0, 1000, rectHeight, primaryHex, setTextContrast(primaryHex), primaryHex);

	// Draw secondary color rectangle 
	drawRectWithText(1000, 0, 1000, rectHeight, secondaryHex, setTextContrast(secondaryHex), secondaryHex);

	// Draw primary color tints and shades
	const primaryTints = calculateTints(primaryHex.substr(1));
	primaryTints.forEach((tint, index) => {
		drawRectWithText(0, rectHeight + index * tintsAndShadesHeight, rectWidth, tintsAndShadesHeight, '#' + tint, 'black', '#' + tint);
	});

	const primaryShades = calculateShades(primaryHex.substr(1));
	primaryShades.forEach((shade, index) => {
		drawRectWithText(rectWidth, rectHeight + index * tintsAndShadesHeight, rectWidth, tintsAndShadesHeight, '#' + shade, 'white', '#' + shade);
	});

	// Draw secondary color tints and shades
	const secondaryTints = calculateTints(secondaryHex.substr(1));
	secondaryTints.forEach((tint, index) => {
		drawRectWithText(columnWidth, rectHeight + index * tintsAndShadesHeight, rectWidth, tintsAndShadesHeight, '#' + tint, 'black', '#' + tint);
	});

	const secondaryShades = calculateShades(secondaryHex.substr(1));
	secondaryShades.forEach((shade, index) => {
		drawRectWithText(columnWidth + rectWidth, rectHeight + index * tintsAndShadesHeight, rectWidth, tintsAndShadesHeight, '#' + shade, 'white', '#' + shade);
	});

	const svgHeight = parseInt(svg.getAttribute('height'));
	svg.setAttribute('height', svgHeight + rectHeight + 'px');

	// Manually create and add the rectangle
	const rect = document.createElementNS(svgNS, 'rect');
	rect.setAttribute('x', 0);
	rect.setAttribute('y', svgHeight);
	rect.setAttribute('width', 2000);
	rect.setAttribute('height', rectHeight);
	rect.setAttribute('fill', '#ffffff');
	svg.appendChild(rect);

	// Manually create and add the text element with a larger font size
	const textElement = document.createElementNS(svgNS, 'text');
	textElement.setAttribute('x', 1000); // Center horizontally
	textElement.setAttribute('y', svgHeight + rectHeight / 2); // Vertically center in the rectangle
	textElement.setAttribute('text-anchor', 'middle');
	textElement.setAttribute('alignment-baseline', 'middle');
	textElement.setAttribute('fill', '#000000');
	textElement.setAttribute('font-family', 'Lexend');
	textElement.setAttribute('font-weight', 'bold');
	textElement.setAttribute('font-size', '40px'); // Increased font size
	textElement.textContent = 'Colors of the Day: ' + selectedDate + ' With <3 from Design Crony';
	svg.appendChild(textElement);

	// Parse the selectedDate string into a Date object
	const dateObj = new Date(selectedDate);


	const formattedDate = dateObj.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});


	textElement.textContent = `Colors of the Day: ${formattedDate} With <3 from Design Crony`;


	const svgData = new XMLSerializer().serializeToString(svg);
	const image = 'data:image/svg+xml;base64,' + btoa(svgData);

	const downloadLink = document.createElement('a');
	downloadLink.href = image;

	const safeFormattedDate = formattedDate.replace(/ /g, '');
	downloadLink.download = `ColorsoftheDay,${safeFormattedDate}.svg`; // Use backticks for template literals
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	setTimeout(() => {
		const alertBox = document.getElementById('shareAlert');

		// Example of dynamically setting the alert style based on primary color
		const primaryColor = document.getElementById('primaryHex').textContent;
		alertBox.style.color = '#FFFFFF'; // Set text color to white for contrast
		alertBox.style.display = 'block';

		// Hide the custom alert after 2 seconds
		setTimeout(() => {
			alertBox.style.display = 'none';
		}, 2000);
	});
}