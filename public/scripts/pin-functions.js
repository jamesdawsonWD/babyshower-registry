// pin-functionality.js

// Handle typing in a PIN input
function handlePinInput(event, currentIndex) {
    const input = event.target;
    const value = input.value;
  
    // Ensure only numbers are entered
    if (!/^\d*$/.test(value)) {
      input.value = "";
      return;
    }
  
    // Auto-focus the next input
    if (value.length === 1 && currentIndex < 6) {
      const nextInput = document.getElementById(`pin-${currentIndex + 1}`);
      if (nextInput) nextInput.focus();
    }
  
    // Auto-submit the form if all inputs are filled
    if (currentIndex === 6 && value.length === 1) {
      const form = input.closest("form");
      if (form) form.submit();
    }
  }
  
  // Handle pasting a PIN
  function handlePinPaste(event) {
    const pasteData = event.clipboardData.getData("text");
    const inputs = document.querySelectorAll('input[name="pin[]"]');
  
    // Only proceed if the pasted data is 6 digits
    if (/^\d{6}$/.test(pasteData)) {
      inputs.forEach((input, index) => {
        input.value = pasteData[index] || "";
      });
  
      // Focus the last input
      inputs[5].focus();
    }
  }
  
  // Rebind functionality after htmx swaps content
  document.addEventListener("htmx:afterSwap", () => {
    const inputs = document.querySelectorAll('input[name="pin[]"]');
    inputs.forEach((input, index) => {
      input.addEventListener("input", (event) => handlePinInput(event, index + 1));
      input.addEventListener("paste", handlePinPaste);
    });
  });
  