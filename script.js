// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove 'active' class from all nav links
        document.querySelectorAll('header nav ul li a').forEach(navLink => {
            navLink.classList.remove('active');
        });
        // Add 'active' class to the clicked link
        this.classList.add('active');


        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = document.querySelector('header').offsetHeight; // Get header height
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

// Optional: Highlight active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    const headerHeight = document.querySelector('header').offsetHeight;
    const navLinks = document.querySelectorAll('header nav ul li a');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 50; // Adjusted for header and a little buffer
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
     // Special case for hero section as it might not always be detected if very short
    if (window.pageYOffset < sections[0].offsetTop - headerHeight - 50) {
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('header nav ul li a[href="#hero"]').classList.add('active');
    }
});