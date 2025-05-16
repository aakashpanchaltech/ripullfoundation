document.addEventListener('DOMContentLoaded', function() {
    let headerHeight = 75; // Default header height, will be updated

    // Function to set main content padding based on header height
    function adjustMainPadding() {
        const headerElement = document.getElementById('main-header');
        if (headerElement) {
            headerHeight = headerElement.offsetHeight;
            document.querySelector('main').style.paddingTop = `${headerHeight}px`;
        } else {
            // Fallback if header isn't found immediately, though it should be static now
            document.querySelector('main').style.paddingTop = `${headerHeight}px`;
        }
    }

    // Initialize functions that depend on the header being present
    function initializeHeaderDependentScripts() {
        adjustMainPadding(); // Adjust padding on initial load
        initializeMobileMenu();
        setActiveNavLink();
    }

    // Call initialization
    initializeHeaderDependentScripts();

    // Update current year in footer
    const currentYearSpanFooter = document.getElementById('currentYearFooter');
    if (currentYearSpanFooter) {
        currentYearSpanFooter.textContent = new Date().getFullYear();
    }

    function initializeMobileMenu() {
        const menuToggle = document.querySelector('#main-header .menu-toggle');
        const navUl = document.querySelector('#main-header nav ul');

        if (menuToggle && navUl) {
            menuToggle.addEventListener('click', function () {
                navUl.classList.toggle('active');
                const isExpanded = navUl.classList.contains('active');
                menuToggle.setAttribute('aria-expanded', isExpanded);
                menuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            });

            // Close menu when a link is clicked (for SPA-like behavior or navigating away)
            navUl.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    // Check if the mobile menu is active and the link is not just an on-page anchor
                    // that might not navigate away (though smooth scroll handles this separately).
                    if (navUl.classList.contains('active')) {
                         // For multi-page sites, the menu will naturally "close" on page load.
                         // This ensures it closes if it were a single-page app with view changes.
                        navUl.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                });
            });
        }
    }
    
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('#main-header nav ul li a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return; 

            // Handle cases where href might be absolute or relative
            let linkPage = linkHref.split("/").pop().split("#")[0];
            if (linkPage === "" && linkHref.includes("index.html")) { // Handles root path linking to index.html
                 linkPage = "index.html";
            }
            if (linkPage === "" && !linkHref.includes("index.html") && currentPage === "index.html" && linkHref === "./") {
                linkPage = "index.html"; // Handles <a href="./"> on index.html
            }


            link.classList.remove('active'); 

            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });

        // Special case for "Donate Now" button if it links to a section on "Get Involved" page
        if (currentPage === "get-involved.html") {
             const getInvolvedLink = document.querySelector('#main-header nav ul li a[href="get-involved.html"]');
             if (getInvolvedLink) { // Ensure the main "Get Involved" link is also active
                getInvolvedLink.classList.add('active');
             }
        }
    }
    
    // Smooth scroll for on-page anchor links
    document.addEventListener('click', function(event) {
        const target = event.target.closest('a[href^="#"], a[href^="./#"], a[href*=".html#"]'); // More robust selector for on-page anchors

        if (target) {
            const hrefAttribute = target.getAttribute('href');
            const hashIndex = hrefAttribute.lastIndexOf('#');

            if (hashIndex !== -1) {
                const targetId = hrefAttribute.substring(hashIndex); // Get the part from # onwards
                
                // Check if the link is to the current page or just a hash
                const linkPath = hrefAttribute.substring(0, hashIndex);
                const currentPagePath = window.location.pathname.split("/").pop();

                // Only proceed if it's an anchor on the current page or a root anchor
                if (targetId.length > 1 && (linkPath === "" || linkPath === currentPagePath || linkPath === "./" || hrefAttribute.startsWith("#"))) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        event.preventDefault();
                        
                        const currentHeader = document.getElementById('main-header');
                        const currentHeaderHeight = currentHeader ? currentHeader.offsetHeight : 75;

                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - currentHeaderHeight;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });

                        // Close mobile menu if open
                        const navUl = document.querySelector('#main-header nav ul');
                        const menuToggle = document.querySelector('#main-header .menu-toggle');
                        if (navUl && navUl.classList.contains('active')) {
                            navUl.classList.remove('active');
                            if(menuToggle) {
                                menuToggle.setAttribute('aria-expanded', 'false');
                                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                            }
                        }
                    }
                }
            }
        }
    });
    
    // Contact Form Submission (Simulated)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            let isValid = true;
            let firstInvalidField = null;

            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'red';
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = input;
                } else {
                    input.style.borderColor = '#CCD1D1'; 
                }
            });
            
            if (!isValid) {
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.style.color = 'red';
                if (firstInvalidField) firstInvalidField.focus(); // Focus the first invalid field
                return;
            }

            formStatus.textContent = 'Sending your message...';
            formStatus.style.color = '#1A5276'; // Brand color for sending message

            // Simulate form submission (In a real scenario, replace with an AJAX call to your backend or a service like Formspree/Netlify Forms)
            setTimeout(() => { 
                formStatus.textContent = 'Thank you! Your message has been sent.';
                formStatus.style.color = 'green';
                contactForm.reset();
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => input.style.borderColor = '#CCD1D1');
            }, 2000);
        });
    }

    // Adjust main padding if header height changes on resize (e.g., due to text wrap in nav)
    window.addEventListener('resize', adjustMainPadding);

}); // End of DOMContentLoaded
