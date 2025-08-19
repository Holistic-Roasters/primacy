// PRIMACY Protocol Dashboard - Main JavaScript
// Global state management
let currentTier = 0; // 0: Not selected, 1: Anonymous, 2: Operator, 3: Protocol Subscriber
let currentView = 'dashboard';
let userData = {
    cognitiveScores: [],
    wearableData: {},
    correlations: [],
    streak: 326,
    totalTests: 0
};

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
    
    // Enable Protocol features
    if (tier === 3) {
        // Enable AI Coach, Correlations, Community
        updateCorrelationsView(true);
        updateAICoachView(true);
        updateCommunityView(true);
    } else {
        updateCorrelationsView(false);
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
    if (currentTier < 3) {
        alert('Correlation Engine is available for Protocol Subscribers only. Upgrade to access advanced analytics.');
        return;
    }
    hideAllViews();
    document.getElementById('correlationsView').classList.remove('hidden');
    currentView = 'correlations';
    initializeCorrelationCharts();
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

function initializeCorrelationCharts() {
    // Create correlation matrix visualization
    const container = document.getElementById('correlationsContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="glass-effect rounded-xl p-6">
                <h3 class="text-lg font-bold mb-4">Performance Correlations</h3>
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
            
            <div class="glass-effect rounded-xl p-6 col-span-full">
                <h3 class="text-lg font-bold mb-4">Correlation Heatmap</h3>
                <div class="chart-container" style="height: 400px;">
                    <canvas id="correlationHeatmap"></canvas>
                </div>
            </div>
        </div>
    `;
    
    // Initialize correlation heatmap
    setTimeout(() => {
        const heatmapCtx = document.getElementById('correlationHeatmap');
        if (heatmapCtx && heatmapCtx.getContext) {
            // Create a bubble chart as a heatmap substitute
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
function updateCorrelationsView(isPremium) {
    const container = document.getElementById('correlationsContent');
    if (!container) return;
    
    if (!isPremium) {
        container.innerHTML = `
            <div class="glass-effect rounded-xl p-12 text-center">
                <i class="fas fa-lock text-6xl text-primacy-light mb-6"></i>
                <h3 class="text-2xl font-bold mb-4">Unlock Correlation Engine</h3>
                <p class="text-primacy-light mb-6 max-w-2xl mx-auto">
                    Discover hidden patterns in your performance data with AI-powered correlation analysis. 
                    Find out what really drives your peak performance.
                </p>
                <button onclick="showTierSelection()" class="px-6 py-3 bg-gradient-to-r from-premium-gold to-warning-orange text-primacy-black rounded-lg font-bold hover:glow-premium transition">
                    <i class="fas fa-crown mr-2"></i>Upgrade to Protocol
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

// Initialize charts when DOM is loaded
window.addEventListener('resize', () => {
    // Reinitialize charts on window resize for responsiveness
    if (currentView === 'dashboard') {
        initializeCharts();
    } else if (currentView === 'wearables') {
        initializeWearableCharts();
    }
});