// Personal Brand Analytics MVP - JavaScript

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all nav links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            const targetSection = this.getAttribute('data-section');
            const targetElement = document.getElementById(targetSection);
            if (targetElement) {
                targetElement.classList.add('active');
            }
        });
    });

    // Simulate real-time data updates (for demo purposes)
    simulateDataUpdates();
    
    // Initialize user data
    loadUserData();
});

// Simulate real-time data updates
function simulateDataUpdates() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    
    setInterval(() => {
        kpiValues.forEach(value => {
            // Add a subtle pulse animation to show "live" data
            value.style.transform = 'scale(1.05)';
            setTimeout(() => {
                value.style.transform = 'scale(1)';
            }, 200);
        });
    }, 30000); // Every 30 seconds
}

// Load user data (simulated)
function loadUserData() {
    // This would typically fetch data from your backend
    // For the MVP, we're using the simulated data from our CSV files
    
    const userData = {
        name: "Alice Smith",
        email: "user1@example.com",
        linkedinHandle: "alice-smith-li",
        twitterHandle: "alicesmith_tw",
        metrics: {
            linkedinFollowers: 520,
            twitterFollowers: 110,
            avgEngagement: 5.1,
            profileViews: 60
        }
    };
    
    // Update UI with user data
    updateUserInterface(userData);
}

// Update the user interface with data
function updateUserInterface(userData) {
    // Update user name in navigation
    const currentUserName = document.getElementById('currentUserName');
    if (currentUserName) {
        currentUserName.textContent = userData.name;
    }
    
    // Update profile section
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) profileName.textContent = userData.name;
    if (profileEmail) profileEmail.textContent = userData.email;
    
    // Update KPI values (these would come from your CSV data in a real implementation)
    updateKPIValues(userData.metrics);
}

// Update KPI values with animation
function updateKPIValues(metrics) {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach((card, index) => {
        const valueElement = card.querySelector('.kpi-value');
        const changeElement = card.querySelector('.kpi-change');
        
        // Add loading animation
        card.style.opacity = '0.7';
        
        setTimeout(() => {
            // Update values based on the metrics
            switch(index) {
                case 0: // LinkedIn Followers
                    valueElement.textContent = metrics.linkedinFollowers;
                    break;
                case 1: // Twitter Followers
                    valueElement.textContent = metrics.twitterFollowers;
                    break;
                case 2: // Avg Engagement
                    valueElement.textContent = metrics.avgEngagement + '%';
                    break;
                case 3: // Profile Views
                    valueElement.textContent = metrics.profileViews;
                    break;
            }
            
            // Restore opacity
            card.style.opacity = '1';
            
            // Add success animation
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
            
        }, 500 + (index * 100)); // Staggered animation
    });
}

// Handle recommendation interactions
function markRecommendationAsImplemented(recommendationId) {
    const recommendationCard = document.querySelector(`[data-recommendation-id="${recommendationId}"]`);
    if (recommendationCard) {
        const statusElement = recommendationCard.querySelector('.recommendation-status');
        statusElement.textContent = 'Implemented';
        statusElement.className = 'recommendation-status implemented';
        
        // Add success animation
        recommendationCard.style.background = 'rgba(76, 175, 80, 0.1)';
        setTimeout(() => {
            recommendationCard.style.background = '';
        }, 2000);
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading states for better UX
function showLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Utility function to format numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Utility function to calculate percentage change
function calculatePercentageChange(current, previous) {
    if (previous === 0) return 0;
    return ((current - previous) / previous * 100).toFixed(1);
}

// Add transition effects
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.kpi-card, .recommendation-card, .profile-card, .social-accounts');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Console message for developers
console.log(`
🚀 BrandPulse MVP - Personal Brand Analytics
📊 Built with HTML, CSS, and JavaScript
💡 Ready for integration with Google Data Studio
🔗 Connect your data sources to see real analytics

Next steps:
1. Set up Google Sheets with your CSV data
2. Create Looker Studio dashboard
3. Replace the embed placeholder with your dashboard
4. Configure user authentication
`);

