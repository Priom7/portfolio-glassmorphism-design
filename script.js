// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize navigation
  initNavigation();

  // Initialize skill levels
  initSkillLevels();

  // Initialize experience toggle
  initExperienceToggle();

  // Initialize contact form
  initContactForm();

  // Initialize 3D glass effects
  init3DGlassEffects();
});

// Fetch Medium Blog Posts
async function fetchMediumBlogs() {
  const mediumUsername = "priom7197"; // Replace with your Medium username
  const rssFeed = `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${mediumUsername}`;

  try {
    const response = await fetch(rssFeed);
    const data = await response.json();

    let blogHTML = "";
    data.items.slice(0, 5).forEach((post) => {
      blogHTML += `<div class="blog-post">
                                    <h3><a href="${post.link}" target="_blank">${post.title}</a></h3>
                                    <p>${post.pubDate}</p>
                                </div>`;
    });

    document.getElementById("blog-container").innerHTML = blogHTML;
  } catch (error) {
    document.getElementById("blog-container").innerHTML =
      "Failed to load blogs.";
  }
}

fetchMediumBlogs();

// Initialize navigation highlight
function initNavigation() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".glass-nav a");

  // Set active navigation on scroll
  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  });

  // Smooth scroll for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      window.scrollTo({
        top: targetSection.offsetTop - 80,
        behavior: "smooth"
      });

      // Set active class
      navLinks.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

// Set skill levels based on data-level attribute
function initSkillLevels() {
  const skillLevels = document.querySelectorAll(".skill-level");

  skillLevels.forEach((skill) => {
    const level = skill.getAttribute("data-level");
    skill.style.setProperty("--level", `${level}%`);

    // Add animation to skill bars
    setTimeout(() => {
      skill.classList.add("animated");
    }, 300);
  });
}

// Initialize experience section toggle
function initExperienceToggle() {
  const toggleBtn = document.getElementById("experienceToggle");
  const moreExperiences = document.querySelector(".more-experiences");

  if (toggleBtn && moreExperiences) {
    toggleBtn.addEventListener("click", () => {
      moreExperiences.style.display =
        moreExperiences.style.display === "block" ? "none" : "block";
      toggleBtn.textContent =
        moreExperiences.style.display === "block" ? "Show Less" : "Show More";

      // Scroll to the newly visible content if showing more
      if (moreExperiences.style.display === "block") {
        window.scrollTo({
          top: toggleBtn.offsetTop - 200,
          behavior: "smooth"
        });
      }
    });
  }
}

// Initialize contact form handling
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Simulate form submission
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      // Simulate API call with timeout
      setTimeout(() => {
        // Reset form
        contactForm.reset();

        // Show success message
        submitBtn.textContent = "Message Sent!";

        // Reset button after 3 seconds
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 3000);
      }, 1500);
    });
  }
}

