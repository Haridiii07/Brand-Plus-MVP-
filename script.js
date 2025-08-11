// Personal Brand Analytics MVP - JavaScript with CSV Data Integration

// Global data storage
let csvData = {
    users: [],
    metricsLinkedIn: [],
    metricsTwitter: [],
    metricsLinkedInHistorical: [],
    metricsTwitterHistorical: [],
    postsLinkedIn: [],
    postsTwitter: [],
    recommendations: []
};

// Current user data
let currentUser = null;

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

    // Initialize the application
    initializeApp();
});

// Initialize the application
async function initializeApp() {
    try {
        // Show initial loading state
        showAppLoadingState();
        
        // Load all CSV data
        await loadAllCSVData();
        
        // Initialize user selector
        initializeUserSelector();
        
        // Set default user (first user in the list)
        if (csvData.users.length > 0) {
            const defaultUser = csvData.users[0];
            await loadUserData(defaultUser.Email);
        }
        
        // Hide loading state and show success
        hideAppLoadingState();
        showAppSuccessState();
        
        // Simulate real-time data updates
        simulateDataUpdates();
        
    } catch (error) {
        console.error('Failed to initialize application:', error);
        hideAppLoadingState();
        showAppErrorState('Failed to load data. Please try again.', () => initializeApp());
    }
}

// Load all CSV data files
async function loadAllCSVData() {
    const csvFiles = [
        { name: 'users', path: 'data/users.csv' },
        { name: 'metricsLinkedIn', path: 'data/metrics_linkedin.csv' },
        { name: 'metricsTwitter', path: 'data/metrics_twitter.csv' },
        { name: 'metricsLinkedInHistorical', path: 'data/metrics_linkedin_historical.csv' },
        { name: 'metricsTwitterHistorical', path: 'data/metrics_twitter_historical.csv' },
        { name: 'postsLinkedIn', path: 'data/posts_linkedin.csv' },
        { name: 'postsTwitter', path: 'data/posts_twitter.csv' },
        { name: 'recommendations', path: 'data/recommendations.csv' }
    ];

    const loadPromises = csvFiles.map(file => loadCSVFile(file.path, file.name));
    
    try {
        await Promise.all(loadPromises);
        console.log('All CSV data loaded successfully');
    } catch (error) {
        console.error('Error loading CSV files:', error);
        throw error;
    }
}

// Load a single CSV file
function loadCSVFile(filePath, dataKey) {
    return new Promise((resolve, reject) => {
        Papa.parse(filePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                if (results.errors.length > 0) {
                    console.warn('CSV parsing warnings for', filePath, results.errors);
                }
                csvData[dataKey] = results.data;
                resolve(results.data);
            },
            error: function(error) {
                console.error('Error loading CSV file:', filePath, error);
                reject(error);
            }
        });
    });
}

// Get user data by email
function getUserData(email) {
    try {
        // Find user in users.csv
        const user = csvData.users.find(u => u.Email.toLowerCase() === email.toLowerCase());
        
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }

        const userId = user.UserID;

        // Get LinkedIn metrics
        const linkedinMetrics = csvData.metricsLinkedIn.find(m => m.UserID === userId);
        
        // Get Twitter metrics
        const twitterMetrics = csvData.metricsTwitter.find(m => m.UserID === userId);
        
        // Get LinkedIn posts
        const linkedinPosts = csvData.postsLinkedin.filter(p => p.UserID === userId);
        
        // Get Twitter posts
        const twitterPosts = csvData.postsTwitter.filter(p => p.UserID === userId);
        
        // Get recommendations
        const recommendations = csvData.recommendations.filter(r => r.UserID === userId);

        // Calculate average engagement across platforms
        const linkedinEngagement = linkedinMetrics ? parseFloat(linkedinMetrics.Engagement) : 0;
        const twitterEngagement = twitterMetrics ? parseFloat(twitterMetrics.Engagement) : 0;
        const avgEngagement = linkedinEngagement && twitterEngagement ? 
            ((linkedinEngagement + twitterEngagement) / 2).toFixed(1) : 
            (linkedinEngagement || twitterEngagement || 0).toFixed(1);

        // Calculate total profile views
        const linkedinViews = linkedinMetrics ? parseInt(linkedinMetrics.ProfileViews) : 0;
        const twitterViews = twitterMetrics ? parseInt(twitterMetrics.ProfileViews) : 0;
        const totalViews = linkedinViews + twitterViews;

        return {
            ...user,
            metrics: {
                linkedinFollowers: linkedinMetrics ? parseInt(linkedinMetrics.Followers) : 0,
                twitterFollowers: twitterMetrics ? parseInt(twitterMetrics.Followers) : 0,
                avgEngagement: parseFloat(avgEngagement),
                profileViews: totalViews,
                linkedinEngagement: linkedinEngagement,
                twitterEngagement: twitterEngagement,
                linkedinViews: linkedinViews,
                twitterViews: twitterViews
            },
            posts: {
                linkedin: linkedinPosts,
                twitter: twitterPosts
            },
            recommendations: recommendations
        };
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
}

