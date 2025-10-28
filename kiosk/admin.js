function updateValues() {
    // Retrieve the values from localStorage
    const badValue = localStorage.getItem('num_drops_0');
    const goodValue = localStorage.getItem('num_drops_1');
    const maxValue = localStorage.getItem('max_drops');

    // Get references to the text fields in the form
    const badTextField = document.getElementById('bad');
    const goodTextField = document.getElementById('good');
    const maxTextField = document.getElementById('max');

    // Populate the text fields with the retrieved values
    if (badValue) {
        badTextField.value = badValue;
    }

    if (goodValue) {
        goodTextField.value = goodValue;
    }

    if (maxValue) {
        maxTextField.value = maxValue;
    } 

    // Add an event listener to the button to trigger the updateValues function
    const saveButton = document.getElementById('save');
    saveButton.addEventListener('click', ()=>{
        // Get the current values from the text fields
        const badValue = document.getElementById('bad').value;
        const goodValue = document.getElementById('good').value;
        const maxValue = document.getElementById('max').value;
    
        // Save the values back to localStorage
        localStorage.setItem('num_drops_0', badValue);
        localStorage.setItem('num_drops_1', goodValue);
        localStorage.setItem('max_drops', maxValue);
    
        // Optional: Notify the user that the values have been saved
        alert('saved!');
        window.focus.blur();
    });

    const resetButton = document.getElementById('reset');
    resetButton.addEventListener('click', ()=>{
        
        // Save the values back to localStorage
        localStorage.setItem('num_drops_0', 0);
        localStorage.setItem('num_drops_1', 0);
        if (badValue) {
            badTextField.value = 0;
        }
    
        if (goodValue) {
            goodTextField.value = 0;
        }

    });

}

// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', updateValues);
window.onfocus = updateValues;