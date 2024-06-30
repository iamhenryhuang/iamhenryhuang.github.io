// Get references to the form and elements
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');

// Attach the event listener to the form
newsletterForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Email submitted:', emailInput.value);
    // Add any additional logic or AJAX requests here if needed
});