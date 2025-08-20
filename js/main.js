// PRIMACY Protocol Dashboard - Main JavaScript
// Global state management
let currentTier = 0; // 0: Not selected, 1: Anonymous, 2: Operator, 3: Protocol Subscriber
let currentView = 'dashboard';
let userData = {
    cognitiveScores: [],
    wearableData: {},
    correlations: [],
    contextLogs: [],
    basicContextLogs: [],
    protocolLogs: {
        apex: [],
        reset: []
    },
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
    const tierColors = ['', 'bg-primacy-light', 'bg-reset-blue', 'bg-apex-green'];
    
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
    
    // Show context/protocol tracking based on tier
    if (currentTier === 2) {
        initializeBasicContextTracking();
    } else if (currentTier === 3) {
        initializeProtocolTracking();
    }
    
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
    
    // Basic context factors for Tier 2
    const basicContextFactors = [
        { id: 'late-meal-basic', label: 'Late Meal', icon: 'fa-utensils', color: '#ff3b30' },
        { id: 'alcohol-basic', label: 'Alcohol', icon: 'fa-wine-glass', color: '#ff3b30' },
        { id: 'caffeine-late-basic', label: 'Caffeine Late', icon: 'fa-coffee', color: '#ff3b30' },
        { id: 'high-stress-basic', label: 'High Stress Day', icon: 'fa-brain', color: '#ff9500' },
        { id: 'travel-basic', label: 'Travel', icon: 'fa-plane', color: '#9b59b6' }
    ];
    
    container.innerHTML = `
        <div class="mb-6 p-4 bg-reset-blue bg-opacity-20 rounded-lg border border-reset-blue">
            <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-info-circle text-reset-blue"></i>
                <h3 class="text-lg font-bold">Basic Correlation Engine</h3>
            </div>
            <p class="text-sm text-primacy-light">Analyzes patterns between your 5 tracked context factors and performance metrics.</p>
            <p class="text-xs text-reset-blue mt-2">
                <i class="fas fa-info-circle mr-1"></i>
                Log your daily context from the Dashboard tab
            </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Context-Based Discoveries</h3>
                <div class="space-y-4">
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-utensils text-danger-red"></i>
                                <span class="text-sm font-bold">Late Meal Impact</span>
                            </div>
                            <span class="text-xs text-danger-red">-15% Sleep</span>
                        </div>
                        <p class="text-xs text-primacy-light">When logged, next day cognitive scores drop 10% on average</p>
                    </div>
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-wine-glass text-danger-red"></i>
                                <span class="text-sm font-bold">Alcohol Effect</span>
                            </div>
                            <span class="text-xs text-danger-red">-22% HRV</span>
                        </div>
                        <p class="text-xs text-primacy-light">Reduces deep sleep by 25% and affects recovery for 48 hours</p>
                    </div>
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-coffee text-warning-orange"></i>
                                <span class="text-sm font-bold">Late Caffeine</span>
                            </div>
                            <span class="text-xs text-warning-orange">-18% Deep Sleep</span>
                        </div>
                        <p class="text-xs text-primacy-light">Delays sleep onset by 45 min when consumed after 2 PM</p>
                    </div>
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-brain text-warning-orange"></i>
                                <span class="text-sm font-bold">High Stress</span>
                            </div>
                            <span class="text-xs text-warning-orange">-12% Performance</span>
                        </div>
                        <p class="text-xs text-primacy-light">Correlates with 20% more awakenings during sleep</p>
                    </div>
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-plane text-primacy-light"></i>
                                <span class="text-sm font-bold">Travel Days</span>
                            </div>
                            <span class="text-xs text-warning-orange">Variable Impact</span>
                        </div>
                        <p class="text-xs text-primacy-light">Recovery metrics decline 30% for 2-3 days post-travel</p>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Impact Over Time</h3>
                <div class="chart-container" style="height: 250px;">
                    <canvas id="basicCorrelationChart"></canvas>
                </div>
                <p class="text-xs text-primacy-light mt-3">Shows how logged factors affected your metrics this week</p>
            </div>
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Context Factor Impact Matrix</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-primacy-mid">
                                <th class="p-2 text-left">Context Factor</th>
                                <th class="p-2 text-center">Sleep Quality</th>
                                <th class="p-2 text-center">HRV</th>
                                <th class="p-2 text-center">Cognitive</th>
                                <th class="p-2 text-center">Energy</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-utensils mr-2"></i>Late Meal</td>
                                <td class="p-2 text-center text-danger-red">-15%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                                <td class="p-2 text-center text-danger-red">-12%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-wine-glass mr-2"></i>Alcohol</td>
                                <td class="p-2 text-center text-danger-red">-25%</td>
                                <td class="p-2 text-center text-danger-red">-22%</td>
                                <td class="p-2 text-center text-danger-red">-18%</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-coffee mr-2"></i>Caffeine Late</td>
                                <td class="p-2 text-center text-danger-red">-18%</td>
                                <td class="p-2 text-center text-warning-orange">-5%</td>
                                <td class="p-2 text-center text-primacy-light">+5%*</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-brain mr-2"></i>High Stress</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                                <td class="p-2 text-center text-danger-red">-15%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-danger-red">-20%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-plane mr-2"></i>Travel</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                                <td class="p-2 text-center text-warning-orange">-5%</td>
                                <td class="p-2 text-center text-danger-red">-15%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p class="text-xs text-primacy-light mt-3">*Short-term boost, but negative impact on next-day performance</p>
                <div class="mt-4 p-3 bg-primacy-black rounded-lg">
                    <p class="text-xs text-primacy-light">
                        <i class="fas fa-sparkles text-apex-green mr-2"></i>
                        <strong>Want deeper insights?</strong> Upgrade to Protocol for 18+ context factors, AI-powered pattern discovery, 
                        and personalized recommendations based on your unique response patterns.
                    </p>
                </div>
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
                        label: 'Performance (No Context)',
                        data: [75, 82, 78, 85, 73, 88, 84],
                        borderColor: '#888888',
                        borderDash: [5, 5],
                        tension: 0.4
                    }, {
                        label: 'Performance (With Context)',
                        data: [75, 70, 78, 85, 65, 88, 84],
                        borderColor: '#00ff9d',
                        tension: 0.4
                    }, {
                        label: 'Context Factors Logged',
                        data: [0, 2, 0, 0, 3, 0, 1],
                        borderColor: '#ff3b30',
                        backgroundColor: 'rgba(255, 59, 48, 0.1)',
                        yAxisID: 'y1',
                        type: 'bar'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: { labels: { color: '#f5f5f5' } },
                        tooltip: {
                            callbacks: {
                                afterLabel: function(context) {
                                    if (context.datasetIndex === 2) {
                                        const factors = [
                                            [],
                                            ['Late Meal', 'Alcohol'],
                                            [],
                                            [],
                                            ['Caffeine Late', 'High Stress', 'Travel'],
                                            [],
                                            ['Late Meal']
                                        ];
                                        const day = context.dataIndex;
                                        return factors[day].length ? 'Logged: ' + factors[day].join(', ') : '';
                                    }
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' },
                            title: { display: true, text: 'Performance Score', color: '#888' }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: '#888' },
                            title: { display: true, text: 'Context Factors', color: '#888' }
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
        <div class="mb-6 p-4 bg-primacy-mid rounded-lg border border-primacy-light">
            <div class="flex items-center space-x-2 mb-2">
                <i class="fas fa-crown text-primacy-white"></i>
                <h3 class="text-lg font-bold">Advanced Correlation Engine</h3>
            </div>
            <p class="text-sm text-primacy-light">AI-powered analysis explains your performance patterns based on logged context and protocol data.</p>
            <p class="text-xs text-apex-green mt-2">
                <i class="fas fa-info-circle mr-1"></i>
                Log your daily context and protocols from the Dashboard tab
            </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Context-Based Explanations</h3>
                <div class="space-y-3">
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-flask text-apex-green"></i>
                                <span class="text-sm font-bold">Protocol Timing Impact</span>
                            </div>
                        </div>
                        <p class="text-xs text-primacy-light">APEX at 8 AM correlates with +15% cognitive scores 2-4 hours post-dose. RESET at 9 PM shows optimal sleep architecture improvement.</p>
                        <div class="text-xs mt-2 text-apex-green">
                            Based on 32 APEX doses, 28 RESET doses tracked
                        </div>
                    </div>
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-utensils text-danger-red"></i>
                                <span class="text-sm font-bold">Why your sleep score dropped</span>
                            </div>
                        </div>
                        <p class="text-xs text-primacy-light">Late Meal logged at 9 PM typically reduces your deep sleep by 18%. Last night: 1.2h deep sleep vs 1.5h average.</p>
                        <div class="text-xs mt-2 text-apex-green">
                            AI Recommendation: Finish eating by 7 PM for optimal recovery
                        </div>
                    </div>
                    
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-dumbbell text-apex-green"></i>
                                <span class="text-sm font-bold">Why your HRV improved</span>
                            </div>
                        </div>
                        <p class="text-xs text-primacy-light">Strength Training + Cold Exposure combo yesterday. This pattern consistently boosts your HRV by 10-15ms.</p>
                        <div class="text-xs mt-2 text-apex-green">
                            Pattern detected 23 times with 91% consistency
                        </div>
                    </div>
                    
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-brain text-warning-orange"></i>
                                <span class="text-sm font-bold">Why cognitive scores varied</span>
                            </div>
                        </div>
                        <p class="text-xs text-primacy-light">High Stress + Travel logged this week. This combination typically reduces your reaction time by 15% for 48-72 hours.</p>
                        <div class="text-xs mt-2 text-apex-green">
                            AI Recommendation: Prioritize recovery protocols
                        </div>
                    </div>
                    
                    <div class="p-3 bg-primacy-black rounded-lg">
                        <div class="flex items-center justify-between mb-2">
                            <div class="flex items-center space-x-2">
                                <i class="fas fa-snowflake text-reset-blue"></i>
                                <span class="text-sm font-bold">Positive discovery</span>
                            </div>
                        </div>
                        <p class="text-xs text-primacy-light">Cold Exposure before cognitive tests improves your scores by 8%. Effect lasts 2-3 hours based on 15 instances.</p>
                    </div>
                </div>
            </div>
            
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Performance Trends</h3>
                <div class="chart-container" style="height: 250px;">
                    <canvas id="advancedCorrelationChart"></canvas>
                </div>
                <p class="text-xs text-primacy-light mt-3">Your actual performance data with AI explanations for variations</p>
            </div>
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Complete Context Factor Impact Matrix</h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-primacy-mid">
                                <th class="p-2 text-left">Context Factor</th>
                                <th class="p-2 text-center">Sleep</th>
                                <th class="p-2 text-center">HRV</th>
                                <th class="p-2 text-center">Cognitive</th>
                                <th class="p-2 text-center">Energy</th>
                                <th class="p-2 text-center">Recovery</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Negative Factors -->
                            <tr class="border-b border-primacy-mid bg-primacy-black bg-opacity-50">
                                <td colspan="6" class="p-2 text-xs font-bold text-danger-red">Negative Impact Factors</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-utensils mr-2"></i>Late Meal</td>
                                <td class="p-2 text-center text-danger-red">-18%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                                <td class="p-2 text-center text-danger-red">-15%</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-wine-glass mr-2"></i>Alcohol</td>
                                <td class="p-2 text-center text-danger-red">-28%</td>
                                <td class="p-2 text-center text-danger-red">-25%</td>
                                <td class="p-2 text-center text-danger-red">-20%</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                                <td class="p-2 text-center text-danger-red">-35%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-coffee mr-2"></i>Caffeine Late</td>
                                <td class="p-2 text-center text-danger-red">-22%</td>
                                <td class="p-2 text-center text-warning-orange">-5%</td>
                                <td class="p-2 text-center text-primacy-light">+8%*</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-tint-slash mr-2"></i>Low Hydration</td>
                                <td class="p-2 text-center text-warning-orange">-5%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-danger-red">-15%</td>
                                <td class="p-2 text-center text-danger-red">-20%</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-brain mr-2"></i>High Stress</td>
                                <td class="p-2 text-center text-warning-orange">-15%</td>
                                <td class="p-2 text-center text-danger-red">-18%</td>
                                <td class="p-2 text-center text-warning-orange">-10%</td>
                                <td class="p-2 text-center text-danger-red">-25%</td>
                                <td class="p-2 text-center text-danger-red">-20%</td>
                            </tr>
                            
                            <!-- Positive Factors -->
                            <tr class="border-b border-primacy-mid bg-primacy-black bg-opacity-50">
                                <td colspan="6" class="p-2 text-xs font-bold text-apex-green">Positive Impact Factors</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-fire mr-2"></i>HIIT Workout</td>
                                <td class="p-2 text-center text-warning-orange">-5%*</td>
                                <td class="p-2 text-center text-apex-green">+12%**</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                                <td class="p-2 text-center text-apex-green">+15%</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-dumbbell mr-2"></i>Strength Training</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                                <td class="p-2 text-center text-apex-green">+5%</td>
                                <td class="p-2 text-center text-apex-green">+10%</td>
                                <td class="p-2 text-center text-apex-green">+5%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-spa mr-2"></i>Recovery Day</td>
                                <td class="p-2 text-center text-apex-green">+10%</td>
                                <td class="p-2 text-center text-apex-green">+15%</td>
                                <td class="p-2 text-center text-apex-green">+5%</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                                <td class="p-2 text-center text-apex-green">+20%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-snowflake mr-2"></i>Cold Exposure</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-apex-green">+10%</td>
                                <td class="p-2 text-center text-apex-green">+12%</td>
                                <td class="p-2 text-center text-apex-green">+18%</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-temperature-high mr-2"></i>Sauna</td>
                                <td class="p-2 text-center text-apex-green">+12%</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-warning-orange">-5%*</td>
                                <td class="p-2 text-center text-apex-green">+15%</td>
                            </tr>
                            
                            <!-- Variable Factors -->
                            <tr class="border-b border-primacy-mid bg-primacy-black bg-opacity-50">
                                <td colspan="6" class="p-2 text-xs font-bold text-primacy-light">Variable Impact Factors</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-plane mr-2"></i>Travel</td>
                                <td class="p-2 text-center text-warning-orange">-12%</td>
                                <td class="p-2 text-center text-warning-orange">-15%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-danger-red">-18%</td>
                                <td class="p-2 text-center text-danger-red">-25%</td>
                            </tr>
                            
                            <!-- Protocol Timing Impact -->
                            <tr class="border-b border-primacy-mid bg-primacy-black bg-opacity-50">
                                <td colspan="6" class="p-2 text-xs font-bold text-primacy-white">
                                    <i class="fas fa-flask mr-2"></i>Protocol Timing Impact (Optimal Windows)
                                </td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-bolt mr-2"></i>APEX (6-9 AM)</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-apex-green">+5%</td>
                                <td class="p-2 text-center text-apex-green">+15%</td>
                                <td class="p-2 text-center text-apex-green">+20%</td>
                                <td class="p-2 text-center text-apex-green">+8%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-bolt mr-2"></i>APEX (12-3 PM)</td>
                                <td class="p-2 text-center text-warning-orange">-5%*</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-apex-green">+10%</td>
                                <td class="p-2 text-center text-apex-green">+12%</td>
                                <td class="p-2 text-center text-apex-green">+5%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-moon mr-2"></i>RESET (8-10 PM)</td>
                                <td class="p-2 text-center text-apex-green">+18%</td>
                                <td class="p-2 text-center text-apex-green">+12%</td>
                                <td class="p-2 text-center text-apex-green">+8%**</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-apex-green">+15%</td>
                            </tr>
                            <tr class="border-b border-primacy-mid">
                                <td class="p-2 font-bold"><i class="fas fa-moon mr-2"></i>RESET (Too Early <6 PM)</td>
                                <td class="p-2 text-center text-warning-orange">+5%</td>
                                <td class="p-2 text-center text-primacy-light">±0%</td>
                                <td class="p-2 text-center text-warning-orange">-5%</td>
                                <td class="p-2 text-center text-warning-orange">-8%</td>
                                <td class="p-2 text-center text-primacy-light">+3%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <p class="text-xs text-primacy-light">* Short-term effect, reverses within 24h</p>
                    <p class="text-xs text-primacy-light">** Delayed positive effect after 24-48h</p>
                </div>
                <div class="mt-4 p-3 bg-primacy-mid rounded-lg">
                    <p class="text-xs">
                        <i class="fas fa-crown text-primacy-white mr-2"></i>
                        <strong>Remember:</strong> These percentages show typical impact on YOUR performance based on YOUR data. 
                        Context helps explain why metrics changed, but the performance data itself comes from your wearables and cognitive tests.
                    </p>
                </div>
            </div>

        </div>
    `;
    
    // Initialize advanced charts
    setTimeout(() => {
        // Performance trend chart with context explanations
        const trendCtx = document.getElementById('advancedCorrelationChart');
        if (trendCtx && trendCtx.getContext) {
            new Chart(trendCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Cognitive Score (Actual)',
                        data: [88, 72, 85, 90, 68, 92, 86],
                        borderColor: '#00ff9d',
                        backgroundColor: 'rgba(0, 255, 157, 0.1)',
                        tension: 0.4,
                        pointStyle: function(context) {
                            // Show special marker if APEX was taken that day
                            const apexDays = [true, false, false, true, false, true, false];
                            return apexDays[context.dataIndex] ? 'rectRot' : 'circle';
                        },
                        pointRadius: function(context) {
                            const apexDays = [true, false, false, true, false, true, false];
                            return apexDays[context.dataIndex] ? 8 : 4;
                        }
                    }, {
                        label: 'HRV (Actual)',
                        data: [58, 48, 55, 62, 45, 65, 60],
                        borderColor: '#00c6ff',
                        backgroundColor: 'rgba(0, 198, 255, 0.1)',
                        yAxisID: 'y1',
                        tension: 0.4,
                        pointStyle: function(context) {
                            // Show special marker if RESET was taken that day
                            const resetDays = [true, true, false, false, true, false, true];
                            return resetDays[context.dataIndex] ? 'rectRot' : 'circle';
                        },
                        pointRadius: function(context) {
                            const resetDays = [true, true, false, false, true, false, true];
                            return resetDays[context.dataIndex] ? 8 : 4;
                        }
                    }, {
                        label: 'Context Factors Logged',
                        data: [1, 3, 0, 0, 5, 0, 2],
                        type: 'bar',
                        backgroundColor: 'rgba(155, 89, 182, 0.3)',
                        borderColor: '#9b59b6',
                        yAxisID: 'y2'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: { labels: { color: '#f5f5f5' } },
                        tooltip: {
                            callbacks: {
                                afterLabel: function(context) {
                                    const results = [];
                                    
                                    // Protocol information
                                    const protocols = [
                                        { apex: '8:00 AM', reset: '9:30 PM' },
                                        { apex: null, reset: '10:00 PM' },
                                        { apex: null, reset: null },
                                        { apex: '7:30 AM', reset: null },
                                        { apex: null, reset: '9:00 PM' },
                                        { apex: '8:30 AM', reset: null },
                                        { apex: null, reset: '10:30 PM' }
                                    ];
                                    
                                    const dayProtocol = protocols[context.dataIndex];
                                    if (dayProtocol.apex) results.push(`APEX: ${dayProtocol.apex}`);
                                    if (dayProtocol.reset) results.push(`RESET: ${dayProtocol.reset}`);
                                    
                                    if (context.datasetIndex === 0) { // Cognitive Score
                                        const explanations = [
                                            'APEX at optimal time (+15% boost observed)',
                                            'Drop explained by: Late Meal + Alcohol (-16%)',
                                            'Recovering from Tuesday factors',
                                            'APEX boost + good sleep = peak performance',
                                            'Major drop despite RESET: High Stress + Travel override',
                                            'APEX timing perfect, Cold Exposure synergy',
                                            'RESET helped sleep but Late Meal impact remains'
                                        ];
                                        results.push(explanations[context.dataIndex]);
                                    }
                                    
                                    if (context.datasetIndex === 1) { // HRV
                                        const explanations = [
                                            'RESET improved recovery (+12ms vs baseline)',
                                            'RESET partially offset alcohol impact',
                                            'No protocols - natural recovery',
                                            'Morning APEX shows delayed HRV benefit',
                                            'RESET couldn\'t overcome stress factors',
                                            'Excellent recovery without RESET',
                                            'RESET maintained good HRV despite late meal'
                                        ];
                                        results.push(explanations[context.dataIndex]);
                                    }
                                    
                                    if (context.datasetIndex === 2) { // Context factors
                                        const factors = [
                                            ['Recovery Day'],
                                            ['Late Meal', 'Alcohol', 'High Stress'],
                                            [],
                                            [],
                                            ['High Stress', 'Travel', 'Caffeine Late', 'Low Hydration', 'Late Meal'],
                                            [],
                                            ['Late Meal', 'Caffeine Late']
                                        ];
                                        const day = context.dataIndex;
                                        if (factors[day].length) {
                                            results.push('Context: ' + factors[day].join(', '));
                                        }
                                    }
                                    
                                    return results;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#888' },
                            title: { display: true, text: 'Cognitive Score', color: '#888' }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            grid: { drawOnChartArea: false },
                            ticks: { color: '#888' },
                            title: { display: true, text: 'HRV (ms)', color: '#888' }
                        },
                        y2: {
                            type: 'linear',
                            display: false,
                            max: 10,
                            grid: { drawOnChartArea: false }
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
                                    <p class="text-sm">Good morning! I've analyzed your biometric data along with the context you've been logging. The combination gives me a much clearer picture of your performance patterns.</p>
                                </div>
                            </div>
                            
                            <div class="flex items-start space-x-3">
                                <div class="w-8 h-8 bg-gradient-to-r from-apex-green to-reset-blue rounded-full flex-shrink-0"></div>
                                <div class="bg-primacy-black rounded-lg p-4 max-w-md">
                                    <p class="text-sm mb-3">Based on your logged context (Late Meal 🟥, Poor Sleep 🟦) combined with your HRV data, here's what I recommend:</p>
                                    <ul class="text-sm space-y-2">
                                        <li>• Delay intensive cognitive work until after 10 AM (your recovery is still ongoing)</li>
                                        <li>• Prioritize hydration - your metabolic markers suggest dehydration</li>
                                        <li>• Keep today's training light - your body needs recovery more than stress</li>
                                    </ul>
                                    <div class="mt-3 p-2 bg-primacy-mid rounded text-xs">
                                        <i class="fas fa-lightbulb text-warning-orange mr-1"></i>
                                        Insight: When you log "Late Meal", your next day's performance drops 12% on average
                                    </div>
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
                <button onclick="showTierSelection()" class="px-6 py-3 bg-apex-green text-primacy-black rounded-lg font-bold hover:opacity-90 transition">
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
                                <span class="text-apex-green font-bold">1</span>
                                <div class="w-8 h-8 bg-apex-green rounded-full"></div>
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
                <button onclick="showTierSelection()" class="px-6 py-3 bg-apex-green text-primacy-black rounded-lg font-bold hover:opacity-90 transition">
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

// Basic Context Logging for Tier 2
function logBasicContext(itemId) {
    // Get today's date
    const today = new Date().toDateString();
    
    // Check if already logged today
    if (!userData.basicContextLogs) {
        userData.basicContextLogs = [];
    }
    
    const todayLogs = userData.basicContextLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
    );
    
    if (todayLogs.find(log => log.itemId === itemId)) {
        // Already logged
        showBasicContextFeedback(itemId, true);
        return;
    }
    
    // Add to logs
    userData.basicContextLogs.push({
        itemId: itemId,
        timestamp: new Date().toISOString()
    });
    
    // Update display
    updateBasicContextDisplay();
    showBasicContextFeedback(itemId, false);
}

function updateBasicContextDisplay() {
    const container = document.getElementById('basicContextLogs');
    const counter = document.getElementById('basicContextCount');
    if (!container) return;
    
    const today = new Date().toDateString();
    const todayLogs = userData.basicContextLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
    );
    
    if (counter) {
        counter.textContent = `${todayLogs.length} logged`;
    }
    
    if (todayLogs.length === 0) {
        container.innerHTML = '<em>No factors logged yet today</em>';
        return;
    }
    
    const factorMap = {
        'late-meal-basic': 'Late Meal',
        'alcohol-basic': 'Alcohol',
        'caffeine-late-basic': 'Caffeine Late',
        'high-stress-basic': 'High Stress Day',
        'travel-basic': 'Travel'
    };
    
    container.innerHTML = todayLogs.map(log => factorMap[log.itemId]).join(', ');
}

function showBasicContextFeedback(itemId, alreadyLogged) {
    const factorMap = {
        'late-meal-basic': 'Late Meal',
        'alcohol-basic': 'Alcohol',
        'caffeine-late-basic': 'Caffeine Late',
        'high-stress-basic': 'High Stress Day',
        'travel-basic': 'Travel'
    };
    
    const feedback = document.createElement('div');
    feedback.className = 'fixed bottom-4 right-4 p-4 glass-effect rounded-lg animate-slide-up z-50';
    
    if (alreadyLogged) {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle text-2xl text-primacy-light"></i>
                <div>
                    <div class="font-bold">${factorMap[itemId]}</div>
                    <div class="text-xs text-primacy-light">Already logged today</div>
                </div>
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle text-2xl text-reset-blue"></i>
                <div>
                    <div class="font-bold">Context Logged</div>
                    <div class="text-xs text-reset-blue">${factorMap[itemId]} added to analysis</div>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(20px)';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

// Initialize Basic Context Tracking in Dashboard for Tier 2
function initializeBasicContextTracking() {
    const container = document.getElementById('protocolTracking');
    if (!container) return;
    
    const basicContextFactors = [
        { id: 'late-meal-basic', label: 'Late Meal', icon: 'fa-utensils', color: '#ff3b30' },
        { id: 'alcohol-basic', label: 'Alcohol', icon: 'fa-wine-glass', color: '#ff3b30' },
        { id: 'caffeine-late-basic', label: 'Caffeine Late', icon: 'fa-coffee', color: '#ff3b30' },
        { id: 'high-stress-basic', label: 'High Stress Day', icon: 'fa-brain', color: '#ff9500' },
        { id: 'travel-basic', label: 'Travel', icon: 'fa-plane', color: '#9b59b6' }
    ];
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <!-- Basic Context Logging -->
        <div class="glass-effect rounded-xl p-6 mb-6">
            <h3 class="text-lg font-bold mb-4">Log Today's Context</h3>
            <p class="text-xs text-primacy-light mb-4">Track 5 key factors to improve correlation accuracy:</p>
            <div class="grid grid-cols-2 md:grid-cols-5 gap-3">
                ${basicContextFactors.map(factor => `
                    <button onclick="logBasicContext('${factor.id}')" class="p-3 bg-primacy-black rounded-lg hover:bg-primacy-mid transition flex flex-col items-center space-y-2 border-l-4" style="border-color: ${factor.color}">
                        <i class="fas ${factor.icon} text-xl"></i>
                        <span class="text-xs">${factor.label}</span>
                    </button>
                `).join('')}
            </div>
            <div class="mt-4 p-3 bg-primacy-black rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-bold">Today's Logged Factors</span>
                    <span class="text-xs text-reset-blue" id="basicContextCount">0 logged</span>
                </div>
                <div id="basicContextLogs" class="text-xs text-primacy-light">
                    <em>No factors logged yet today</em>
                </div>
            </div>
            <div class="mt-3 p-3 bg-reset-blue bg-opacity-20 rounded-lg">
                <p class="text-xs">
                    <i class="fas fa-crown mr-1"></i>
                    <strong>Upgrade to Protocol</strong> for 18+ context factors and supplement protocol tracking
                </p>
            </div>
        </div>
    `;
    
    // Initialize display
    updateBasicContextDisplay();
}

// Initialize Protocol Tracking in Dashboard for Tier 3
function initializeProtocolTracking() {
    const container = document.getElementById('protocolTracking');
    if (!container) return;
    
    container.classList.remove('hidden');
    container.innerHTML = `
        <!-- APEX and RESET Protocol Logging -->
        <div class="glass-effect rounded-xl p-6 mb-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">Protocol Tracking</h3>
                <span class="text-xs text-primacy-light">
                    <i class="fas fa-flask mr-1"></i>
                    Track supplement timing for correlation analysis
                </span>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                <!-- APEX Protocol -->
                <div class="p-4 bg-primacy-black rounded-lg border border-apex-green">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-apex-green rounded-full flex items-center justify-center">
                                <i class="fas fa-bolt text-primacy-black text-sm"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm">APEX Protocol</h4>
                                <p class="text-xs text-primacy-light">Performance Enhancement</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <input type="date" id="apexDate" class="flex-1 bg-primacy-black rounded px-2 py-1 text-xs" value="${new Date().toISOString().split('T')[0]}">
                            <input type="time" id="apexTime" class="bg-primacy-black rounded px-2 py-1 text-xs" value="${new Date().toTimeString().slice(0,5)}">
                        </div>
                        <button onclick="logProtocol('apex')" class="w-full py-2 bg-apex-green text-primacy-black rounded text-xs font-bold hover:opacity-90 transition">
                            <i class="fas fa-plus mr-1"></i>Log APEX Dose
                        </button>
                    </div>
                    
                    <div class="mt-3 pt-3 border-t border-primacy-mid">
                        <p class="text-xs text-primacy-light mb-2">Recent APEX Doses:</p>
                        <div id="recentApexLogs" class="space-y-1 text-xs">
                            <span class="text-primacy-light italic">No doses logged yet</span>
                        </div>
                    </div>
                </div>
                
                <!-- RESET Protocol -->
                <div class="p-4 bg-primacy-black rounded-lg border border-reset-blue">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center space-x-2">
                            <div class="w-8 h-8 bg-reset-blue rounded-full flex items-center justify-center">
                                <i class="fas fa-moon text-primacy-black text-sm"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-sm">RESET Protocol</h4>
                                <p class="text-xs text-primacy-light">Recovery & Sleep Support</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-2">
                        <div class="flex items-center space-x-2">
                            <input type="date" id="resetDate" class="flex-1 bg-primacy-black rounded px-2 py-1 text-xs" value="${new Date().toISOString().split('T')[0]}">
                            <input type="time" id="resetTime" class="bg-primacy-black rounded px-2 py-1 text-xs" value="${new Date().toTimeString().slice(0,5)}">
                        </div>
                        <button onclick="logProtocol('reset')" class="w-full py-2 bg-reset-blue text-primacy-black rounded text-xs font-bold hover:opacity-90 transition">
                            <i class="fas fa-plus mr-1"></i>Log RESET Dose
                        </button>
                    </div>
                    
                    <div class="mt-3 pt-3 border-t border-primacy-mid">
                        <p class="text-xs text-primacy-light mb-2">Recent RESET Doses:</p>
                        <div id="recentResetLogs" class="space-y-1 text-xs">
                            <span class="text-primacy-light italic">No doses logged yet</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="p-3 bg-primacy-black rounded-lg">
                <p class="text-xs text-primacy-light">
                    <i class="fas fa-info-circle text-reset-blue mr-2"></i>
                    <strong>Tip:</strong> You can log past doses by changing the date/time. The AI will analyze protocol timing 
                    correlations with your performance metrics to optimize dosing schedules.
                </p>
            </div>
        </div>
        
        <!-- Context Logging -->
        <div class="glass-effect rounded-xl p-6 mb-6">
            <h3 class="text-lg font-bold mb-4">Log Today's Context</h3>
            <div class="mb-3 p-3 bg-primacy-black rounded-lg">
                <p class="text-xs text-primacy-light">
                    <i class="fas fa-info-circle text-reset-blue mr-2"></i>
                    Log relevant daily factors to help the AI understand what influences your performance.
                </p>
            </div>
            
            <p class="text-xs text-primacy-light mb-4">Select all factors that apply today:</p>
            
            <!-- All context factors in a grid -->
            <div class="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                ${contextLogItems.map(item => `
                    <button onclick="logContext('${item.id}')" class="p-3 bg-primacy-black rounded-lg hover:bg-primacy-mid transition flex flex-col items-center space-y-2 text-xs border-l-4" style="border-color: ${contextCategories[item.category].color}">
                        <i class="fas ${item.icon} text-lg"></i>
                        <span class="text-center">${item.label}</span>
                    </button>
                `).join('')}
            </div>
            
            <div class="mt-4 p-3 bg-primacy-black rounded-lg">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-bold">Today's Logged Factors</span>
                    <span class="text-xs text-apex-green" id="contextCount">0 logged</span>
                </div>
                <div id="todayContextLogs" class="text-xs text-primacy-light">
                    <em>No factors logged yet today</em>
                </div>
            </div>
        </div>
    `;
    
    // Initialize displays
    updateProtocolDisplay('apex');
    updateProtocolDisplay('reset');
    updateTodayContextLogs();
}

// Protocol Logging Functions for Tier 3
function logProtocol(type) {
    // Get date and time inputs
    const dateInput = document.getElementById(`${type}Date`);
    const timeInput = document.getElementById(`${type}Time`);
    
    if (!dateInput || !timeInput) return;
    
    const date = dateInput.value;
    const time = timeInput.value;
    
    if (!date || !time) {
        alert('Please select both date and time for the protocol dose.');
        return;
    }
    
    // Create timestamp from date and time
    const timestamp = new Date(`${date}T${time}`).toISOString();
    
    // Check if this exact timestamp already exists
    const exists = userData.protocolLogs[type].some(log => log.timestamp === timestamp);
    if (exists) {
        showProtocolFeedback(type, true);
        return;
    }
    
    // Add to protocol logs
    const logEntry = {
        id: Date.now(),
        type: type,
        timestamp: timestamp,
        date: date,
        time: time,
        loggedAt: new Date().toISOString()
    };
    
    userData.protocolLogs[type].unshift(logEntry);
    
    // Sort by timestamp (most recent first)
    userData.protocolLogs[type].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Update display
    updateProtocolDisplay(type);
    showProtocolFeedback(type, false);
    
    // Trigger AI analysis
    analyzeProtocolTiming(type, timestamp);
}

function updateProtocolDisplay(type) {
    const container = document.getElementById(`recent${type.charAt(0).toUpperCase() + type.slice(1)}Logs`);
    if (!container) return;
    
    const recentLogs = userData.protocolLogs[type].slice(0, 5);
    
    if (recentLogs.length === 0) {
        container.innerHTML = '<span class="text-primacy-light italic">No doses logged yet</span>';
        return;
    }
    
    container.innerHTML = recentLogs.map(log => {
        const logDate = new Date(log.timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateStr;
        if (logDate.toDateString() === today.toDateString()) {
            dateStr = 'Today';
        } else if (logDate.toDateString() === yesterday.toDateString()) {
            dateStr = 'Yesterday';
        } else {
            dateStr = logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        
        const timeStr = logDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
        const color = type === 'apex' ? 'text-apex-green' : 'text-reset-blue';
        
        return `
            <div class="flex items-center justify-between">
                <span>${dateStr} at ${timeStr}</span>
                <i class="fas fa-check-circle ${color}"></i>
            </div>
        `;
    }).join('');
}

function showProtocolFeedback(type, alreadyLogged) {
    const feedback = document.createElement('div');
    feedback.className = 'fixed bottom-4 right-4 p-4 glass-effect rounded-lg animate-slide-up z-50';
    
    const color = type === 'apex' ? 'apex-green' : 'reset-blue';
    const icon = type === 'apex' ? 'bolt' : 'moon';
    const name = type.toUpperCase();
    
    if (alreadyLogged) {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-exclamation-circle text-2xl text-warning-orange"></i>
                <div>
                    <div class="font-bold">${name} Already Logged</div>
                    <div class="text-xs text-primacy-light">This dose time is already recorded</div>
                </div>
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-${color} rounded-full flex items-center justify-center">
                    <i class="fas fa-${icon} text-primacy-black"></i>
                </div>
                <div>
                    <div class="font-bold">${name} Protocol Logged</div>
                    <div class="text-xs text-${color}">AI analyzing timing correlations...</div>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(20px)';
        setTimeout(() => feedback.remove(), 300);
    }, 2500);
}

function analyzeProtocolTiming(type, timestamp) {
    // Simulate AI analysis of protocol timing
    const hour = new Date(timestamp).getHours();
    
    if (type === 'apex') {
        if (hour < 12) {
            console.log('APEX taken in morning - optimal for cognitive performance boost');
        } else if (hour < 15) {
            console.log('APEX taken early afternoon - good for avoiding afternoon slump');
        } else {
            console.log('APEX taken late - monitor sleep impact');
        }
    } else if (type === 'reset') {
        if (hour < 18) {
            console.log('RESET taken early - may be too early for optimal sleep support');
        } else if (hour < 22) {
            console.log('RESET taken in optimal window - 1-3 hours before sleep');
        } else {
            console.log('RESET taken late - good timing for sleep support');
        }
    }
    
    // In production, this would correlate with actual performance metrics
    updateProtocolCorrelations(type);
}

function updateProtocolCorrelations(type) {
    // This would update the correlation displays to show protocol timing impact
    // For now, just log for development
    console.log(`Updating correlations for ${type.toUpperCase()} protocol timing patterns`);
}

// Advanced Context Logging Functions for Tier 3
function logContext(itemId) {
    const item = contextLogItems.find(i => i.id === itemId);
    if (!item) return;
    
    // Check if already logged today
    const today = new Date().toDateString();
    const todayLogs = userData.contextLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
    );
    
    if (todayLogs.find(log => log.itemId === itemId)) {
        showContextLogFeedback(item, true); // Already logged
        return;
    }
    
    // Add to user's context logs
    const logEntry = {
        id: Date.now(),
        itemId: itemId,
        label: item.label,
        category: item.category,
        emoji: item.emoji,
        timestamp: new Date().toISOString(),
        date: today
    };
    
    userData.contextLogs.unshift(logEntry);
    
    // Update today's logs display
    updateTodayContextLogs();
    
    // Show feedback
    showContextLogFeedback(item, false);
    
    // Simulate AI processing the new context
    setTimeout(() => {
        processContextForAI(item);
    }, 500);
}

function updateTodayContextLogs() {
    const container = document.getElementById('todayContextLogs');
    const countElement = document.getElementById('contextCount');
    if (!container) return;
    
    const today = new Date().toDateString();
    const todayLogs = userData.contextLogs.filter(log => 
        new Date(log.timestamp).toDateString() === today
    );
    
    if (countElement) {
        countElement.textContent = `${todayLogs.length} factor${todayLogs.length !== 1 ? 's' : ''} logged`;
    }
    
    if (todayLogs.length === 0) {
        container.innerHTML = '<p class="text-xs text-primacy-light italic">No context logged yet today</p>';
        return;
    }
    
    // Group by category
    const grouped = {};
    todayLogs.forEach(log => {
        if (!grouped[log.category]) {
            grouped[log.category] = [];
        }
        grouped[log.category].push(log);
    });
    
    container.innerHTML = Object.entries(grouped).map(([category, logs]) => `
        <div class="flex items-start space-x-2 text-xs">
            <span>${contextCategories[category].emoji}</span>
            <span class="text-primacy-light">${logs.map(l => l.label).join(', ')}</span>
        </div>
    `).join('');
}

function showContextLogFeedback(item, alreadyLogged = false) {
    // Create temporary feedback element
    const feedback = document.createElement('div');
    feedback.className = 'fixed bottom-4 right-4 p-4 glass-effect rounded-lg animate-slide-up z-50';
    
    if (alreadyLogged) {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-check-circle text-2xl text-primacy-light"></i>
                <div>
                    <div class="font-bold">${item.label}</div>
                    <div class="text-xs text-primacy-light">Already logged today</div>
                </div>
            </div>
        `;
    } else {
        feedback.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-2xl">${item.emoji}</span>
                <div>
                    <div class="font-bold">Context Added</div>
                    <div class="text-xs text-apex-green">AI will factor "${item.label}" into your analysis</div>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(feedback);
    
    // Remove after animation
    setTimeout(() => {
        feedback.style.opacity = '0';
        feedback.style.transform = 'translateY(20px)';
        setTimeout(() => feedback.remove(), 300);
    }, 2000);
}

function processContextForAI(item) {
    // Simulate AI processing the context data
    // In production, this would send to backend for ML processing
    
    // Update AI Coach if it's open
    if (currentView === 'aiCoach' && currentTier === 3) {
        addAICoachContextResponse(item);
    }
    
    // Log for development
    console.log(`AI Processing: Context "${item.label}" (${item.category}) added to today's dataset for correlation analysis.`);
}

function addAICoachContextResponse(item) {
    // Add a contextual response from the AI coach based on logged item
    const responses = {
        'late-meal': "I see you had a late meal. Based on your historical data, this typically affects your sleep quality. Consider a lighter breakfast tomorrow to balance your metabolic load.",
        'caffeine-late': "Late caffeine noted. Your past patterns show this reduces deep sleep by 15-20%. Tomorrow's cognitive performance might be impacted - plan accordingly.",
        'hiit': "Great HIIT session! Your HRV typically dips for 24-36 hours after high-intensity work. Focus on recovery today.",
        'cold-exposure': "Cold exposure logged. This usually boosts your alertness for 3-4 hours. Good timing if you have cognitive work planned.",
        'high-stress': "High stress day noted. Your data shows meditation or breathwork within 2 hours helps normalize your cortisol patterns.",
        'poor-sleep': "Poor sleep quality logged. I'll adjust today's recommendations for lower intensity activities and suggest a recovery protocol."
    };
    
    const response = responses[item.id] || `${item.label} logged. I'll factor this into your performance analysis and upcoming recommendations.`;
    
    // This would update the AI coach chat interface with the contextual response
    console.log(`Kai Mercer: ${response}`);
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