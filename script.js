// grabbing elements from the page
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const progressBar = document.getElementById('progress-bar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

// scroll handler
// changes navbar style and updates progress bar

window.addEventListener('scroll', function() {

    const scrollY = window.scrollY;

    // add scrolled class after 60px - makes nav go solid
    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // calculate scroll progress as a percentage
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (scrollY / totalHeight) * 100;
    progressBar.style.width = progress + '%';

});

// active link tracking
// highlights the nav link for the section on screen

// using IntersectionObserver - fires when section enters viewport
const observer = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {

        if (entry.isIntersecting) {
            const id = entry.target.id;

            // remove active from all links first
            navLinks.forEach(function(link) {
                link.classList.remove('active');
            });

            // add active to the matching link
            navLinks.forEach(function(link) {
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }

    });

}, {
    // trigger when section is roughly in the middle of the screen
    rootMargin: '-40% 0px -55% 0px'
});

// observe all sections
sections.forEach(function(section) {
    observer.observe(section);
});

// hamburger menu toggle

hamburger.addEventListener('click', function() {

    const isOpen = hamburger.classList.contains('open');

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }

});

function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    // expand navbar height to show the drawer
    navbar.style.height = 'auto';
}

function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    navbar.style.height = '';
}

// close menu when a mobile link is clicked
mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        closeMenu();
    });
});

// close menu if window is resized to desktop
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});


// fade in sections on scroll

// add fade-in class to all section content divs
const fadeElements = document.querySelectorAll('.section-content');

fadeElements.forEach(function(el) {
    el.classList.add('fade-in');
});

// observer to trigger the animation
const fadeObserver = new IntersectionObserver(function(entries) {

    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // stop watching once it's shown
            fadeObserver.unobserve(entry.target);
        }
    });

}, {
    threshold: 0.1
});

fadeElements.forEach(function(el) {
    fadeObserver.observe(el);
});
