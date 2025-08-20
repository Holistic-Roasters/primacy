// PRIMACY Protocol Dashboard - Main JavaScript
// Global state management
let currentTier = 0; // 0: Not selected, 1: Anonymous, 2: Operator, 3: Protocol Subscriber
let currentView = 'dashboard';
let userData = {
    cognitiveScores: [],
    wearableData: {},
    correlations: [],
    contextLogs: [],
    streak: 326,
    totalTests: 0
};

// Context Log Categories and Colors
const contextCategories = {
    sleep: {
        color: '#0066ff', // Blue
        emoji: '🟦',
        label: 'Sleep & Recovery',
        description: 'Restorative processes, HRV, sleep quality'
    },
    physical: {
        color: '#00ff9d', // Green
        emoji: '🟩',
        label: 'Physical Performance',
        description: 'Strength, endurance, training adaptation'
    },
    cognitive: {
        color: '#ff9500', // Orange
        emoji: '🟧',
        label: 'Cognitive & Mood',
        description: 'Focus, memory, stress resilience, emotional state'
    },
    metabolic: {
        color: '#ff3b30', // Red
        emoji: '🟥',
        label: 'Metabolic & Hormonal',
        description: 'Energy balance, glucose regulation, hormone levels'
    },
    environment: {
        color: '#9b59b6', // Purple
        emoji: '🟪',
        label: 'Environment & Stressors',
        description: 'External factors influencing physiological load'
    }
};

// Context Log Items
const contextLogItems = [
    // Metabolic & Hormonal
    { id: 'late-meal', label: 'Late Meal', category: 'metabolic', emoji: '🟥', icon: 'fa-utensils' },
    { id: 'alcohol', label: 'Alcohol', category: 'metabolic', emoji: '🟥', icon: 'fa-wine-glass' },
    { id: 'caffeine-late', label: 'Caffeine Late', category: 'metabolic', emoji: '🟥', icon: 'fa-coffee' },
    { id: 'low-hydration', label: 'Low Hydration', category: 'metabolic', emoji: '🟥', icon: 'fa-tint-slash' },
    
    // Physical Performance
    { id: 'hiit', label: 'High-Intensity Workout', category: 'physical', emoji: '🟩', icon: 'fa-fire' },
    { id: 'strength', label: 'Strength Training', category: 'physical', emoji: '🟩', icon: 'fa-dumbbell' },
    { id: 'recovery-day', label: 'Recovery Day', category: 'sleep', emoji: '🟦', icon: 'fa-spa' },
    
    // Sleep (Auto-fill for tracker users)
    { id: 'short-sleep', label: 'Short Sleep', category: 'sleep', emoji: '🟦', icon: 'fa-bed' },
    { id: 'poor-sleep', label: 'Poor Sleep Quality', category: 'sleep', emoji: '🟦', icon: 'fa-moon' },
    
    // Environment & Travel
    { id: 'travel', label: 'Travel', category: 'environment', emoji: '🟪', icon: 'fa-plane' },
    { id: 'altitude', label: 'Altitude Change', category: 'environment', emoji: '🟪', icon: 'fa-mountain' },
    { id: 'sauna', label: 'Sauna / Heat', category: 'environment', emoji: '🟪', icon: 'fa-temperature-high' },
    { id: 'cold-exposure', label: 'Cold Exposure', category: 'environment', emoji: '🟪', icon: 'fa-snowflake' },
    
    // Health & Wellness
    { id: 'illness', label: 'Illness / Cold', category: 'metabolic', emoji: '🟥', icon: 'fa-virus' },
    { id: 'injury', label: 'Injury / Pain', category: 'metabolic', emoji: '🟥', icon: 'fa-user-injured' },
    
    // Lifestyle & Mental State
    { id: 'high-stress', label: 'High-Stress Day', category: 'cognitive', emoji: '🟧', icon: 'fa-brain' },
    { id: 'sex', label: 'Sexual Activity', category: 'cognitive', emoji: '🟧', icon: 'fa-heart' },
    
    // Flexible Input
    { id: 'other', label: 'Other', category: 'environment', emoji: '🟪', icon: 'fa-ellipsis-h' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Show tier selection modal by default
    showTierSelection();
    
    // Initialize any saved tier from localStorage
    const savedTier = localStorage.getItem('primacyTier');
    if (savedTier) {
        selectTier(parseInt(savedTier), false);
    }
});

