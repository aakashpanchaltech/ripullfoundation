document.addEventListener('DOMContentLoaded', function() {
    let headerHeight = 75; // Default header height, will be updated

    function adjustMainPadding() {
        const headerElement = document.getElementById('main-header');
        if (headerElement) {
            headerHeight = headerElement.offsetHeight;
            document.querySelector('main').style.paddingTop = `${headerHeight}px`;
        } else {
            document.querySelector('main').style.paddingTop = `${headerHeight}px`;
        }
    }

    function initializeHeaderDependentScripts() {
        adjustMainPadding();
        initializeMobileMenu();
        setActiveNavLink();
    }

    initializeHeaderDependentScripts();

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

            navUl.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (navUl.classList.contains('active')) {
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

            let linkPage = linkHref.split("/").pop().split("#")[0];
            if (linkPage === "" && linkHref.includes("index.html")) {
                 linkPage = "index.html";
            }
             if (linkPage === "" && !linkHref.includes("index.html") && currentPage === "index.html" && (linkHref === "./" || linkHref === "/")) {
                linkPage = "index.html"; 
            }


            link.classList.remove('active'); 

            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });

        if (currentPage === "get-involved.html") {
             const getInvolvedLink = document.querySelector('#main-header nav ul li a[href="get-involved.html"]');
             if (getInvolvedLink) {
                getInvolvedLink.classList.add('active');
             }
        }
    }
    
    document.addEventListener('click', function(event) {
        const target = event.target.closest('a[href^="#"], a[href^="./#"], a[href*=".html#"]');

        if (target) {
            const hrefAttribute = target.getAttribute('href');
            const hashIndex = hrefAttribute.lastIndexOf('#');

            if (hashIndex !== -1) {
                const targetId = hrefAttribute.substring(hashIndex);
                const linkPath = hrefAttribute.substring(0, hashIndex);
                const currentPagePath = window.location.pathname.split("/").pop() || "index.html"; // Ensure current page path is correctly identified

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
    
    // Contact Form Logic (for client-side validation before Formspree submission)
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', function(e) {
            // Basic client-side validation
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
                e.preventDefault(); // Prevent submission if validation fails
                formStatus.textContent = 'Please fill out all required fields.';
                formStatus.style.color = 'red';
                if (firstInvalidField) firstInvalidField.focus();
                return;
            }

            // If validation passes, the form will submit to Formspree.
            // Formspree will handle the "sending" and "success/error" messages.
            // You can show a generic "Submitting..." message here if you like,
            // but Formspree's redirection or AJAX handling will take over.
            formStatus.textContent = 'Submitting your message...';
            formStatus.style.color = '#1A5276';
            
            // Note: Formspree might redirect or use its own UI for success/error.
            // If you want to handle success/error with JavaScript after Formspree submission (AJAX mode),
            // you'd need to configure Formspree for AJAX and add more complex JS here.
            // For simplicity, we're relying on Formspree's default behavior.
        });
    }

    window.addEventListener('resize', adjustMainPadding);

});
