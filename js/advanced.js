// ===== Advanced Portfolio JavaScript =====

// ===== Architecture System Diagram =====
const archNodes = document.querySelectorAll('.arch-node');
const infoCards = document.querySelectorAll('.info-card');

archNodes.forEach(node => {
    node.addEventListener('click', () => {
        const nodeName = node.getAttribute('data-node');
        
        // Remove active class from all nodes
        archNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        
        // Show corresponding info card
        infoCards.forEach(card => {
            card.classList.remove('active');
            if (card.getAttribute('data-info') === nodeName) {
                card.classList.add('active');
            }
        });
    });
});

// ===== Project Tabs Filter =====
const tabButtons = document.querySelectorAll('.tab-btn');
const projectCards = document.querySelectorAll('.project-card.advanced');

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-tab');
        
        // Update active tab
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Filter projects with animation
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            
            // Hide all cards first with fade out
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    if (category && category.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }
            }, 200);
        });
    });
});

// ===== AI Chat Assistant =====
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');

// AI Knowledge Base
const knowledgeBase = {
    "qaysi project eng qiyin bo'lgan": {
        response: `Eng qiyin loyiha - <strong>Telegram Bot Platform</strong> edi. 
        
        <strong>Muammo:</strong> 50k concurrent users bilan bot 5-10 sekund javob berayotgan edi. 
        
        <strong>Yechim:</strong>
        • Queue system (RabbitMQ) - message brokerni ishlatdim
        • Worker services - distributed processing
        • Redis caching - tez-tez ishlatiladigan datani cache qildim
        • Database optimization - indexlar, query optimization
        
        <strong>Natija:</strong> Response time 300ms ga tushdi, 99.9% uptime bilan production'da ishlamoqda. 
        
        Bu loyiha menga <strong>scaling</strong> va <strong>distributed systems</strong> haqida juda ko'p narsa o'rgatdi. 🚀`
    },
    
    ".net'da qanday optimizatsiyalar qilgansan": {
        response: `<strong>.NET Core optimizatsiya tajribalarim:</strong>
        
        1️⃣ <strong>Database Optimization</strong>
        • N+1 problem - Include() va eager loading
        • Query optimization - LINQ to SQL
        • Connection pooling
        • Read replicas for heavy reads
        
        2️⃣ <strong>Caching Strategy</strong>
        • Redis distributed cache
        • Memory cache for hot data
        • Cache-aside pattern
        
        3️⃣ <strong>Performance</strong>
        • Async/await everywhere
        • Response compression
        • Output caching
        • Background jobs (Hangfire)
        
        4️⃣ <strong>Monitoring</strong>
        • Application Insights
        • Health checks
        • Custom metrics
        
        <strong>Real natija:</strong> Response time 2s → 300ms, 10k+ req/sec handle qilamiz. 📈`
    },
    
    "50k user bo'lganda nima muammo bo'ldi": {
        response: `<strong>Real scaling tajriba:</strong>
        
        <strong>Muammolar:</strong>
        • Database connection pool exhausted
        • Memory leak - GC pressure
        • Response time 5-10s ga chiqdi
        • Sporadic 500 errors
        
        <strong>Qanday yechdim?</strong>
        
        1️⃣ <strong>Horizontal Scaling</strong>
        • Load balancer qo'shdim
        • Multiple instances deployed
        • Stateless architecture
        
        2️⃣ <strong>Database Layer</strong>
        • Read replicas
        • Connection pooling settings
        • Query optimization + indexing
        
        3️⃣ <strong>Caching</strong>
        • Redis distributed cache
        • 80% read operations cached
        
        4️⃣ <strong>Async Processing</strong>
        • Message queue (RabbitMQ)
        • Background jobs
        
        <strong>Natija:</strong> 50k → 100k users ready, 99.9% uptime. 
        
        <strong>Key lesson:</strong> "Premature optimization" emas, lekin <strong>"Design for scale"</strong> kerak! 🎯`
    },
    
    "ai/ml loyihalaringiz haqida gapiring": {
        response: `<strong>AI/ML Portfolio:</strong>
        
        1️⃣ <strong>Face Recognition System</strong>
        • Real-time detection (30fps)
        • 98% accuracy
        • TensorFlow.js + OpenCV
        • Client-side processing (privacy!)
        
        <strong>Challenge:</strong> Real-time va accuracy balance
        <strong>Solution:</strong> Model quantization, optimized inference
        
        2️⃣ <strong>NLP Chatbot</strong>
        • Custom embeddings
        • Semantic search
        • Context-aware responses
        
        3️⃣ <strong>Recommendation Engine</strong>
        • Collaborative filtering
        • Content-based filtering
        • A/B testing
        
        <strong>AI'da eng muhim:</strong>
        • Data quality > Model complexity
        • Production readiness (monitoring, versioning)
        • Ethical considerations
        
        Men faqat "model train" qilmayman, <strong>production'ga deploy</strong> qilaman! 🤖🚀`
    },
    
    "system architecture yondashuvingiz": {
        response: `<strong>Mening Architecture Philosophy:</strong>
        
        <strong>Design Principles:</strong>
        
        1️⃣ <strong>Start Simple, Scale Smart</strong>
        • Monolith → Modular Monolith → Microservices
        • Don't over-engineer day 1
        
        2️⃣ <strong>Thinking in Layers</strong>
        • Frontend (Next.js) - SSR/ISR
        • API Gateway - routing, auth
        • Backend (.NET) - business logic
        • Data layer - PostgreSQL, Redis
        • Message queue - async processing
        
        3️⃣ <strong>Non-Functional Requirements</strong>
        • Performance: <500ms response
        • Availability: 99.9%+
        • Scalability: Horizontal
        • Security: Zero trust
        
        4️⃣ <strong>Questions Men Har Doim So'rayman:</strong>
        • What if users = 1M?
        • Single point of failure?
        • How to monitor?
        • Rollback strategy?
        • Cost implications?
        
        <strong>Philosophy:</strong> Code is cheap, <strong>downtime is expensive</strong>. 
        
        System design > Clean code (lekin ikkalasi ham kerak!) 🏗️`
    }
};