// Load user data by email
async function loadUserData(email) {
    try {
        // Show loading state for user data
        showUserDataLoadingState();
        
        const userData = getUserData(email);
        currentUser = userData;
        
        // Update UI with user data
        updateUserInterface(userData);
        
        // Hide loading state and show success
        hideUserDataLoadingState();
        showUserDataSuccessState();
        
        console.log('User data loaded successfully:', userData);
        
    } catch (error) {
        console.error('Failed to load user data:', error);
        hideUserDataLoadingState();
        showUserDataErrorState(`Failed to load data for ${email}. Please try again.`, () => loadUserData(email));
    }
}

// Update the user interface with data
function updateUserInterface(userData) {
    // Update user name in navigation
    const currentUserName = document.getElementById('currentUserName');
    if (currentUserName) {
        currentUserName.textContent = userData.Name;
    }
    
    // Update profile section
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (profileName) profileName.textContent = userData.Name;
    if (profileEmail) profileEmail.textContent = userData.Email;
    
    // Update social handles in profile
    updateSocialHandles(userData);
    
    // Update KPI values
    updateKPIValues(userData.metrics);
    
    // Update recommendations
    updateRecommendations(userData.recommendations);
    
    // Update user selector
    updateUserSelector(userData.Email);
}

// Update social handles in profile section
function updateSocialHandles(userData) {
    const linkedinHandle = document.querySelector('.account-item:nth-child(1) .account-info p');
    const twitterHandle = document.querySelector('.account-item:nth-child(2) .account-info p');
    
    if (linkedinHandle) linkedinHandle.textContent = userData.LinkedInHandle;
    if (twitterHandle) twitterHandle.textContent = userData.TwitterHandle;
}

// Initialize user selector dropdown
function initializeUserSelector() {
    const userSelect = document.getElementById('userSelect');
    if (!userSelect) return;

    // Clear existing options
    userSelect.innerHTML = '<option value="">Select a user...</option>';

    // Add user options
    csvData.users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.Email;
        option.textContent = `${user.Name} (${user.Email})`;
        userSelect.appendChild(option);
    });

    // Add change event listener
    userSelect.addEventListener('change', function() {
        const selectedEmail = this.value;
        if (selectedEmail) {
            loadUserData(selectedEmail);
        }
    });
}

// Update user selector to show current user
function updateUserSelector(currentEmail) {
    const userSelect = document.getElementById('userSelect');
    if (userSelect) {
        userSelect.value = currentEmail;
    }
}

// Update KPI values with animation and real data
function updateKPIValues(metrics) {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach((card, index) => {
        // Show loading state for each KPI card
        showKPILoadingState(card);
        
        setTimeout(() => {
            try {
                const valueElement = card.querySelector('.kpi-value');
                const changeElement = card.querySelector('.kpi-change');
                const changeText = changeElement.querySelector('.change-text');
                const changeIcon = changeElement.querySelector('i');
                
                // Get current and previous values for percentage change calculation
                const currentData = getCurrentKPIValue(metrics, index);
                const previousData = getPreviousKPIValue(metrics, index);
                const percentageChange = calculatePercentageChange(currentData.value, previousData.value);
                
                // Animate the value with counting effect
                animateValue(valueElement, currentData.value, currentData.format);
                
                // Update change indicator
                updateChangeIndicator(changeElement, changeText, changeIcon, percentageChange);
                
                // Hide loading state and show success
                hideKPILoadingState(card);
                showKPISuccessState(card);
                
            } catch (error) {
                console.error(`Error updating KPI card ${index}:`, error);
                hideKPILoadingState(card);
                showKPIErrorState(card, 'Data unavailable');
            }
        }, 500 + (index * 100)); // Staggered animation
    });
}