// Tier Selection and Management
function selectTier(tier, showDash = true) {
    currentTier = tier;
    localStorage.setItem('primacyTier', tier);
    
    // Update UI based on tier
    updateTierIndicator(tier);
    enableTierFeatures(tier);
    
    // Hide tier selection modal
    document.getElementById('tierSelection').classList.add('hidden');
    
    // Show dashboard
    if (showDash) {
        showDashboard();
    }
    
    // Initialize charts after tier selection
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function updateTierIndicator(tier) {
    const indicator = document.getElementById('tierIndicator');
    const tierNames = ['', 'ANONYMOUS', 'OPERATOR', 'PROTOCOL'];
    const tierColors = ['', 'bg-primacy-light', 'bg-reset-blue', 'bg-gradient-to-r from-premium-gold to-warning-orange'];
    
    if (tier > 0) {
        indicator.innerHTML = `<i class="fas fa-circle mr-2"></i>${tierNames[tier]}`;
        indicator.className = `px-3 py-1 rounded-full text-xs font-mono ${tierColors[tier]} ${tier === 3 ? 'text-primacy-black font-bold' : 'text-white'}`;
    }
}

function enableTierFeatures(tier) {
    // Enable/disable features based on tier
    const operatorFeatures = document.querySelectorAll('.operator-only');
    const protocolFeatures = document.querySelectorAll('.protocol-only');
    
    // Update test availability
    if (tier >= 2) {
        // Enable all tests for Operator and above
        document.querySelectorAll('#cognitiveTestsView .glass-effect').forEach(el => {
            el.classList.remove('opacity-60');
            const button = el.querySelector('button');
            if (button && button.disabled) {
                button.disabled = false;
                button.classList.remove('cursor-not-allowed');
                button.innerHTML = 'Start Test';
            }
        });
        
        // Show test history
        const testHistory = document.getElementById('testHistory');
        if (testHistory) {
            testHistory.classList.remove('hidden');
        }
    }
    
    // Enable Tier 2 features (Basic Correlations)
    if (tier >= 2) {
        // Basic correlations available for Operator
        updateCorrelationsView(tier);
    }
    
    // Enable Protocol features
    if (tier === 3) {
        // Enable AI Coach, Advanced Correlations, Community
        updateAICoachView(true);
        updateCommunityView(true);
    } else {
        updateAICoachView(false);
        updateCommunityView(false);
    }
}

function showTierSelection() {
    document.getElementById('tierSelection').classList.remove('hidden');
}

// Navigation Functions
function showDashboard() {
    hideAllViews();
    document.getElementById('dashboardView').classList.remove('hidden');
    currentView = 'dashboard';
    initializeCharts();
}

function showCognitiveTests() {
    if (currentTier === 0) {
        showTierSelection();
        return;
    }
    hideAllViews();
    document.getElementById('cognitiveTestsView').classList.remove('hidden');
    currentView = 'cognitiveTests';
}

function showWearables() {
    if (currentTier === 0) {
        showTierSelection();
        return;
    }
    if (currentTier === 1) {
        alert('Wearable integration requires an Operator account or higher. Please upgrade to continue.');
        return;
    }
    hideAllViews();
    document.getElementById('wearablesView').classList.remove('hidden');
    currentView = 'wearables';
    initializeWearableCharts();
}

function showCorrelations() {
    if (currentTier < 2) {
        alert('Correlation features require an Operator account or higher. Please sign up to access correlation analytics.');
        return;
    }
    hideAllViews();
    document.getElementById('correlationsView').classList.remove('hidden');
    currentView = 'correlations';
    
    // Initialize appropriate correlation view based on tier
    if (currentTier === 2) {
        initializeBasicCorrelations();
    } else if (currentTier === 3) {
        initializeAdvancedCorrelations();
    }
}

function showAICoach() {
    if (currentTier < 3) {
        alert('Kai Mercer AI Coach is available for Protocol Subscribers only. Upgrade to access personalized coaching.');
        return;
    }
    hideAllViews();
    document.getElementById('aiCoachView').classList.remove('hidden');
    currentView = 'aiCoach';
}

function showCommunity() {
    if (currentTier < 3) {
        alert('The Foundry community is exclusive to Protocol Subscribers. Upgrade to join the elite performance community.');
        return;
    }
    hideAllViews();
    document.getElementById('communityView').classList.remove('hidden');
    currentView = 'community';
}

function hideAllViews() {
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('cognitiveTestsView').classList.add('hidden');
    document.getElementById('wearablesView').classList.add('hidden');
    document.getElementById('correlationsView').classList.add('hidden');
    document.getElementById('aiCoachView').classList.add('hidden');
    document.getElementById('communityView').classList.add('hidden');
}

// Chart Initialization
function initializeCharts() {
    // Cognitive Performance Chart
    const cognitiveCtx = document.getElementById('cognitiveChart');
    if (cognitiveCtx && cognitiveCtx.getContext) {
        new Chart(cognitiveCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'N-Back Score',
                    data: [85, 87, 88, 92, 90, 93, 92],
                    borderColor: '#00ff9d',
                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Reaction Time',
                    data: [78, 80, 82, 85, 83, 86, 88],
                    borderColor: '#00c6ff',
                    backgroundColor: 'rgba(0, 198, 255, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#f5f5f5' }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }
    
    // Recovery Metrics Chart
    const recoveryCtx = document.getElementById('recoveryChart');
    if (recoveryCtx && recoveryCtx.getContext) {
        new Chart(recoveryCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Sleep', 'HRV', 'RHR', 'Temp', 'Recovery'],
                datasets: [{
                    label: 'Today',
                    data: [86, 72, 90, 78, 82],
                    backgroundColor: '#00ff9d'
                }, {
                    label: '7-Day Avg',
                    data: [82, 68, 88, 76, 79],
                    backgroundColor: '#00c6ff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#f5f5f5' }
                    }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }
}

function initializeWearableCharts() {
    // HRV Chart
    const hrvCtx = document.getElementById('hrvChart');
    if (hrvCtx && hrvCtx.getContext) {
        new Chart(hrvCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: Array.from({length: 30}, (_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'HRV (ms)',
                    data: Array.from({length: 30}, () => Math.floor(Math.random() * 20) + 50),
                    borderColor: '#00ff9d',
                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f5f5f5' } }
                },
                scales: {
                    y: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }
    
    // Sleep Stages Chart
    const sleepCtx = document.getElementById('sleepChart');
    if (sleepCtx && sleepCtx.getContext) {
        new Chart(sleepCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Deep', 'REM', 'Light', 'Awake'],
                datasets: [{
                    data: [22, 25, 48, 5],
                    backgroundColor: ['#00ff9d', '#00c6ff', '#ff9500', '#ff3b30']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f5f5f5' } }
                }
            }
        });
    }
    
    // Activity Zones Chart
    const activityCtx = document.getElementById('activityChart');
    if (activityCtx && activityCtx.getContext) {
        new Chart(activityCtx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5'],
                datasets: [{
                    label: 'Today',
                    data: [20, 45, 25, 8, 2],
                    borderColor: '#00ff9d',
                    backgroundColor: 'rgba(0, 255, 157, 0.2)'
                }, {
                    label: 'Target',
                    data: [15, 50, 25, 10, 0],
                    borderColor: '#00c6ff',
                    backgroundColor: 'rgba(0, 198, 255, 0.1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f5f5f5' } }
                },
                scales: {
                    r: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }
    
    // Recovery Score Chart
    const recoveryScoreCtx = document.getElementById('recoveryScoreChart');
    if (recoveryScoreCtx && recoveryScoreCtx.getContext) {
        new Chart(recoveryScoreCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Recovery Score',
                    data: [72, 68, 75, 82, 79, 86, 84],
                    borderColor: '#00ff9d',
                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f5f5f5' } }
                },
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    },
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#888' }
                    }
                }
            }
        });
    }
}

