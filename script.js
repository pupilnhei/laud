// Initialize everything when the page loads
window.onload = function() {
    setupCountdown();
    
    // Update names if needed
    if (document.querySelector('#leftName')) {
        document.getElementById('leftName').textContent = "Sanma";
    }
    if (document.querySelector('#rightName')) {
        document.getElementById('rightName').textContent = "Rahul";
    }
};

// Countdown timer to wedding day
function setupCountdown() {
    // Set the wedding date - April 27, 2025
    const weddingDate = new Date("April 27, 2025 10:00:00").getTime();
    
    // Update the countdown every second
    const countdownTimer = setInterval(function() {
        // Get today's date and time
        const now = new Date().getTime();
        
        // Find the distance between now and the wedding date
        const distance = weddingDate - now;
        
        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Display the countdown if element exists
        const countdownElement = document.getElementById("countdown");
        if (countdownElement) {
            countdownElement.innerHTML = `
                <div class="countdown-item">
                    <span class="countdown-number">${days}</span>
                    <span class="countdown-label">Days</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${hours}</span>
                    <span class="countdown-label">Hrs</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${minutes}</span>
                    <span class="countdown-label">Mins</span>
                </div>
                <div class="countdown-item">
                    <span class="countdown-number">${seconds}</span>
                    <span class="countdown-label">Secs</span>
                </div>
            `;
        }
        
        // If the countdown is over
        if (distance < 0) {
            clearInterval(countdownTimer);
            if (countdownElement) {
                countdownElement.innerHTML = "<div class='text-xl script-font'>Our Wedding Day Has Arrived!</div>";
            }
        }
    }, 1000);
}

// Photo sharing with Google Drive
function showPhotoOptions() {
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('flex');
    
    // Reset any preview if it exists
    const preview = document.getElementById('preview');
    if (preview) {
        preview.classList.add('hidden');
    }
    
    const previewControls = document.getElementById('previewControls');
    if (previewControls) {
        previewControls.classList.add('hidden');
    }
}

function takePhoto() {
    // For mobile devices, access camera if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        alert("Opening camera. Please allow camera access if prompted. (This is a simulation - in the real version, this would access your camera)");
        // Actual camera implementation would go here
        // For now, just show a simulated photo
        const preview = document.getElementById('preview');
        if (preview) {
            preview.src = "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
            preview.classList.remove('hidden');
            
            const previewControls = document.getElementById('previewControls');
            if (previewControls) {
                previewControls.classList.remove('hidden');
            }
        }
    } else {
        alert("Camera access not available on this device. Redirecting to Google Drive upload.");
        uploadToGoogleDrive();
    }
}

function uploadToGoogleDrive() {
    // Google Drive folder for wedding photos
    // Replace this URL with your actual Google Drive folder link
    const googleDriveLink = "https://drive.google.com/drive/folders/1eZTo3jd3sT_xNnaq1aA0TUa-f-L05EMG";
    
    // Open Google Drive in a new tab
    window.open(googleDriveLink, '_blank');
    
    // Optional: Show a confirmation message
    showNotification("Opening Google Drive folder where you can upload your photos. Thank you for sharing your moments!");
}

// Simple file upload handler for testing
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                // For demo purposes, just show a preview of the first file
                const file = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const preview = document.getElementById('preview');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.classList.remove('hidden');
                    }
                    
                    const previewControls = document.getElementById('previewControls');
                    if (previewControls) {
                        previewControls.classList.remove('hidden');
                    }
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
});

function uploadCapturedPhoto() {
    // In a real implementation, this would upload the photo to your storage
    alert("Thank you for sharing your wedding photo! In the real version, this would upload your photo to our collection.");
    closePhotoModal();
    
    // Show success notification
    showNotification("Photo shared successfully! Thanks for contributing to our wedding memories.");
}

// Add to Calendar functionality
function addToCalendar(eventTitle, eventDate, eventTime, venue) {
    const startDateTime = new Date(eventDate + ' ' + eventTime);
    const endDateTime = new Date(startDateTime.getTime() + 3600000); // Add 1 hour for event duration

    const googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(eventTitle) +
        '&dates=' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '/' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '&details=' + encodeURIComponent('Wedding Event in Uttarakhand') +
        '&location=' + encodeURIComponent(venue) +
        '&sf=true&output=xml';

    window.open(googleCalendarUrl, '_blank');
    
    // Show confirmation
    showNotification("Event added to your calendar!");
}

// Open Google Maps directions
function openDirections() {
    window.open('https://www.google.com/maps/search/?api=1&query=Nimbuchar+Kotdwar+Uttarakhand', '_blank');
}

// Live stream function
function openLiveStream() {
    alert("Get ready to join our wedding virtually! The livestream link will be available closer to the wedding date.");
}

// Notification system
function showNotification(message, type = 'success') {
    // Create container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container fixed top-4 right-4 z-50 flex flex-col items-end';
        document.body.appendChild(container);
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `bg-white rounded shadow-md p-4 mb-2 transform translate-x-full transition-transform duration-300 ${type === 'error' ? 'border-l-4 border-red-500' : 'border-l-4 border-green-600'}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2 text-${type === 'error' ? 'red' : 'green'}-600">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
            </span>
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 4000);
}

// Animation for event cards
document.addEventListener('DOMContentLoaded', function() {
    // Animate event cards when they come into view
    const eventCards = document.querySelectorAll('.event-card');
    if (!('IntersectionObserver' in window)) {
        // Fallback for browsers that don't support IntersectionObserver
        eventCards.forEach(card => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500);
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    eventCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});