// Get current KPI value based on index
function getCurrentKPIValue(metrics, index) {
    switch(index) {
        case 0: // LinkedIn Followers
            return { value: metrics.linkedinFollowers || 0, format: 'number' };
        case 1: // Twitter Followers
            return { value: metrics.twitterFollowers || 0, format: 'number' };
        case 2: // Avg Engagement
            return { value: metrics.avgEngagement || 0, format: 'percentage' };
        case 3: // Profile Views
            return { value: metrics.profileViews || 0, format: 'number' };
        default:
            return { value: 0, format: 'number' };
    }
}

// Get previous KPI value from historical data
function getPreviousKPIValue(metrics, index) {
    if (!currentUser || !currentUser.UserID) return { value: 0, format: 'number' };
    
    const userId = currentUser.UserID;
    const currentDate = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    // Get the most recent previous data (assuming weekly data)
    let previousData = { value: 0, format: 'number' };
    
    try {
        switch(index) {
            case 0: // LinkedIn Followers
                const linkedinHistorical = csvData.metricsLinkedInHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                previousData = { value: linkedinHistorical ? parseInt(linkedinHistorical.Followers) : 0, format: 'number' };
                break;
            case 1: // Twitter Followers
                const twitterHistorical = csvData.metricsTwitterHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                previousData = { value: twitterHistorical ? parseInt(twitterHistorical.Followers) : 0, format: 'number' };
                break;
            case 2: // Avg Engagement
                const linkedinEngagement = csvData.metricsLinkedInHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                const twitterEngagement = csvData.metricsTwitterHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                
                const prevLinkedinEngagement = linkedinEngagement ? parseFloat(linkedinEngagement.Engagement) : 0;
                const prevTwitterEngagement = twitterEngagement ? parseFloat(twitterEngagement.Engagement) : 0;
                const prevAvgEngagement = prevLinkedinEngagement && prevTwitterEngagement ? 
                    (prevLinkedinEngagement + prevTwitterEngagement) / 2 : 
                    (prevLinkedinEngagement || prevTwitterEngagement || 0);
                previousData = { value: prevAvgEngagement, format: 'percentage' };
                break;
            case 3: // Profile Views
                const linkedinViews = csvData.metricsLinkedInHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                const twitterViews = csvData.metricsTwitterHistorical
                    .filter(m => m.UserID === userId && m.Date !== currentDate)
                    .sort((a, b) => new Date(b.Date) - new Date(a.Date))[0];
                
                const prevLinkedinViews = linkedinViews ? parseInt(linkedinViews.ProfileViews) : 0;
                const prevTwitterViews = twitterViews ? parseInt(twitterViews.ProfileViews) : 0;
                previousData = { value: prevLinkedinViews + prevTwitterViews, format: 'number' };
                break;
        }
    } catch (error) {
        console.warn('Error getting previous KPI value:', error);
        previousData = { value: 0, format: 'number' };
    }
    
    return previousData;
}

