//rules pop-up code
$("#popupOverlay").fadeIn();

$("#closePopup").click(function () {
    $("#popupOverlay").fadeOut();
});

// Close popup when clicking outside the box
$("#popupOverlay").click(function (event) {
    if (!$(event.target).closest("#popupBox").length) {
        $("#popupOverlay").fadeOut();
    }
});

//count down code

function updateCountdown() {
    const eventDate = new Date('2025-03-01');
    const now = new Date();
    const difference = eventDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    updateCountdownDisplay('days', days);
    updateCountdownDisplay('hours', hours);
    updateCountdownDisplay('minutes', minutes);
    updateCountdownDisplay('seconds', seconds);
}

function updateCountdownDisplay(id, value) {
    const element = document.getElementById(id);
    const numberElement = element.querySelector('.countdown-number');
    const currentValue = numberElement.textContent;

    if (currentValue !== padZero(value)) {
        
        setTimeout(() => {
            numberElement.textContent = padZero(value);
            
        }, 500);
    }
}

function padZero(num) {
    return num.toString().padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);