// Basic Correlations for Tier 2
function initializeBasicCorrelations() {
    const container = document.getElementById('correlationsContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="mb-6 p-4 bg-reset-blue bg-opacity-20 rounded-lg border border-reset-blue">
            <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-info-circle text-reset-blue"></i>
                <h3 class="text-lg font-bold">Basic Correlation Engine</h3>
            </div>
            <p class="text-sm text-primacy-light">Discover patterns between your key metrics. Upgrade to Protocol for advanced context logging and AI insights.</p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Key Performance Correlations</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-bed text-reset-blue"></i>
                            <span>Sleep Duration → Next Day Score</span>
                        </div>
                        <span class="text-apex-green font-bold">+0.72</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-heartbeat text-reset-blue"></i>
                            <span>Resting HR → Cognitive Performance</span>
                        </div>
                        <span class="text-warning-orange font-bold">-0.58</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-running text-reset-blue"></i>
                            <span>Exercise → Sleep Quality</span>
                        </div>
                        <span class="text-apex-green font-bold">+0.64</span>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Weekly Patterns</h3>
                <div class="chart-container" style="height: 250px;">
                    <canvas id="basicCorrelationChart"></canvas>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Simple Correlation Matrix</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-primacy-mid">
                                <th class="p-2 text-left">Metric</th>
                                <th class="p-2 text-center">Sleep</th>
                                <th class="p-2 text-center">HRV</th>
                                <th class="p-2 text-center">Exercise</th>
                                <th class="p-2 text-center">Cognitive</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold">Sleep</td>
                                <td class="p-2 text-center">1.00</td>
                                <td class="p-2 text-center text-apex-green">0.68</td>
                                <td class="p-2 text-center text-apex-green">0.52</td>
                                <td class="p-2 text-center text-apex-green">0.71</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold">HRV</td>
                                <td class="p-2 text-center text-apex-green">0.68</td>
                                <td class="p-2 text-center">1.00</td>
                                <td class="p-2 text-center text-apex-green">0.45</td>
                                <td class="p-2 text-center text-apex-green">0.58</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold">Exercise</td>
                                <td class="p-2 text-center text-apex-green">0.52</td>
                                <td class="p-2 text-center text-apex-green">0.45</td>
                                <td class="p-2 text-center">1.00</td>
                                <td class="p-2 text-center text-warning-orange">0.38</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold">Cognitive</td>
                                <td class="p-2 text-center text-apex-green">0.71</td>
                                <td class="p-2 text-center text-apex-green">0.58</td>
                                <td class="p-2 text-center text-warning-orange">0.38</td>
                                <td class="p-2 text-center">1.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-primacy-light mt-4">
                    <i class="fas fa-lock mr-2"></i>
                    Upgrade to Protocol for advanced correlations with context logging, AI insights, and personalized recommendations.
                </p>
            </div>
        </div>
    `;
    
    // Initialize basic chart
    setTimeout(() => {
        const ctx = document.getElementById('basicCorrelationChart');
        if (ctx && ctx.getContext) {
            new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Sleep Score',
                        data: [75, 82, 78, 85, 73, 88, 84],
                        borderColor: '#0066ff',
                        tension: 0.4
                    }, {
                        label: 'Performance',
                        data: [72, 85, 76, 88, 70, 92, 82],
                        borderColor: '#00ff9d',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#f5f5f5' } }
                    },
                    scales: {
                        y: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        },
                        x: {
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        }
                    }
                }
            });
        }
    }, 100);
}

// Advanced Correlations for Tier 3
function initializeAdvancedCorrelations() {
    const container = document.getElementById('correlationsContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="mb-6 p-4 bg-gradient-to-r from-premium-gold to-warning-orange bg-opacity-20 rounded-lg border border-premium-gold">
            <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-crown text-premium-gold"></i>
                <h3 class="text-lg font-bold">Advanced Correlation Engine with Context Logging</h3>
            </div>
            <p class="text-sm text-primacy-light">AI-powered insights with color-coded physiological system tracking for comprehensive performance optimization.</p>
        </div>
        
        <!-- Context Log Panel -->
        <div class="glass-effect rounded-xl p-6 mb-6">
            <h3 class="text-lg font-bold mb-4">Today's Context Log</h3>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                ${Object.entries(contextCategories).map(([key, cat]) => `
                    <div class="text-center">
                        <div class="text-2xl mb-1">${cat.emoji}</div>
                        <div class="text-xs font-bold">${cat.label}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="border-t border-primacy-mid pt-4">
                <h4 class="text-sm font-bold mb-3">Quick Log Entry</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    ${contextLogItems.map(item => `
                        <button onclick="logContext('${item.id}')" class="p-2 bg-primacy-black rounded-lg hover:bg-primacy-mid transition text-xs flex items-center justify-center space-x-1" style="border-left: 3px solid ${contextCategories[item.category].color}">
                            <i class="fas ${item.icon}"></i>
                            <span>${item.label}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
            
            <div class="mt-4 p-3 bg-primacy-black rounded-lg">
                <h4 class="text-sm font-bold mb-2">Recent Logs</h4>
                <div class="space-y-2" id="recentContextLogs">
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex items-center space-x-2">
                            <span>🟩</span>
                            <span>Strength Training</span>
                        </div>
                        <span class="text-primacy-light">2 hours ago</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex items-center space-x-2">
                            <span>🟥</span>
                            <span>Caffeine Late</span>
                        </div>
                        <span class="text-primacy-light">4 hours ago</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <div class="flex items-center space-x-2">
                            <span>🟦</span>
                            <span>Poor Sleep Quality</span>
                        </div>
                        <span class="text-primacy-light">This morning</span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">System-Based Correlations</h3>
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-bed text-apex-green"></i>
                            <span>Sleep Quality → Cognitive Score</span>
                        </div>
                        <span class="text-apex-green font-bold">+0.84</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-heartbeat text-reset-blue"></i>
                            <span>HRV → Recovery Rate</span>
                        </div>
                        <span class="text-reset-blue font-bold">+0.72</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-dumbbell text-warning-orange"></i>
                            <span>Exercise → Next Day Performance</span>
                        </div>
                        <span class="text-warning-orange font-bold">+0.68</span>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <i class="fas fa-coffee text-danger-red"></i>
                            <span>Caffeine → Sleep Quality</span>
                        </div>
                        <span class="text-danger-red font-bold">-0.42</span>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">AI-Discovered Insights</h3>
                <div class="space-y-4">
                    <div class="p-4 bg-primacy-black rounded-lg border-l-4 border-apex-green">
                        <p class="text-sm mb-2">Your cognitive performance peaks 2-3 hours after waking when preceded by 7+ hours of sleep.</p>
                        <span class="text-xs text-primacy-light">Confidence: 92%</span>
                    </div>
                    <div class="p-4 bg-primacy-black rounded-lg border-l-4 border-reset-blue">
                        <p class="text-sm mb-2">Zone 2 cardio for 30+ minutes correlates with 15% better HRV the following night.</p>
                        <span class="text-xs text-primacy-light">Confidence: 87%</span>
                    </div>
                    <div class="p-4 bg-primacy-black rounded-lg border-l-4 border-warning-orange">
                        <p class="text-sm mb-2">Your reaction times improve by 12% when ambient temperature is between 65-68°F.</p>
                        <span class="text-xs text-primacy-light">Confidence: 79%</span>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Context-Aware Predictions</h3>
                <div class="space-y-3">
                    <div class="p-3 bg-primacy-black rounded-lg border-l-4" style="border-color: #ff3b30">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold">🟥 Metabolic Alert</span>
                            <span class="text-xs text-danger-red">High Impact</span>
                        </div>
                        <p class="text-sm">Late caffeine + poor sleep pattern detected. Expected 18% cognitive decline tomorrow without intervention.</p>
                    </div>
                    
                    <div class="p-3 bg-primacy-black rounded-lg border-l-4" style="border-color: #00ff9d">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold">🟩 Performance Boost</span>
                            <span class="text-xs text-apex-green">Positive Trend</span>
                        </div>
                        <p class="text-sm">Your strength training + recovery day combo shows +15% HRV improvement pattern.</p>
                    </div>
                    
                    <div class="p-3 bg-primacy-black rounded-lg border-l-4" style="border-color: #9b59b6">
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold">🟪 Environmental Factor</span>
                            <span class="text-xs" style="color: #9b59b6">Monitor</span>
                        </div>
                        <p class="text-sm">Cold exposure sessions correlate with 22% faster reaction times within 4 hours.</p>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Physiological System Balance</h3>
                <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                    ${Object.entries(contextCategories).map(([key, cat]) => `
                        <div class="text-center">
                            <div class="relative">
                                <svg class="w-24 h-24 mx-auto">
                                    <circle cx="48" cy="48" r="40" stroke="${cat.color}" stroke-width="8" fill="none" stroke-dasharray="${Math.random() * 150 + 100} 251.2" transform="rotate(-90 48 48)"/>
                                    <circle cx="48" cy="48" r="40" stroke="#2e2e2e" stroke-width="8" fill="none"/>
                                </svg>
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <span class="text-2xl">${cat.emoji}</span>
                                </div>
                            </div>
                            <div class="text-xs mt-2">${cat.label.split(' ')[0]}</div>
                            <div class="text-lg font-bold" style="color: ${cat.color}">${Math.floor(Math.random() * 30 + 60)}%</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="p-4 bg-primacy-black rounded-lg">
                    <h4 class="text-sm font-bold mb-2">Weekly System Load Analysis</h4>
                    <div class="chart-container" style="height: 300px;">
                        <canvas id="systemLoadChart"></canvas>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Advanced Correlation Matrix with Context</h3>
                <div class="chart-container" style="height: 400px;">
                    <canvas id="advancedCorrelationHeatmap"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Initialize advanced charts
    setTimeout(() => {
        // System Load Chart
        const systemLoadCtx = document.getElementById('systemLoadChart');
        if (systemLoadCtx && systemLoadCtx.getContext) {
            new Chart(systemLoadCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [
                        {
                            label: 'Sleep & Recovery',
                            data: [70, 65, 80, 75, 70, 85, 82],
                            backgroundColor: '#0066ff'
                        },
                        {
                            label: 'Physical',
                            data: [85, 40, 90, 45, 80, 30, 40],
                            backgroundColor: '#00ff9d'
                        },
                        {
                            label: 'Cognitive',
                            data: [60, 75, 65, 80, 70, 50, 55],
                            backgroundColor: '#ff9500'
                        },
                        {
                            label: 'Metabolic',
                            data: [55, 60, 50, 65, 70, 80, 75],
                            backgroundColor: '#ff3b30'
                        },
                        {
                            label: 'Environment',
                            data: [40, 45, 60, 50, 45, 35, 40],
                            backgroundColor: '#9b59b6'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            stacked: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            stacked: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        }
                    },
                    plugins: {
                        legend: { labels: { color: '#f5f5f5' } }
                    }
                }
            });
        }
        
        // Advanced Correlation Heatmap
        const heatmapCtx = document.getElementById('advancedCorrelationHeatmap');
        if (heatmapCtx && heatmapCtx.getContext) {
            new Chart(heatmapCtx.getContext('2d'), {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Positive Correlation',
                        data: [
                            {x: 1, y: 2, r: 15},
                            {x: 2, y: 3, r: 12},
                            {x: 3, y: 4, r: 10},
                            {x: 1, y: 4, r: 8}
                        ],
                        backgroundColor: 'rgba(0, 255, 157, 0.6)'
                    }, {
                        label: 'Negative Correlation',
                        data: [
                            {x: 2, y: 1, r: 10},
                            {x: 4, y: 2, r: 8}
                        ],
                        backgroundColor: 'rgba(255, 59, 48, 0.6)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#f5f5f5' } }
                    },
                    scales: {
                        x: {
                            title: { display: true, text: 'Variables', color: '#888' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        },
                        y: {
                            title: { display: true, text: 'Variables', color: '#888' },
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' }
                        }
                    }
                }
            });
        }
    }, 100);
}