// Send message function
function sendMessage(messageText) {
    if (!messageText.trim()) return;
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${messageText}</p>
            <span class="message-time">Hozir</span>
        </div>
    `;
    chatMessages.appendChild(userMessage);
    
    // Clear input
    chatInput.value = '';
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Show typing indicator
    setTimeout(() => {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Typing...</p>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Get AI response
        setTimeout(() => {
            typingIndicator.remove();
            
            const aiResponse = getAIResponse(messageText);
            
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai-message';
            aiMessage.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${aiResponse}</p>
                    <span class="message-time">Hozir</span>
                </div>
            `;
            chatMessages.appendChild(aiMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }, 500);
}

// Get AI response from knowledge base
function getAIResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Search for matching answer
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase()) || 
            key.toLowerCase().includes(lowerQuestion)) {
            return value.response;
        }
    }
    
    // Default response
    return `Qiziq savol! 🤔 Men hozircha bu haqida to'liq ma'lumot bera olmayman. 
    
    Lekin siz quyidagi mavzular bo'yicha savol berishingiz mumkin:
    • .NET optimizatsiya tajribalarim
    • 50k+ user bilan scaling
    • AI/ML loyihalarim
    • System architecture yondashuvim
    • Eng qiyin loyihalar
    
    Yoki to'g'ridan-to'g'ri menga yozing: <strong>info@portfolio.uz</strong> 📧`;
}

// Send button click
sendBtn.addEventListener('click', () => {
    sendMessage(chatInput.value);
});

// Enter key press
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage(chatInput.value);
    }
});

// Suggestion buttons
suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.getAttribute('data-question');
        chatInput.value = question;
        sendMessage(question);
    });
});

// ===== DevTools Monitor =====
const monitorTabs = document.querySelectorAll('.monitor-tab');
const monitorPanels = document.querySelectorAll('.monitor-panel');

monitorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Update active tab
        monitorTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding panel
        monitorPanels.forEach(panel => {
            panel.classList.remove('active');
            if (panel.id === tabName) {
                panel.classList.add('active');
            }
        });
    });
});

