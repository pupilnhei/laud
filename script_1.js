// Splash screen
setTimeout(() => {
    document.getElementById('splash').style.opacity = 0;
    setTimeout(() => {
        document.getElementById('splash').style.display = 'none';
        // Show the navbar
        const navbar = document.querySelector('.navbar');
        navbar.style.opacity = 1;
        navbar.style.pointerEvents = 'auto';
    }, 1000);
}, 5000);

/*loading overlay*/

function showLoading(message) {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.classList.add('loading-overlay');
    loadingOverlay.innerHTML = `
        <div>
            <div class="spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `;
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

//notification message

function showNotification(message, type = 'success') {
    const container = document.querySelector('.notification-container') || createNotificationContainer();
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Trigger reflow to ensure the animation works
    notification.offsetHeight;

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            if (container.children.length === 0) {
                container.remove();
            }
        }, 500);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    return container;
}

// Header carousel
const headerCarouselContainer = document.querySelector('.header-carousel-container');
const headerCarouselItems = headerCarouselContainer.querySelectorAll('.header-carousel-item');
let headerCurrentIndex = 0;

function updateHeaderCarousel() {
    headerCarouselContainer.style.transform = `translateX(-${headerCurrentIndex * 100}%)`;
    headerCarouselItems.forEach((item, index) => {
        item.classList.toggle('active', index === headerCurrentIndex);
    });
}

function slideHeaderCarousel(direction) {
    headerCurrentIndex = (headerCurrentIndex + direction + headerCarouselItems.length) % headerCarouselItems.length;
    updateHeaderCarousel();
}

// Auto slide every 3 seconds
setInterval(() => slideHeaderCarousel(1), 3000);

// Initialize the carousel
updateHeaderCarousel();

// Accordion
function toggleAccordion(element) {
    const card = element.closest('.event-card');
    const content = card.querySelector('.accordion-content');
    content.classList.toggle('active');
}

// Add to Calendar
function addToCalendar(eventTitle, eventDate, eventTime, venue) {
    const startDateTime = new Date(eventDate + ' ' + eventTime);
    const endDateTime = new Date(startDateTime.getTime() + 3600000); // Add 1 hour for event duration

    const ua = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isMac = /macintosh|mac os x/.test(ua);
    const isWindows = /win/.test(ua);

    if (isiOS) {
        addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue);
    } else if (isAndroid) {
        addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
    } else if (isMac) {
        // Offer choice between Apple Calendar and Google Calendar
        if (confirm('Do you want to add this event to Apple Calendar? Click OK for Apple Calendar or Cancel for Google Calendar.')) {
            addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue);
        } else {
            addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
        }
    } else if (isWindows) {
        // Offer choice between Outlook and Google Calendar
        if (confirm('Do you want to add this event to Outlook? Click OK for Outlook or Cancel for Google Calendar.')) {
            addToOutlookCalendar(eventTitle, startDateTime, endDateTime, venue);
        } else {
            addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
        }
    } else {
        // Default to Google Calendar for unknown devices
        addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue);
    }
}

function addToGoogleCalendar(eventTitle, startDateTime, endDateTime, venue) {
    const googleCalendarUrl = 'https://www.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent(eventTitle) +
        '&dates=' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '/' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') +
        '&details=' + encodeURIComponent('Wedding Event') +
        '&location=' + encodeURIComponent(venue) +
        '&sf=true&output=xml';

    window.open(googleCalendarUrl, '_blank');
}

function addToAppleCalendar(eventTitle, startDateTime, endDateTime, venue) {
    const appleCalendarUrl = 'data:text/calendar;charset=utf-8,' +
        encodeURIComponent('BEGIN:VCALENDAR\n' +
            'VERSION:2.0\n' +
            'BEGIN:VEVENT\n' +
            'URL:' + document.URL + '\n' +
            'DTSTART:' + startDateTime.toISOString().replace(/-|:|\.\d+/g, '') + '\n' +
            'DTEND:' + endDateTime.toISOString().replace(/-|:|\.\d+/g, '') + '\n' +
            'SUMMARY:' + eventTitle + '\n' +
            'DESCRIPTION:Wedding Event\n' +
            'LOCATION:' + venue + '\n' +
            'END:VEVENT\n' +
            'END:VCALENDAR');

    window.open(appleCalendarUrl);
}

function addToOutlookCalendar(eventTitle, startDateTime, endDateTime, venue) {
    window.open('https://outlook.office.com/owa/?path=/calendar/action/compose&rru=addevent&' +
        'subject=' + encodeURIComponent(eventTitle) +
        '&startdt=' + startDateTime.toISOString() +
        '&enddt=' + endDateTime.toISOString() +
        '&body=' + encodeURIComponent('Wedding Event') +
        '&location=' + encodeURIComponent(venue));
}

// Open Google Maps directions
function openDirections() {
    window.open('https://www.google.com/maps/dir//C69Q%2B8C6,+Hyderabad,+Telangana+500075/@17.4182657,78.1561133,12z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bcbed2a7cc0cab7:0x360464462999551a!2m2!1d78.2385151!2d17.4182826?entry=ttu&g_ep=EgoyMDI0MDkyMy4wIKXMDSoASAFQAw%3D%3D', '_blank');
}