// Animate value with counting effect
function animateValue(element, targetValue, format) {
    const startValue = 0;
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    
    function updateValue(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        // Format the value
        let displayValue;
        if (format === 'percentage') {
            displayValue = currentValue.toFixed(1) + '%';
        } else {
            displayValue = formatNumber(Math.floor(currentValue));
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    requestAnimationFrame(updateValue);
}

// Update change indicator with appropriate styling
function updateChangeIndicator(changeElement, changeText, changeIcon, percentageChange) {
    // Remove existing classes
    changeElement.classList.remove('positive', 'negative', 'neutral');
    changeElement.removeAttribute('data-change');
    
    // Determine change type and update styling
    if (percentageChange > 0) {
        changeElement.classList.add('positive');
        changeElement.setAttribute('data-change', 'positive');
        changeIcon.className = 'fas fa-arrow-up';
        changeText.textContent = `+${percentageChange}% this week`;
    } else if (percentageChange < 0) {
        changeElement.classList.add('negative');
        changeElement.setAttribute('data-change', 'negative');
        changeIcon.className = 'fas fa-arrow-down';
        changeText.textContent = `${percentageChange}% this week`;
    } else {
        changeElement.classList.add('neutral');
        changeElement.setAttribute('data-change', 'neutral');
        changeIcon.className = 'fas fa-minus';
        changeText.textContent = '0% this week';
    }
}

// Update recommendations section
function updateRecommendations(recommendations) {
    const recommendationsContainer = document.querySelector('.recommendations-container');
    if (!recommendationsContainer) return;

    // Show loading state for recommendations
    showRecommendationsLoadingState(recommendationsContainer);

    setTimeout(() => {
        try {
            // Clear existing recommendations
            recommendationsContainer.innerHTML = '';

            // Add new recommendations
            recommendations.forEach((rec, index) => {
                const recommendationCard = createRecommendationCard(rec, index);
                recommendationsContainer.appendChild(recommendationCard);
            });

            // Hide loading state and show success
            hideRecommendationsLoadingState(recommendationsContainer);
            showRecommendationsSuccessState(recommendationsContainer);

        } catch (error) {
            console.error('Error updating recommendations:', error);
            hideRecommendationsLoadingState(recommendationsContainer);
            showRecommendationsErrorState(recommendationsContainer, 'Failed to load recommendations');
        }
    }, 300);
}

// Create a recommendation card element
function createRecommendationCard(recommendation, index) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    card.setAttribute('data-recommendation-id', recommendation.RecommendationID);
    
    const iconClass = getRecommendationIcon(recommendation.Category);
    const statusClass = recommendation.Status.toLowerCase();
    
    card.innerHTML = `
        <div class="recommendation-icon">
            <i class="fas ${iconClass}"></i>
        </div>
        <div class="recommendation-content">
            <h3>${recommendation.Title}</h3>
            <p>${recommendation.Description}</p>
            <div class="recommendation-meta">
                <span class="recommendation-date">${formatDate(recommendation.DateCreated)}</span>
                <span class="recommendation-status ${statusClass}">${recommendation.Status}</span>
            </div>
        </div>
    `;
    
    // Add fade-in animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, index * 200);
    
    return card;
}

// Get icon class based on recommendation category
function getRecommendationIcon(category) {
    const iconMap = {
        'Content Strategy': 'fa-lightbulb',
        'Engagement': 'fa-heart',
        'Networking': 'fa-users',
        'Profile': 'fa-user-edit',
        'default': 'fa-chart-line'
    };
    return iconMap[category] || iconMap.default;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

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
// ===== COMPREHENSIVE LOADING STATES =====

// App-level loading states
function showAppLoadingState() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'app-loading-overlay';
    loadingOverlay.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading BrandPulse Dashboard...</p>
        </div>
    `;
    
    mainContent.appendChild(loadingOverlay);
    mainContent.classList.add('loading');
}

function hideAppLoadingState() {
    const mainContent = document.querySelector('.main-content');
    const loadingOverlay = document.querySelector('.app-loading-overlay');
    
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
    if (mainContent) {
        mainContent.classList.remove('loading');
    }
}

function showAppSuccessState() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Create success notification
    const successNotification = document.createElement('div');
    successNotification.className = 'app-success-notification';
    successNotification.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <span>Dashboard loaded successfully!</span>
        </div>
    `;
    
    mainContent.appendChild(successNotification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (successNotification.parentNode) {
            successNotification.remove();
        }
    }, 3000);
}

function showAppErrorState(message, retryCallback) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    // Create error notification
    const errorNotification = document.createElement('div');
    errorNotification.className = 'app-error-notification';
    errorNotification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="retry-btn" onclick="this.parentElement.parentElement.remove(); ${retryCallback.toString()}()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
    
    mainContent.appendChild(errorNotification);
}

