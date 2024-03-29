

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

function copyToClipboard(hexId, colorContext) {
	const hexCode = document.querySelector(hexId).textContent.replace('#', '');
	navigator.clipboard.writeText(hexCode).then(() => {
	  const alertBox = document.getElementById('customAlert');
	  const modalOverlay = document.getElementById('modalOverlay');
	  const color = document.getElementById(colorContext).style.backgroundColor;
	  alertBox.style.backgroundColor = `var(--bg-color, ${color})`;
	  alertBox.style.color = 'white';
	  alertBox.innerHTML = '<b>Copied!</b>'; // Set the alert message
	  alertBox.style.display = 'block';
	  modalOverlay.style.display = 'flex'; // Show the overlay
  
	  setTimeout(() => {
		alertBox.style.display = 'none';
		modalOverlay.style.display = 'none'; // Hide the overlay
	  }, 600);
	});
  }

function setTextContrast(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155 ? '#363636' : '#FFF'; // Adjust threshold as needed
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

function generateColorsForDate(date, harmony) {
    const seed = generateSeed(date);
    const baseHue = Math.floor(pseudoRandom(seed) * 360);
    const saturation = Math.floor(pseudoRandom(seed + 1) * 40) + 60; // Saturation between 60% and 100%
    const lightness = Math.floor(pseudoRandom(seed + 2) * 20) + 40; // Lightness between 40% and 60%
    let secondaryHue;

    switch (harmony) {
        case 0: // Opposite Harmony
            secondaryHue = (baseHue + 180) % 360;
            break;
        case 1: // Analogous Harmony
            secondaryHue = (baseHue + 30) % 360;
            break;
        case 2: // Triadic Harmony
            secondaryHue = (baseHue + 120) % 360;
            break;
        case 3: // Split-Complementary Harmony
            secondaryHue = (baseHue + 150) % 360;
            break;
        case 4: // Tetradic Harmony
            secondaryHue = (baseHue + 90) % 360; // For simplicity, using a fixed offset
            break;
        case 5: // Square Harmony
            secondaryHue = (baseHue + 90) % 360;
            break;
        default:
            secondaryHue = baseHue; // Fallback to the same hue
    }

    const primaryColor = `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
    const secondaryColor = `hsl(${secondaryHue}, ${saturation}%, ${lightness}%)`;

    return {
        primaryColor,
        secondaryColor,
        primaryHex: HSLToHex(baseHue, saturation, lightness),
        secondaryHex: HSLToHex(secondaryHue, saturation, lightness)
    };
}

function changeDate(date) {
    let colors = getColorsForDate(date);
    if (!colors) {
        // Randomly select a color harmony among the available ones (0 to 5)
        const harmonySelector = Math.floor(pseudoRandom(generateSeed(date) + 3) * 6); // Corrected to generate a number between 0 and 5
        colors = generateColorsForDate(date, harmonySelector);
        storeColorsForDate(date, colors);
    }
    displayColors(colors.primaryColor, colors.secondaryColor, colors.primaryHex, colors.secondaryHex);
    adjustCountdownVisibility(date);
}

function storeColorsForDate(date, colors) {
    localStorage.setItem(date, JSON.stringify(colors));
}

function getColorsForDate(date) {
    const colors = localStorage.getItem(date);
    return colors ? JSON.parse(colors) : null;
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
	const alertBox = document.getElementById('shareAlert');
	const modalOverlay = document.getElementById('modalOverlay2');
	alertBox.style.color = 'var(--text-color)'; // Set text color to white for contrast
	alertBox.innerHTML = '<b>Downloaded!</b>'; // Set the alert message
	alertBox.style.display = 'block';
	modalOverlay.style.display = 'flex'; // Show the overlay
  
	setTimeout(() => {
	  alertBox.style.display = 'none';
	  modalOverlay.style.display = 'none'; // Hide the overlay
	}, 600);
  }

function hexToHSL(H) {
    // Convert hex to RGB first
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
        r = parseInt(H[1] + H[1], 16);
        g = parseInt(H[2] + H[2], 16);
        b = parseInt(H[3] + H[3], 16);
    } else if (H.length == 7) {
        r = parseInt(H[1] + H[2], 16);
        g = parseInt(H[3] + H[4], 16);
        b = parseInt(H[5] + H[6], 16);
    }
    r /= 255;
    g /= 255;
    b /= 255;

    // Then, HSL from RGB
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0)
        h = 0;
    else if (cmax == r)
        h = ((g - b) / delta) % 6;
    else if (cmax == g)
        h = (b - r) / delta + 2;
    else
        h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0)
        h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return {h, s, l};
}

const colorAdjectives = {
	'deep red': ['Blood', 'Wine', 'Cranberry'],
	'red': ['Crimson', 'Ruby', 'Scarlet'],
	'red-orange': ['Flame', 'Vermilion', 'Coral'],
	'orange-red': ['Sunset', 'Scarlet', 'Persimmon'],
	'bright orange': ['Tangerine', 'Marigold', 'Saffron'],
	'orange': ['Pumpkin', 'Apricot', 'Carrot'],
	'orange-yellow': ['Amber', 'Gold', 'Mustard'],
	'yellow-orange': ['Sunshine', 'Citrine', 'Mango'],
	'pale yellow': ['Lemonade', 'Buttercream', 'Daffodil'],
	'light yellow': ['Pastel', 'Canary', 'Sunflower'],
	'yellow-green': ['Lime', 'Chartreuse', 'Pear'],
	'lime green': ['Neon', 'Electric', 'Highlighter'],
	'green': ['Emerald', 'Forest', 'Jade'],
	'green-cyan': ['Mint', 'Seafoam', 'Pistachio'],
	'cyan-green': ['Turquoise', 'Aquamarine', 'Teal'],
	'light cyan': ['Sky', 'Ice', 'Powder'],
	'cyan': ['Teal', 'Cerulean', 'Capri'],
	'cyan-blue': ['Arctic', 'Sapphire', 'Peacock'],
	'sky blue': ['Azure', 'Daybreak', 'Celeste'],
	'deep sky blue': ['Cobalt', 'Ocean', 'Lapis'],
	'blue': ['Navy', 'Royal', 'Azure'],
	'dark blue': ['Midnight', 'Indigo', 'Prussian'],
	'indigo': ['Violet', 'Twilight', 'Ink'],
	'indigo-violet': ['Plum', 'Orchid', 'Mulberry'],
	'violet-indigo': ['Amethyst', 'Lavender', 'Wisteria'],
	'violet': ['Grape', 'Lilac', 'Fuchsia'],
	'deep violet': ['Purple', 'Eggplant', 'Majesty'],
	'violet-magenta': ['Mauve', 'Raspberry', 'Magenta'],
	'magenta': ['Fuchsia', 'Pink', 'Hot'],
	'magenta-pink': ['Rose', 'Cerise', 'Bubblegum'],
	'pink': ['Blush', 'Carnation', 'Flamingo'],
	'pink-red': ['Coral', 'Salmon', 'Peach'],
	'red-pink': ['Watermelon', 'Strawberry', 'Ruby'],
	'neutral': ['Slate', 'Taupe', 'Charcoal']
  };

  const colorEmotions = {
	'deep red': ['Passionate', 'Intense', 'Dramatic', 'Bold', 'Powerful', 'Provocative', 'Daring', 'Sensual'],
	'red': ['Energetic', 'Cool', 'Vibrant', 'Ambitious', 'Confident', 'Strong', 'Courageous', 'Motivated'],
	'red-orange': ['Adventurous', 'Ironic', 'Dynamic', 'Spontaneous', 'Innovative', 'Youthful', 'Eager', 'Brave'],
	'orange-red': ['Exciting', 'Lively', 'Fiery', 'Bold', 'Determined', 'Enthusiastic', 'Impulsive', 'Warmhearted'],
	'bright orange': ['Cheerful', 'Friendly', 'Inviting', 'Sociable', 'Enthusiastic', 'Exuberant', 'Gregarious', 'Affable'],
	'orange': ['Playful', 'Cozy', 'Welcoming', 'Comforting', 'Festive', 'Genial', 'Jovial', 'Amiable'],
	'orange-yellow': ['Optimistic', 'Sunny', 'Falling', 'Positive', 'Hopeful', 'Radiant', 'Ebullient', 'Lighthearted'],
	'yellow-orange': ['Joyful', 'Energetic', 'Vibrant', 'Zesty', 'Sparkling', 'Vivid', 'Sprightly', 'Effervescent'],
	'pale yellow': ['Soft', 'Soothing', 'Delicate', 'Gentle', 'Tender', 'Tranquil', 'Mellow', 'Subtle'],
	'light yellow': ['Earthy', 'Airy', 'Fresh', 'Wholesome', 'Rejuvenating', 'Nourishing', 'Revitalizing', 'Pristine'],
	'yellow-green': ['Zesty', 'Lively', 'Refreshing', 'Vigorous', 'Spry', 'Peppy', 'Bouncy', 'Vital'],
	'lime green': ['Vivid', 'Sharp', 'Luminous', 'Radiant', 'Striking', 'Dazzling', 'Brilliant'],
	'green': ['Natural', 'Stable', 'Prosperous', 'Grounded', 'Harmonious', 'Thriving', 'Fertile', 'Abundant'],
	'green-cyan': ['Refreshing', 'Crisp', 'Minty', 'Invigorating', 'Pure', 'Clear', 'Brisk', 'Reviving'],
	'cyan-green': ['Soothing', 'Cool', 'Serene', 'Tranquil', 'Mild', 'Placid', 'Restful', 'Pacifying'],
	'light cyan': ['Peaceful', 'Airy', 'Light', 'Serene', 'Ethereal', 'Delicate', 'Tranquil', 'Luminous'],
	'cyan': ['Calm', 'Refreshing', 'Bright', 'Clear', 'Lucid', 'Tranquil', 'Soothing', 'Pristine'],
	'cyan-blue': ['Dreamy', 'Exalted', 'Majestic', 'Ethereal', 'Lofty', 'Serene', 'Noble', 'Elevated'],
	'sky blue': ['Hopeful', 'Tranquil', 'Open', 'Expansive', 'Liberating', 'Boundless', 'Serene', 'Peaceful'],
	'deep sky blue': ['Awesome', 'Expansive', 'Inspiring', 'Limitless', 'Majestic', 'Elevating', 'Breathtaking', 'Vast'],
	'blue': ['Trustworthy', 'Dependable', 'Steady', 'Loyal', 'Committed', 'Reliable', 'Faithful', 'True'],
	'dark blue': ['Sophisticated', 'Powerful', 'Mysterious', 'Elegant', 'Noble', 'Dignified', 'Stately', 'Refined'],
	'indigo': ['Intuitive', 'Perceptive', 'Deep', 'Thoughtful', 'Philosophical', 'Insightful', 'Reflective', 'Contemplative'],
	'indigo-violet': ['Mystical', 'Magical', 'Enigmatic', 'Spiritual', 'Transcendent', 'Otherworldly', 'Mysterious', 'Esoteric'],
	'violet-indigo': ['Creative', 'Imaginative', 'Inspirational', 'Innovative', 'Visionary', 'Artistic', 'Inventive', 'Original'],
	'violet': ['Royal', 'Luxurious', 'Noble', 'Elegant', 'Sophisticated', 'Regal', 'Majestic', 'Prestigious'],
	'deep violet': ['Dramatic', 'Profound', 'Exquisite', 'Intense', 'Enriching', 'Soulful', 'Passionate', 'Captivating'],
	'violet-magenta': ['Charming', 'Enchanting', 'Fascinating', 'Alluring', 'Captivating', 'Beguiling', 'Enticing', 'Mesmerizing'],
	'magenta': ['Vibrant', 'Bold', 'Exciting', 'Daring', 'Vivid', 'Expressive', 'Flamboyant', 'Dynamic'],
	'magenta-pink': ['Playful', 'Loving', 'Fun', 'Affectionate', 'Warm', 'Caring', 'Joyous', 'Heartfelt'],
	'pink': ['Gracious', 'Romantic', 'Gentle', 'Tender', 'Affectionate', 'Delicate', 'Feminine', 'Sweet'],
	'pink-red': ['Calm', 'Tender', 'Soft', 'Warm', 'Gentle', 'Compassionate', 'Understanding', 'Soothing'],
	'red-pink': ['Lively', 'Passionate', 'Energetic', 'Vibrant', 'Fiery', 'Intense', 'Zealous', 'Heated'],
	'neutral': ['Balanced', 'Neutral', 'Versatile', 'Flexible', 'Adaptable', 'Unbiased', 'Impartial', 'Equitable']
};

  
  
  function generateColorName(h, s, l) {

	let colorRange;
	if ((h >= 346 && h <= 360) || (h >= 0 && h <= 10)) {
	  colorRange = 'deep red';
	} else if (h >= 11 && h <= 15) {
	  colorRange = 'red';
	} else if (h >= 16 && h <= 22) {
	  colorRange = 'red-orange';
	} else if (h >= 23 && h <= 30) {
	  colorRange = 'orange-red';
	} else if (h >= 31 && h <= 38) {
	  colorRange = 'bright orange';
	} else if (h >= 39 && h <= 45) {
	  colorRange = 'orange';
	} else if (h >= 46 && h <= 52) {
	  colorRange = 'orange-yellow';
	} else if (h >= 53 && h <= 60) {
	  colorRange = 'yellow-orange';
	} else if (h >= 61 && h <= 67) {
	  colorRange = 'pale yellow';
	} else if (h >= 68 && h <= 70) {
	  colorRange = 'light yellow';
	} else if (h >= 71 && h <= 79) {
	  colorRange = 'yellow-green';
	} else if (h >= 80 && h <= 110) {
	  colorRange = 'lime green';
	} else if (h >= 111 && h <= 140) {
	  colorRange = 'green';
	} else if (h >= 141 && h <= 150) {
	  colorRange = 'green-cyan';
	} else if (h >= 151 && h <= 163) {
	  colorRange = 'cyan-green';
	} else if (h >= 164 && h <= 173) {
	  colorRange = 'light cyan';
	} else if (h >= 174 && h <= 193) {
	  colorRange = 'cyan';
	} else if (h >= 194 && h <= 205) {
	  colorRange = 'cyan-blue';
	} else if (h >= 206 && h <= 215) {
	  colorRange = 'sky blue';
	} else if (h >= 216 && h <= 220) {
	  colorRange = 'deep sky blue';
	} else if (h >= 221 && h <= 240) {
	  colorRange = 'blue';
	} else if (h >= 241 && h <= 250) {
	  colorRange = 'dark blue';
	} else if (h >= 251 && h <= 260) {
	  colorRange = 'indigo';
	} else if (h >= 261 && h <= 270) {
	  colorRange = 'indigo-violet';
	} else if (h >= 271 && h <= 275) {
	  colorRange = 'violet-indigo';
	} else if (h >= 276 && h <= 285) {
	  colorRange = 'violet';
	} else if (h >= 286 && h <= 290) {
	  colorRange = 'deep violet';
	} else if (h >= 291 && h <= 295) {
	  colorRange = 'violet-magenta';
	} else if (h >= 296 && h <= 305) {
	  colorRange = 'magenta';
	} else if (h >= 306 && h <= 310) {
	  colorRange = 'magenta-pink';
	} else if (h >= 311 && h <= 327) {
	  colorRange = 'pink';
	} else if (h >= 328 && h <= 337) {
	  colorRange = 'pink-red';
	} else if (h >= 338 && h <= 345) {
	  colorRange = 'red-pink';
	} else {
	  colorRange = 'neutral';
	}
	
const adjectives = colorAdjectives[colorRange];
  const emotions = colorEmotions[colorRange];
  
  const seed = `${h},${s},${l}`;
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const index1 = Math.abs(hash % adjectives.length);
  const index2 = Math.abs((hash + 1) % emotions.length); // Slightly alter the hash for a different index
  
  const colorName1 = adjectives[index1];
  const colorName2 = emotions[index2];
  
  return `${colorName2}<br>${colorName1}`;

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

    // Assuming HSL values are used for primary and secondary colors
    const primaryHSL = hexToHSL(primaryHex);
    const secondaryHSL = hexToHSL(secondaryHex);

    // Generate color names
    const primaryColorName = generateColorName(primaryHSL.h, primaryHSL.s, primaryHSL.l);
    const secondaryColorName = generateColorName(secondaryHSL.h, secondaryHSL.s, secondaryHSL.l);

    // Update the UI with the color names
	primaryColorBox.querySelector('.colorName').innerHTML = primaryColorName;
	secondaryColorBox.querySelector('.colorName').innerHTML = secondaryColorName;	
	document.documentElement.style.setProperty('--primary-color', primaryColor);
	document.documentElement.style.setProperty('--secondary-color', secondaryColor);
}