// Initialize 3D glass effects
// Initialize 3D glass effects
function init3DGlassEffects() {
  const glassCards = document.querySelectorAll(
    ".glass-card, .glass-inner-card"
  );

  // Add 3D tilt effect to glass cards
  glassCards.forEach((card) => {
    // Store original z-index to restore it later
    const originalZIndex = window.getComputedStyle(card).zIndex;
    const originalTransform = window.getComputedStyle(card).transform;

    card.addEventListener("mousemove", (e) => {
      // Get card dimensions and position
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation based on mouse position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation values (reduced to max 3 degrees for more subtle effect)
      const rotateY = ((x - centerX) / centerX) * 1.2;
      const rotateX = -((y - centerY) / centerY) * 1.2;

      // Apply transform - use translateZ to prevent layout shifts
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01) translateZ(0)`;
      card.style.zIndex = "10"; // Ensure active card is above others
      card.style.transition = "transform 0.1s ease"; // Add slight smoothing
      card.style.boxShadow = `
                0 4px 20px rgba(0, 0, 0, 0.2),
                ${rotateY / 3}px ${rotateX / 3}px 15px rgba(99, 102, 241, 0.15)
            `;

      // Add shine effect with more subtle gradient
      const shine = calculateShine(x, y, rect.width, rect.height);
      card.style.background = `
                linear-gradient(
                    ${shine.angle}deg, 
                    rgba(255, 255, 255, ${shine.intensity * 0.7}) 0%, 
                    rgba(255, 255, 255, 0.05) 80%
                )
            `;
    });

    // Reset transform on mouse leave - with smooth transition
    card.addEventListener("mouseleave", () => {
      card.style.transition = "all 0.5s ease";
      card.style.transform = originalTransform || "";
      card.style.boxShadow = "";
      card.style.background = "";
      card.style.zIndex = originalZIndex;

      // Remove transition after animation completes to prevent conflicts with other animations
      setTimeout(() => {
        card.style.transition = "";
      }, 500);
    });
  });

  // Add floating animations to specific elements - using requestAnimationFrame for better performance
  const avatar = document.querySelector(".avatar");
  if (avatar) {
    // Replace CSS animation with JS for better control
    let floatOffset = 0;
    const floatAnimation = () => {
      floatOffset += 0.01;
      const yPosition = Math.sin(floatOffset) * 10;
      avatar.style.transform = `translateY(${yPosition}px)`;
      requestAnimationFrame(floatAnimation);
    };
    requestAnimationFrame(floatAnimation);
  }

  // Add pulse animation to timeline dots - with reduced intensity
  const timelineDots = document.querySelectorAll(".timeline-dot");
  timelineDots.forEach((dot) => {
    // Use CSS variables for animation control
    dot.style.setProperty("--pulse-intensity", "0.7");
    dot.style.animation = "pulse 3s ease-in-out infinite";
  });

  // Add parallax scrolling effect with throttling to improve performance
  let lastScrollTime = 0;
  window.addEventListener(
    "scroll",
    () => {
      // Simple throttle to improve performance
      const now = Date.now();
      if (now - lastScrollTime < 20) return; // Throttle to ~50fps
      lastScrollTime = now;

      const scrollY = window.scrollY;

      // Apply parallax effect to sections with reduced intensity
      document.querySelectorAll(".section-card").forEach((section, index) => {
        // Reduced speed to avoid excessive movement
        const speed = 0.02;
        const yPos = -(scrollY * speed * (index % 2 === 0 ? 1 : -1));
        // Use translateZ(0) to force GPU acceleration and reduce flickering
        section.style.transform = `translateY(${yPos}px) translateZ(0)`;
      });
    },
    { passive: true }
  ); // Add passive flag for better scroll performance
}

// Helper function to calculate shine effect - with adjustments to be more subtle
function calculateShine(x, y, width, height) {
  // Calculate angle of light based on mouse position
  const angleX = (x / width) * 2 - 1;
  const angleY = (y / height) * 2 - 1;
  const angle = Math.atan2(angleY, angleX) * (180 / Math.PI) + 90;

  // Calculate intensity based on distance from center - with reduced maximum
  const distanceX = Math.abs(x - width / 2) / (width / 2);
  const distanceY = Math.abs(y - height / 2) / (height / 2);
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  const intensity = 0.15 - distance * 0.08; // Reduced intensity values

  return {
    angle: angle,
    intensity: Math.max(0.03, intensity)
  };
}

// Add mobile navigation toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileNavToggle = document.createElement("button");
  mobileNavToggle.classList.add("mobile-nav-toggle", "glass-button");
  mobileNavToggle.innerHTML = '<i class="bi bi-list"></i>';
  document.querySelector(".container").prepend(mobileNavToggle);

  mobileNavToggle.addEventListener("click", () => {
    const nav = document.querySelector(".glass-nav");
    nav.classList.toggle("mobile-active");
    mobileNavToggle.innerHTML = nav.classList.contains("mobile-active")
      ? '<i class="bi bi-x-lg"></i>'
      : '<i class="bi bi-list"></i>';
  });

  // Close mobile navigation when clicking on a link
  document.querySelectorAll(".glass-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".glass-nav").classList.remove("mobile-active");
      mobileNavToggle.innerHTML = '<i class="bi bi-list"></i>';
    });
  });
});

// Add theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.createElement("button");
  themeToggle.classList.add("theme-toggle", "glass-button");
  themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i>';
  document.querySelector(".container").prepend(themeToggle);

  // Check for saved theme preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const isDark = document.body.classList.contains("dark-theme");
    themeToggle.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-fill"></i>';

    // Save preference
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