// Premium Feature Views
function updateCorrelationsView(tier) {
    const container = document.getElementById('correlationsContent');
    if (!container) return;
    
    if (tier < 2) {
        container.innerHTML = `
            <div class="glass-effect rounded-xl p-12 text-center">
                <i class="fas fa-lock text-6xl text-primacy-light mb-6"></i>
                <h3 class="text-2xl font-bold mb-4">Unlock Correlation Engine</h3>
                <p class="text-primacy-light mb-6 max-w-2xl mx-auto">
                    Discover patterns in your performance data. Basic correlations available with Operator account, 
                    advanced AI-powered analysis with context logging available for Protocol Subscribers.
                </p>
                <button onclick="showTierSelection()" class="px-6 py-3 bg-reset-blue text-primacy-black rounded-lg font-bold hover:opacity-90 transition">
                    <i class="fas fa-user-astronaut mr-2"></i>Sign Up for Operator
                </button>
            </div>
        `;
    }
}

function updateAICoachView(isPremium) {
    const container = document.getElementById('aiCoachContent');
    if (!container) return;
    
    if (isPremium) {
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2">
                    <!-- Chat Interface -->
                    <div class="glass-effect rounded-xl p-6 h-[600px] flex flex-col">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <div class="w-12 h-12 bg-gradient-to-r from-apex-green to-reset-blue rounded-full flex items-center justify-center">
                                    <i class="fas fa-robot text-primacy-black"></i>
                                </div>
                                <div>
                                    <h3 class="font-bold">Kai Mercer</h3>
                                    <p class="text-xs text-apex-green">Online • AI Performance Coach</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex-1 overflow-y-auto space-y-4 mb-4">
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-apex-green to-reset-blue rounded-full flex-shrink-0"></div>
                                <div class="bg-primacy-black rounded-lg p-4 max-w-md">
                                    <p class="text-sm">Good morning! I've analyzed your recent performance data. Your cognitive scores are trending upward, but I noticed your sleep quality dipped last night. This might impact today's performance.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-apex-green to-reset-blue rounded-full flex-shrink-0"></div>
                                <div class="bg-primacy-black rounded-lg p-4 max-w-md">
                                    <p class="text-sm mb-3">Based on your patterns, here are my recommendations for today:</p>
                                    <ul class="text-sm space-y-2">
                                        <li>• Schedule cognitive work between 9-11 AM (your peak window)</li>
                                        <li>• Consider a 20-minute power nap around 2 PM</li>
                                        <li>• Aim for Zone 2 cardio this evening to boost tomorrow's HRV</li>
                                    </ul>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-3 justify-end">
                                <div class="bg-primacy-mid rounded-lg p-4 max-w-md">
                                    <p class="text-sm">What about my nutrition? Any recommendations there?</p>
                                </div>
                                <div class="w-8 h-8 bg-primacy-light rounded-full flex-shrink-0"></div>
                            </div>
                            
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-apex-green to-reset-blue rounded-full flex-shrink-0"></div>
                                <div class="bg-primacy-black rounded-lg p-4 max-w-md">
                                    <p class="text-sm">Great question! Based on your metabolic data and performance goals, consider timing your carbohydrate intake around your workouts. Also, your recovery scores improve when you maintain consistent meal timing. Try to keep your eating window between 8 AM - 6 PM for optimal results.</p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex items-center space-x-3">
                            <input type="text" placeholder="Ask Kai anything..." class="flex-1 bg-primacy-black rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-apex-green">
                            <button class="px-4 py-3 bg-apex-green text-primacy-black rounded-lg hover:opacity-90 transition">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="space-y-6">
                    <!-- AI Insights Panel -->
                    <div class="glass-effect rounded-xl p-6">
                        <h3 class="text-lg font-bold mb-4">Today's Insights</h3>
                        <div class="space-y-3">
                            <div class="p-3 bg-primacy-black rounded-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs text-apex-green">OPPORTUNITY</span>
                                    <i class="fas fa-arrow-up text-apex-green"></i>
                                </div>
                                <p class="text-sm">Your reaction times are 15% faster after cold exposure. Consider morning cold therapy.</p>
                            </div>
                            
                            <div class="p-3 bg-primacy-black rounded-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs text-warning-orange">CAUTION</span>
                                    <i class="fas fa-exclamation-triangle text-warning-orange"></i>
                                </div>
                                <p class="text-sm">Late caffeine consumption yesterday. Limit intake after 2 PM for better sleep.</p>
                            </div>
                            
                            <div class="p-3 bg-primacy-black rounded-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <span class="text-xs text-reset-blue">TREND</span>
                                    <i class="fas fa-chart-line text-reset-blue"></i>
                                </div>
                                <p class="text-sm">3-day positive trend in morning HRV. Your recovery protocol is working!</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions -->
                    <div class="glass-effect rounded-xl p-6">
                        <h3 class="text-lg font-bold mb-4">Quick Actions</h3>
                        <div class="space-y-3">
                            <button class="w-full py-3 bg-primacy-black rounded-lg text-sm hover:bg-primacy-mid transition text-left px-4">
                                <i class="fas fa-calendar-alt mr-3 text-apex-green"></i>
                                Schedule Optimization Session
                            </button>
                            <button class="w-full py-3 bg-primacy-black rounded-lg text-sm hover:bg-primacy-mid transition text-left px-4">
                                <i class="fas fa-chart-bar mr-3 text-reset-blue"></i>
                                Generate Weekly Report
                            </button>
                            <button class="w-full py-3 bg-primacy-black rounded-lg text-sm hover:bg-primacy-mid transition text-left px-4">
                                <i class="fas fa-bullseye mr-3 text-warning-orange"></i>
                                Update Performance Goals
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="glass-effect rounded-xl p-12 text-center">
                <i class="fas fa-lock text-6xl text-primacy-light mb-6"></i>
                <h3 class="text-2xl font-bold mb-4">Meet Kai Mercer - Your AI Performance Coach</h3>
                <p class="text-primacy-light mb-6 max-w-2xl mx-auto">
                    Get personalized coaching based on your unique data patterns. Kai analyzes your performance metrics 
                    and provides actionable insights to help you reach peak performance.
                </p>
                <button onclick="showTierSelection()" class="px-6 py-3 bg-gradient-to-r from-premium-gold to-warning-orange text-primacy-black rounded-lg font-bold hover:glow-premium transition">
                    <i class="fas fa-crown mr-2"></i>Upgrade to Protocol
                </button>
            </div>
        `;
    }
}

function updateCommunityView(isPremium) {
    const container = document.getElementById('communityContent');
    if (!container) return;
    
    if (isPremium) {
        container.innerHTML = `
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Leaderboards -->
                <div class="glass-effect rounded-xl p-6">
                    <h3 class="text-lg font-bold mb-4">Weekly Leaderboard</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-premium-gold font-bold">1</span>
                                <div class="w-8 h-8 bg-gradient-to-r from-premium-gold to-warning-orange rounded-full"></div>
                                <span class="text-sm">AlphaRunner</span>
                            </div>
                            <span class="text-sm font-mono text-apex-green">98.5</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-primacy-light font-bold">2</span>
                                <div class="w-8 h-8 bg-primacy-light rounded-full"></div>
                                <span class="text-sm">NeuralNinja</span>
                            </div>
                            <span class="text-sm font-mono text-apex-green">97.2</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-3">
                                <span class="text-warning-orange font-bold">3</span>
                                <div class="w-8 h-8 bg-warning-orange rounded-full"></div>
                                <span class="text-sm">PeakPerformer</span>
                            </div>
                            <span class="text-sm font-mono text-apex-green">96.8</span>
                        </div>
                        <div class="flex items-center justify-between bg-primacy-black rounded-lg p-2 mt-4">
                            <div class="flex items-center space-x-3">
                                <span class="font-bold">12</span>
                                <div class="w-8 h-8 bg-apex-green rounded-full"></div>
                                <span class="text-sm">You</span>
                            </div>
                            <span class="text-sm font-mono text-apex-green">92.0</span>
                        </div>
                    </div>
                </div>
                
                <!-- Community Challenges -->
                <div class="glass-effect rounded-xl p-6">
                    <h3 class="text-lg font-bold mb-4">Active Challenges</h3>
                    <div class="space-y-4">
                        <div class="p-3 bg-primacy-black rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-sm">30-Day Sleep Optimization</h4>
                                <span class="text-xs text-apex-green">3 days left</span>
                            </div>
                            <div class="w-full bg-primacy-mid rounded-full h-2 mb-2">
                                <div class="bg-apex-green h-2 rounded-full" style="width: 90%"></div>
                            </div>
                            <p class="text-xs text-primacy-light">27/30 days completed</p>
                        </div>
                        
                        <div class="p-3 bg-primacy-black rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <h4 class="font-bold text-sm">N-Back Master</h4>
                                <span class="text-xs text-reset-blue">Weekly</span>
                            </div>
                            <div class="w-full bg-primacy-mid rounded-full h-2 mb-2">
                                <div class="bg-reset-blue h-2 rounded-full" style="width: 65%"></div>
                            </div>
                            <p class="text-xs text-primacy-light">Score 95+ three times</p>
                        </div>
                        
                        <button class="w-full py-2 bg-apex-green text-primacy-black rounded-lg font-bold text-sm hover:opacity-90 transition">
                            View All Challenges
                        </button>
                    </div>
                </div>
                
                <!-- Community Feed -->
                <div class="glass-effect rounded-xl p-6">
                    <h3 class="text-lg font-bold mb-4">Community Feed</h3>
                    <div class="space-y-4">
                        <div class="border-b border-primacy-mid pb-3">
                            <div class="flex items-center space-x-2 mb-2">
                                <div class="w-6 h-6 bg-gradient-to-r from-apex-green to-reset-blue rounded-full"></div>
                                <span class="text-sm font-bold">BiohackPro</span>
                                <span class="text-xs text-primacy-light">2h ago</span>
                            </div>
                            <p class="text-sm text-primacy-light">Just hit a new PR on reaction time: 168ms! Cold plunge before testing really works 🧊</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <button class="text-xs text-primacy-light hover:text-apex-green">
                                    <i class="fas fa-heart mr-1"></i>23
                                </button>
                                <button class="text-xs text-primacy-light hover:text-apex-green">
                                    <i class="fas fa-comment mr-1"></i>8
                                </button>
                            </div>
                        </div>
                        
                        <div class="border-b border-primacy-mid pb-3">
                            <div class="flex items-center space-x-2 mb-2">
                                <div class="w-6 h-6 bg-gradient-to-r from-warning-orange to-danger-red rounded-full"></div>
                                <span class="text-sm font-bold">OptimalSleep</span>
                                <span class="text-xs text-primacy-light">5h ago</span>
                            </div>
                            <p class="text-sm text-primacy-light">New protocol update: Magnesium glycinate + L-theanine = game changer for deep sleep 💤</p>
                            <div class="flex items-center space-x-4 mt-2">
                                <button class="text-xs text-primacy-light hover:text-apex-green">
                                    <i class="fas fa-heart mr-1"></i>45
                                </button>
                                <button class="text-xs text-primacy-light hover:text-apex-green">
                                    <i class="fas fa-comment mr-1"></i>12
                                </button>
                            </div>
                        </div>
                        
                        <button class="w-full py-2 bg-primacy-black rounded-lg text-sm hover:bg-primacy-mid transition">
                            Load More Posts
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="glass-effect rounded-xl p-12 text-center">
                <i class="fas fa-lock text-6xl text-primacy-light mb-6"></i>
                <h3 class="text-2xl font-bold mb-4">Join The Foundry Community</h3>
                <p class="text-primacy-light mb-6 max-w-2xl mx-auto">
                    Connect with elite performers, share protocols, participate in challenges, 
                    and accelerate your optimization journey with a community of like-minded individuals.
                </p>
                <button onclick="showTierSelection()" class="px-6 py-3 bg-gradient-to-r from-premium-gold to-warning-orange text-primacy-black rounded-lg font-bold hover:glow-premium transition">
                    <i class="fas fa-crown mr-2"></i>Upgrade to Protocol
                </button>
            </div>
        `;
    }
}

// Cognitive Test Functions
function startTest(testType) {
    const modal = document.getElementById('testModal');
    const content = document.getElementById('testContent');
    
    // Check tier restrictions
    if (currentTier === 1) {
        // Anonymous users can only access N-Back and Reaction Time
        if (testType !== 'nback' && testType !== 'reaction') {
            alert('This test requires an Operator account or higher. Please sign up to access all cognitive tests.');
            return;
        }
    }
    
    modal.classList.remove('hidden');
    
    // Simulate different test interfaces
    if (testType === 'nback') {
        content.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">N-Back Test</h2>
            <p class="text-primacy-light mb-6">Remember the position of squares that appeared N steps back. Press MATCH when the current position matches the N-back position.</p>
            
            <div class="grid grid-cols-3 gap-2 mb-6 max-w-xs mx-auto">
                ${Array(9).fill('').map((_, i) => `
                    <div id="grid-${i}" class="aspect-square bg-primacy-black rounded-lg transition-all duration-200"></div>
                `).join('')}
            </div>
            
            <div class="text-center mb-6">
                <div class="text-3xl font-mono mb-2">N = <span id="nBackLevel">2</span></div>
                <div class="text-sm text-primacy-light">Score: <span id="nBackScore">0</span>/10</div>
            </div>
            
            <div class="flex space-x-4">
                <button onclick="simulateNBack()" class="flex-1 py-3 bg-apex-green text-primacy-black rounded-lg font-bold hover:opacity-90 transition">
                    Start Test
                </button>
                <button onclick="closeTest()" class="flex-1 py-3 bg-primacy-mid text-white rounded-lg hover:bg-primacy-light transition">
                    Cancel
                </button>
            </div>
        `;
    } else if (testType === 'reaction') {
        content.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Reaction Time Test</h2>
            <p class="text-primacy-light mb-6">Click as fast as possible when the screen turns green.</p>
            
            <div id="reactionArea" class="h-64 bg-primacy-black rounded-lg flex items-center justify-center mb-6 cursor-pointer transition-all duration-100">
                <div class="text-center">
                    <i class="fas fa-hand-pointer text-6xl text-primacy-light mb-4"></i>
                    <p class="text-xl">Click to Start</p>
                </div>
            </div>
            
            <div class="text-center mb-6">
                <div class="text-3xl font-mono">Best: <span id="bestTime">---</span>ms</div>
                <div class="text-sm text-primacy-light mt-2">Average: <span id="avgTime">---</span>ms</div>
            </div>
            
            <button onclick="closeTest()" class="w-full py-3 bg-primacy-mid text-white rounded-lg hover:bg-primacy-light transition">
                Close
            </button>
        `;
        
        // Add reaction test logic
        document.getElementById('reactionArea').addEventListener('click', simulateReactionTest);
    }
}

function simulateNBack() {
    // Placeholder for N-Back test simulation
    let score = 0;
    let round = 0;
    const maxRounds = 10;
    
    const interval = setInterval(() => {
        // Randomly highlight a grid square
        const randomIndex = Math.floor(Math.random() * 9);
        const gridSquares = document.querySelectorAll('[id^="grid-"]');
        
        // Clear previous highlights
        gridSquares.forEach(square => {
            square.classList.remove('bg-apex-green');
            square.classList.add('bg-primacy-black');
        });
        
        // Highlight new square
        gridSquares[randomIndex].classList.remove('bg-primacy-black');
        gridSquares[randomIndex].classList.add('bg-apex-green');
        
        round++;
        
        // Simulate score increase
        if (Math.random() > 0.3) {
            score++;
            document.getElementById('nBackScore').textContent = score;
        }
        
        if (round >= maxRounds) {
            clearInterval(interval);
            setTimeout(() => {
                alert(`Test complete! Your score: ${score}/${maxRounds}`);
                closeTest();
            }, 1000);
        }
    }, 1500);
}

function simulateReactionTest() {
    const area = document.getElementById('reactionArea');
    const states = ['waiting', 'ready', 'go'];
    let currentState = 'waiting';
    let startTime = 0;
    
    if (currentState === 'waiting') {
        area.classList.remove('bg-primacy-black');
        area.classList.add('bg-danger-red');
        area.innerHTML = '<p class="text-2xl font-bold">Wait for green...</p>';
        currentState = 'ready';
        
        // Random delay between 1-4 seconds
        const delay = Math.random() * 3000 + 1000;
        
        setTimeout(() => {
            area.classList.remove('bg-danger-red');
            area.classList.add('bg-apex-green');
            area.innerHTML = '<p class="text-2xl font-bold">CLICK NOW!</p>';
            startTime = Date.now();
            currentState = 'go';
        }, delay);
    } else if (currentState === 'go') {
        const reactionTime = Date.now() - startTime;
        area.classList.remove('bg-apex-green');
        area.classList.add('bg-primacy-black');
        area.innerHTML = `
            <div class="text-center">
                <p class="text-4xl font-bold mb-2">${reactionTime}ms</p>
                <p class="text-primacy-light">Click to try again</p>
            </div>
        `;
        
        // Update best time
        const bestTimeEl = document.getElementById('bestTime');
        const currentBest = bestTimeEl.textContent === '---' ? Infinity : parseInt(bestTimeEl.textContent);
        if (reactionTime < currentBest) {
            bestTimeEl.textContent = reactionTime;
        }
        
        currentState = 'waiting';
    }
}

function closeTest() {
    document.getElementById('testModal').classList.add('hidden');
    document.getElementById('testContent').innerHTML = '';
}

// Context Logging Functions
function logContext(itemId) {
    const item = contextLogItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Add to user's context logs
    const logEntry = {
        id: Date.now(),
        itemId: itemId,
        label: item.label,
        category: item.category,
        emoji: item.emoji,
        timestamp: new Date().toISOString(),
        timeAgo: 'Just now'
    };
    
    userData.contextLogs.unshift(logEntry);
    
    // Update recent logs display
    updateRecentContextLogs();
    
    // Show feedback
    showContextLogFeedback(item);
    
    // Trigger correlation recalculation (simulated)
    setTimeout(() => {
        updateCorrelationInsights(item.category);
    }, 500);
}

function updateRecentContextLogs() {
    const container = document.getElementById('recentContextLogs');
    if (!container) return;
    
    const recentLogs = userData.contextLogs.slice(0, 5);
    container.innerHTML = recentLogs.map(log => `
        <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2">
                <span>${log.emoji}</span>
                <span>${log.label}</span>
            </div>
            <span class="text-primacy-light">${log.timeAgo}</span>
        </div>
    `).join('');
}

function showContextLogFeedback(item) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'fixed bottom-4 right-4 p-4 glass-effect rounded-lg animate-slide-up z-50';
    feedback.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-2xl">${item.emoji}</span>
            <div>
                <div class="font-bold">${item.label} Logged</div>
                <div class="text-xs text-primacy-light">${contextCategories[item.category].label}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(20px)';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

function updateCorrelationInsights(category) {
    // Simulate correlation insight update based on logged context
    const insights = {
        sleep: "Sleep pattern logged. Analyzing impact on tomorrow's cognitive performance...",
        physical: "Physical activity recorded. Calculating recovery needs and HRV impact...",
        cognitive: "Mental state logged. Adjusting performance predictions...",
        metabolic: "Metabolic factor recorded. Updating energy balance correlations...",
        environment: "Environmental factor logged. Assessing physiological adaptation requirements..."
    };
    
    // Could trigger a notification or update UI with new insight
    console.log(insights[category] || "Context logged successfully.");
}

// Initialize charts when DOM is loaded
window.addEventListener('resize', () => {
    // Reinitialize charts on window resize for responsiveness
    if (currentView === 'dashboard') {
        initializeCharts();
    } else if (currentView === 'wearables') {
        initializeWearableCharts();
    }
});