// Scroll animation
const eventCards = document.querySelectorAll('.event-card');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

eventCards.forEach(card => {
    observer.observe(card);
});

// Location carousel
const locationCarousel = document.querySelector('.location-carousel');
const locationImages = locationCarousel.querySelectorAll('img');
let currentLocationImage = 0;

function showNextLocationImage() {
    locationImages[currentLocationImage].classList.remove('active');
    currentLocationImage = (currentLocationImage + 1) % locationImages.length;
    locationImages[currentLocationImage].classList.add('active');
}

setInterval(showNextLocationImage, 3000);

function animateCards() {
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 500); // Stagger the animations
    });
}

// Run animation when content is loaded
document.addEventListener('DOMContentLoaded', animateCards);

// Animated text in navbar
document.addEventListener('DOMContentLoaded', function () {
    const text = "#nvr 8 to ∞";
    const container = document.getElementById('animatedText');

    text.split('').forEach((char, index) => {
        if (char === ' ') {
            // Add a space to the container
            container.appendChild(document.createTextNode(' '));
        } else {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${index * 0.1}s`;

            if (char === 'v') {
                span.classList.add('animated-v');
            }

            container.appendChild(span);
        }
    });
});

const leftName = document.getElementById('leftName');
const rightName = document.getElementById('rightName');

window.addEventListener('scroll', function () {
    const scrollPosition = window.scrollY;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.64; // 70vh

    if (scrollPosition > threshold) {
        leftName.classList.add('visible');
        rightName.classList.add('visible');
    } else {
        leftName.classList.remove('visible');
        rightName.classList.remove('visible');
    }
});



// Falling lights animation
const maxLights = 50;
let currentLights = 0;

function createLight() {
    if (currentLights >= maxLights) return;

    const light = document.createElement('div');
    light.classList.add('light');
    light.style.left = Math.random() * 100 + 'vw';
    light.style.top = '-10vh';
    light.style.animationDuration = Math.random() * 3 + 2 + 's';
    light.style.width = light.style.height = Math.random() * 4 + 2 + 'px';
    document.getElementById('lights-container').appendChild(light);
    currentLights++;

    light.addEventListener('animationend', () => {
        light.remove();
        currentLights--;
        setTimeout(createLight, Math.random() * 1000);
    });
}

function initializeLights() {
    for (let i = 0; i < maxLights; i++) {
        setTimeout(createLight, Math.random() * 3000);
    }
}

// Falling flowers animation
const flowers = ['🌸', '🌺', '🌼', '🌻', '🌹'];
const maxFlowers = 10;
let currentFlowers = 0;

function createFlower() {
    if (currentFlowers >= maxFlowers) return;

    const flower = document.createElement('div');
    flower.classList.add('flower');
    flower.style.left = `${Math.random() * 100}vw`;
    flower.style.animationDuration = `${Math.random() * 3 + 5}s`;
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    document.getElementById('flowers-container').appendChild(flower);
    currentFlowers++;

    flower.addEventListener('animationend', () => {
        flower.remove();
        currentFlowers--;
        setTimeout(createFlower, Math.random() * 1000);
    });
}

function initializeFlowers() {
    for (let i = 0; i < maxFlowers; i++) {
        setTimeout(createFlower, Math.random() * 3000);
    }
}

// Photo sharing and live stream placeholders
function openPhotoSharing() {
    alert("We're excited to see your pictures! We'll provide details on how to share your photos closer to the wedding date. Stay tuned!");
}

function openLiveStream() {
    alert("Get ready to join us virtually! Redirecting you to our live stream.");
    window.open("https://inkalive.in/vidhathriandnikhileshbabu", "_blank");
}
function openWeddingLiveStream() {
    alert("Get ready to join us virtually! We'll share the live stream details as we get closer to the big day. Stay tuned for updates!");
    // window.open("https://inkalive.in/vidhathriandnikhileshbabu", "_blank");
}

// Initialize animations on window load
window.addEventListener('load', () => {
    initializeLights();
    initializeFlowers();
});

// Typing animation
// Typing animation
function typeWriter(text, i, fnCallback) {
    if (i < text.length) {
        document.getElementById("typing-text").innerHTML = text.substring(0, i + 1) + '<span class="blinking-cursor">|</span>';

        setTimeout(function () {
            typeWriter(text, i + 1, fnCallback)
        }, 100);
    } else if (typeof fnCallback == 'function') {
        // Remove the blinking cursor
        document.getElementById("typing-text").innerHTML = text;
        setTimeout(fnCallback, 700);
    }
}

// Fade in animation
function fadeIn(element, duration, callback) {
    element.style.opacity = 0;
    element.style.display = 'block';
    let opacity = 0;
    const interval = 50;
    const gap = interval / duration;

    function increaseOpacity() {
        opacity += gap;
        element.style.opacity = Math.min(opacity, 1);
        if (opacity < 1) {
            requestAnimationFrame(increaseOpacity);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(increaseOpacity);
}

// Start the animations
function startAnimations() {
    let typingText = "And we are 8 to ∞";
    typeWriter(typingText, 0, function () {
        // Typing animation is complete, start the fade-in of main content
        const mainContent = document.getElementById("main-content");
        fadeIn(mainContent, 1000, function () {
            // After fade-in, trigger any CSS animations
            const heroText = document.querySelector('.hero-text');
            const tagAnimation = document.querySelector('.tag-animation');

            if (heroText) heroText.style.animation = 'yourHeroTextAnimation 1s forwards';
            if (tagAnimation) tagAnimation.style.animation = 'yourTagAnimation 1s forwards';
        });
    });
}

// Call the function when the page loads
window.onload = function () {
    startAnimations();
};

// ... existing code ...

function showPhotoOptions() {
    document.getElementById('photoModal').classList.remove('hidden');
    document.getElementById('photoModal').classList.add('flex');
}

function closePhotoModal() {
    document.getElementById('photoModal').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('flex');
}

let capturedImage = null;

function takePhoto() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function (stream) {
            const video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
            document.getElementById('cameraView').classList.remove('hidden');
            document.getElementById('photoModal').classList.add('hidden');

            document.getElementById('captureBtn').onclick = function () {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                capturedImage = canvas.toDataURL('image/jpeg');
                showPreview();
            };
        })
        .catch(function (err) {
            console.error("Error accessing the camera", err);
            displayMessage("Error accessing the camera. Please try again or use the upload option.");
        });
}


function showPreview() {
    const preview = document.getElementById('preview');
    preview.src = capturedImage;
    document.getElementById('cameraView').classList.add('hidden');
    document.getElementById('previewView').classList.remove('hidden');
}

function retakePhoto() {
    document.getElementById('previewView').classList.add('hidden');
    document.getElementById('cameraView').classList.remove('hidden');
}


function uploadCapturedPhoto() {
    if (capturedImage) {
        showLoading('Uploading your photo...');
        sendToGoogleDrive(capturedImage)
            .then(() => {
                hideLoading();
                showNotification('Thank you for sharing your moment! 1 photo has been sent to our wedding album.', 'success');
                closePreviewView();
            })
            .catch((error) => {
                console.error('Error:', error);
                hideLoading();
                showNotification('There was an error uploading your photo. Please try again.', 'error');
            });
    } else {
        showNotification('No photo captured. Please take a photo first.', 'error');
    }
}

function closePreviewView() {
    document.getElementById('previewView').classList.add('hidden');
    closeCameraView();
}

function closeCameraView() {
    const video = document.getElementById('video');
    const stream = video.srcObject;
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    }
    document.getElementById('cameraView').classList.add('hidden');
    document.getElementById('photoModal').classList.remove('hidden');
}

function uploadPhotos() {
    document.getElementById('fileInput').click();
}

document.getElementById('fileInput').addEventListener('change', function (event) {
    const files = event.target.files;
    if (files.length > 0) {
        showLoading('Uploading your photos...');
        let uploadedCount = 0;
        const totalFiles = files.length;

        const uploadPromises = Array.from(files).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    sendToGoogleDrive(e.target.result)
                        .then(() => {
                            uploadedCount++;
                            resolve();
                        })
                        .catch(error => {
                            console.error('Error uploading file:', error);
                            reject(error);
                        });
                };
                reader.onerror = function (error) {
                    console.error('Error reading file:', error);
                    reject(error);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(uploadPromises)
            .then(() => {
                hideLoading();
                const message = uploadedCount === 1
                    ? 'Thank you for sharing your moment! 1 photo has been sent to our wedding album.'
                    : `Thank you for sharing your moments! ${uploadedCount} photos have been sent to our wedding album.`;
                showNotification(message, 'success');
            })
            .catch((error) => {
                console.error('Error:', error);
                hideLoading();
                const failedUploads = totalFiles - uploadedCount;
                const message = failedUploads === totalFiles
                    ? 'There was an error uploading your photos. Please try again.'
                    : `${uploadedCount} photos were uploaded successfully, but ${failedUploads} failed. Please try uploading the failed photos again.`;
                showNotification(message, 'error');
            });
    }
    closePhotoModal();
});

function sendToGoogleDrive(imageData) {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('photo', dataURItoBlob(imageData), 'photo.jpg');

        const RENDER_API_URL = 'https://wedding-invite-backend.onrender.com/upload';

        fetch(RENDER_API_URL, {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(result => {
                console.log('Success:', result);
                resolve(result);
            })
            .catch(error => {
                console.error('Error:', error);
                reject(error);
            });
    });
}


function displayMessage(message) {
    hideLoading(); // Ensure loading is hidden when displaying a message
    const resultDiv = document.getElementById('uploadResult');
    resultDiv.textContent = message;
    resultDiv.style.display = 'block';

    setTimeout(() => {
        resultDiv.style.display = 'none';
    }, 5000);
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}




