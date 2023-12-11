document.getElementById('generatePalette').addEventListener('click', function() {
    const selectedColor = document.getElementById('colorPicker').value;
    fetchColorPalette(selectedColor);
});

async function fetchColorPalette(hexColor) {
    const apiUrl = 'https://colour-web-service.onrender.com/generate-palette';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: hexColor.substring(1) })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayColorPalette(data);
        applyColorSchemeToMockup(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayColorPalette(colorData) {
    const paletteDisplay = document.getElementById('paletteDisplay');
    paletteDisplay.innerHTML = '';

    if (colorData.primary && typeof colorData.primary === 'object') {
        Object.values(colorData.primary).forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.className = 'color-box';
            colorBox.style.backgroundColor = color;
            paletteDisplay.appendChild(colorBox);
        });
    }
}


function applyColorSchemeToMockup(colorData) {
    const body = document.body;
    const mockupHeader = document.getElementById('mockupHeader');
    const mockupTitle = document.getElementById('mockupTitle');
    const mockupText = document.getElementById('mockupText');
    const mockupButton = document.getElementById('mockupButton');

    if (colorData.primary && typeof colorData.primary === 'object') {
        const colors = Object.values(colorData.primary);
        colors.sort((a, b) => getLuminance(b) - getLuminance(a)); // Sort colors by luminance

        body.style.backgroundColor = colors[0];

        body.style.color = colors.length > 1 ? colors[1] : '#333'; 


        mockupHeader.style.backgroundColor = colors[colors.length - 1]; 
        mockupHeader.style.color = getContrastYIQ(colors[colors.length - 1]);
        mockupTitle.style.color = colors.length > 2 ? colors[2] : '#333';
        mockupButton.style.backgroundColor = colors.length > 3 ? colors[3] : '#007bff';
        mockupButton.style.color = getContrastYIQ(colors.length > 3 ? colors[3] : '#007bff');
    }
}

function getLuminance(hex) {
    const rgb = hex.substring(1).match(/.{2}/g)
                .map(x => parseInt(x, 16) / 255)
                .map(x => x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]; 
}

function getContrastYIQ(hexColor){
    const r = parseInt(hexColor.substr(1,2), 16);
    const g = parseInt(hexColor.substr(3,2), 16);
    const b = parseInt(hexColor.substr(5,2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}


function updateColorPickerBox(color) {
    const colorPickerBox = document.getElementById('colorPickerBox');
    colorPickerBox.style.backgroundColor = color;
}


document.getElementById('paletteDisplay').addEventListener('click', function(event) {
    if (event.target.className === 'color-box') {
        const newBaseColor = event.target.style.backgroundColor;
        fetchColorPalette(newBaseColor);
        updateColorPickerBox(newBaseColor);
    }
});


document.getElementById('colorPicker').addEventListener('input', function() {
    updateColorPickerBox(this.value);
});