// Real-time log generation
function generateLog() {
    const logTypes = ['info', 'success', 'warning', 'error'];
    const logMessages = [
        { level: 'info', message: 'User authentication successful' },
        { level: 'success', message: 'Database query executed in 45ms' },
        { level: 'info', message: 'Cache hit rate: 92%' },
        { level: 'warning', message: 'High memory usage detected: 78%' },
        { level: 'success', message: 'Background job completed successfully' },
        { level: 'info', message: 'API request processed' },
        { level: 'error', message: 'Failed to connect to external service - Retrying...' },
        { level: 'success', message: 'External service connection restored' }
    ];
    
    const consoleOutput = document.querySelector('.console-output');
    const randomLog = logMessages[Math.floor(Math.random() * logMessages.length)];
    const currentTime = new Date().toLocaleTimeString();
    
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${randomLog.level}`;
    logEntry.innerHTML = `
        <span class="log-time">[${currentTime}]</span>
        <span class="log-level">[${randomLog.level.toUpperCase()}]</span>
        <span class="log-message">${randomLog.message}</span>
    `;
    
    consoleOutput.appendChild(logEntry);
    
    // Keep only last 10 logs
    if (consoleOutput.children.length > 10) {
        consoleOutput.removeChild(consoleOutput.firstChild);
    }
}

// Generate logs every 3 seconds when console tab is visible
setInterval(() => {
    const consolePanel = document.getElementById('console');
    if (consolePanel && consolePanel.classList.contains('active')) {
        generateLog();
    }
}, 3000);

// ===== Animate metrics on scroll =====
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const metrics = entry.target.querySelectorAll('.metric-fill');
            metrics.forEach(metric => {
                const width = metric.style.width;
                metric.style.width = '0%';
                setTimeout(() => {
                    metric.style.width = width;
                }, 100);
            });
        }
    });
}, observerOptions);

const performancePanel = document.getElementById('performance');
if (performancePanel) {
    metricsObserver.observe(performancePanel);
}

// ===== Demo Functions =====
function openFaceRecognition() {
    alert('🎥 Face Recognition Demo\n\nBu real demo uchun kamera access va TensorFlow.js kutubxonasi kerak.\n\nProduction versiyada:\n• Real-time face detection\n• 30fps processing\n• 98% accuracy\n• Privacy-first (client-side)');
}

function openJobMonitor() {
    alert('📊 Job Processing Monitor\n\nReal production dashboard:\n• 1000+ jobs/hour\n• 99.5% success rate\n• Real-time monitoring\n• Alert system\n\nTech stack:\n• Hangfire\n• SignalR\n• .NET Core\n• Prometheus');
}

// ===== Console Easter Egg =====
console.log('%c🚀 PORTFOLIO LOADED', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366f1;');
console.log('%c💼 System Architect & Full Stack Developer', 'font-size: 14px; color: #8b5cf6;');
console.log('%c🎯 .NET Core | Next.js | AI/ML', 'font-size: 12px; color: #64748b;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #6366f1;');
console.log('%c\n📊 Portfolio Stats:', 'font-size: 13px; font-weight: bold; color: #6366f1;');
console.log('   • 50k+ concurrent users handled');
console.log('   • 99.9% uptime achieved');
console.log('   • 10+ production projects');
console.log('   • 5+ years experience');
console.log('%c\n💡 Interested in working together?', 'font-size: 13px; font-weight: bold; color: #10b981;');
console.log('   📧 Email: info@portfolio.uz');
console.log('   💬 Try AI Chat on the website!');
console.log('%c\n⚠️  Note: This portfolio is open source!', 'font-size: 11px; color: #f59e0b;');
console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'color: #6366f1;');

// ===== Smooth reveal animations =====
const advancedElements = document.querySelectorAll('.arch-node, .info-card, .project-card.advanced, .chat-box, .monitor-content');

const advancedObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

advancedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease';
    advancedObserver.observe(element);
});

// ===== Network Stats Real-time Update =====
function updateNetworkStats() {
    const stats = {
        requests: document.querySelector('.network-stats .stat-card:nth-child(1) .stat-value'),
        response: document.querySelector('.network-stats .stat-card:nth-child(2) .stat-value'),
        errors: document.querySelector('.network-stats .stat-card:nth-child(3) .stat-value'),
        users: document.querySelector('.network-stats .stat-card:nth-child(4) .stat-value')
    };
    
    if (stats.requests) {
        // Simulate real-time updates
        setInterval(() => {
            const currentRequests = parseInt(stats.requests.textContent.replace(/,/g, ''));
            const newRequests = currentRequests + Math.floor(Math.random() * 100);
            stats.requests.textContent = newRequests.toLocaleString();
        }, 5000);
    }
}

updateNetworkStats();