// User data loading states
function showUserDataLoadingState() {
    const profileCard = document.querySelector('.profile-card');
    const kpiGrid = document.querySelector('.kpi-grid');
    const recommendationsContainer = document.querySelector('.recommendations-container');
    
    if (profileCard) {
        profileCard.classList.add('loading');
        profileCard.innerHTML = `
            <div class="skeleton-loading">
                <div class="skeleton-avatar"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
            </div>
        `;
    }
    
    if (kpiGrid) {
        kpiGrid.classList.add('loading');
    }
    
    if (recommendationsContainer) {
        recommendationsContainer.classList.add('loading');
        recommendationsContainer.innerHTML = `
            <div class="skeleton-loading">
                <div class="skeleton-line"></div>
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
            </div>
        `;
    }
}

function hideUserDataLoadingState() {
    const profileCard = document.querySelector('.profile-card');
    const kpiGrid = document.querySelector('.kpi-grid');
    const recommendationsContainer = document.querySelector('.recommendations-container');
    
    if (profileCard) profileCard.classList.remove('loading');
    if (kpiGrid) kpiGrid.classList.remove('loading');
    if (recommendationsContainer) recommendationsContainer.classList.remove('loading');
}

function showUserDataSuccessState() {
    const profileCard = document.querySelector('.profile-card');
    if (profileCard) {
        profileCard.classList.add('success');
        setTimeout(() => profileCard.classList.remove('success'), 2000);
    }
}

function showUserDataErrorState(message, retryCallback) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const errorNotification = document.createElement('div');
    errorNotification.className = 'user-data-error-notification';
    errorNotification.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button class="retry-btn" onclick="this.parentElement.parentElement.remove(); ${retryCallback.toString()}()">
                <i class="fas fa-redo"></i> Retry
            </button>
        </div>
    `;
    
    mainContent.appendChild(errorNotification);
}

// KPI loading states
function showKPILoadingState(card) {
    card.classList.add('loading');
    const valueElement = card.querySelector('.kpi-value');
    const changeElement = card.querySelector('.kpi-change');
    
    if (valueElement) {
        valueElement.innerHTML = '<div class="skeleton-number"></div>';
    }
    if (changeElement) {
        changeElement.innerHTML = '<div class="skeleton-change"></div>';
    }
}

function hideKPILoadingState(card) {
    card.classList.remove('loading');
}

function showKPISuccessState(card) {
    card.classList.add('success');
    setTimeout(() => card.classList.remove('success'), 1500);
}

function showKPIErrorState(card, message) {
    card.classList.add('error');
    const valueElement = card.querySelector('.kpi-value');
    if (valueElement) {
        valueElement.innerHTML = `<span class="error-text">${message}</span>`;
    }
}

// Recommendations loading states
function showRecommendationsLoadingState(container) {
    container.classList.add('loading');
    container.innerHTML = `
        <div class="skeleton-loading">
            <div class="skeleton-recommendation"></div>
            <div class="skeleton-recommendation"></div>
            <div class="skeleton-recommendation"></div>
        </div>
    `;
}

function hideRecommendationsLoadingState(container) {
    container.classList.remove('loading');
}

function showRecommendationsSuccessState(container) {
    container.classList.add('success');
    setTimeout(() => container.classList.remove('success'), 2000);
}

function showRecommendationsErrorState(container, message) {
    container.classList.add('error');
    container.innerHTML = `
        <div class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="retry-btn" onclick="location.reload()">
                <i class="fas fa-redo"></i> Refresh Page
            </button>
        </div>
    `;
}

// Legacy functions for backward compatibility
function showLoadingState(element) {
    element.style.opacity = '0.6';
    element.style.pointerEvents = 'none';
}

function hideLoadingState(element) {
    element.style.opacity = '1';
    element.style.pointerEvents = 'auto';
}

// Enhanced error message function
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
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
💡 CSV Data Integration Complete
🔗 Real data from CSV files loaded successfully

Available users:
${csvData.users.map(user => `- ${user.Name} (${user.Email})`).join('\n')}

Next steps:
1. Set up Google Sheets with your CSV data
2. Create Looker Studio dashboard
3. Replace the embed placeholder with your dashboard
4. Configure user authentication
`);


