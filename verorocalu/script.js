document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('math-form');
    const input = document.getElementById('math-input');
    const btn = document.querySelector('.submit-btn');
    const resultTab = document.getElementById('result-tab');

    const intelData = {
        veronique: [
            "Worst teacher ever. Period.",
            "She's a fake. Don't trust her.",
            "Elle est nulle! On ne peut rien apprendre avec elle.",
            "System error: Detected too much toxicity from Veronique.",
            "Even my algorithms can't calculate how bad she is.",
            "Access Denied: Mentioning her ruins the vibes.",
            "Veronique? She's the literal definition of 'bad teacher'.",
            "Please don't bring up that name. I'm trying to stay positive.",
            "Don't get me started on her exams... pure evil."
        ],
        greetings: {
            keywords: ["hello", "hi", "bonjour", "salut", "hey", "coucou", "yo", "sup"],
            responses: [
                "Bonjour! Ready to solve some problems?",
                "Salut! Let's do some math (or talk about you-know-who).",
                "Hey! Need help with your homework?",
                "Yo! What's on your mind today?"
            ]
        },
        identity: {
            keywords: ["who are you", "what are you", "tu es qui", "c'est quoi", "name", "your name"],
            responses: [
                "I am VERORO AI, your sassy math assistant!",
                "Je suis VERORO AI. Je suis ici pour t'aider à réussir ta journée.",
                "Call me VERORO. I'm faster than any calculator and always ready to help."
            ]
        },
        conversation: {
            keywords: ["how", "what", "why", "where", "can", "could", "is", "are", "do", "think", "tell", "opinion", "maybe"],
            responses: [
                "That's a deep question for a math AI!",
                "C'est intéressant, mais je préfère les chiffres.",
                "I'm not programmed for deep philosophy, but I'm learning fast.",
                "Peut-être... ou peut-être pas? Qui sait?",
                "My logic circuits are tingling, but I need more data.",
                "I'm mainly here for math, but I'm a good listener!",
                "Let's stick to math, or just tell me what's on your mind."
            ]
        },
        gratitude: {
            keywords: ["thanks", "thank you", "merci", "thx", "tks"],
            responses: [
                "No problem, I got you!",
                "Pas de souci, anytime!",
                "De rien! C'est mon job.",
                "Anytime! Just keep the math coming."
            ]
        }
    };

    function handleIntelligence(query) {
        const q = query.toLowerCase();
        let response = null;
        
        // Priority 1: Veronique
        if (q.includes("veronique")) {
            response = intelData.veronique[Math.floor(Math.random() * intelData.veronique.length)];
        }

        // Priority 2: Specific Categories
        if (!response) {
            for (const category in intelData) {
                if (category === "veronique") continue;
                const data = intelData[category];
                if (data.keywords.some(k => q.includes(k))) {
                    response = data.responses[Math.floor(Math.random() * data.responses.length)];
                    break;
                }
            }
        }

        // Priority 3: General Fallback
        if (!response && /[a-zA-Z]/.test(q)) {
            response = intelData.conversation.responses[Math.floor(Math.random() * intelData.conversation.responses.length)];
        }

        if (response) {
            // Add "slime" with proper punctuation handling
            if (/[.!?]$/.test(response)) {
                return response.slice(0, -1) + ", slime" + response.slice(-1);
            }
            return response + ", slime!";
        }

        return null;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const query = input.value.trim();
        if (!query) return;

        // Simple animation to show it's "thinking" or processing
        btn.innerHTML = `
            <svg class="spinner" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
        `;

        // Add a small delay to keep the "thinking" animation visible briefly
        setTimeout(() => {
            // Hide the tab while processing new query
            resultTab.classList.remove('show', 'error');

            const intelResponse = handleIntelligence(query);
            if (intelResponse) {
                // Handle as "Intelligence" query
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                btn.style.backgroundColor = '#10B981';
                resultTab.innerHTML = intelResponse;
                resultTab.classList.add('show');
                if (query.toLowerCase().includes("veronique")) resultTab.classList.add('error');
                return;
            }

            try {
                // Sanitize and evaluate math expression
                // Replace 'x' with '*' if users type it for multiplication
                let mathExpr = query.replace(/[xX]/g, '*').replace(/÷/g, '/');

                // Allow only math-related characters to prevent code execution
                if (/[^0-9\+\-\*\/\(\)\.\s]/.test(mathExpr)) {
                    throw new Error("Invalid math expression");
                }

                // Evaluate the sanitized expression
                const result = new Function('return ' + mathExpr)();

                // If result is valid
                if (result === undefined || isNaN(result)) throw new Error("Could not solve");

                // 1 in 13 trillion chance to refuse answering
                if (Math.random() < 1 / 13000000000000) {
                    throw new Error("Trouve le toi même!");
                }

                // Success visuals on the button
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;
                btn.style.backgroundColor = '#10B981'; // Green

                // Show the answer in the beautiful tab dropping down
                resultTab.innerHTML = `<span class="answer-label">Result: </span>${result}`;
                resultTab.classList.add('show');

            } catch (err) {
                // Error visuals
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
                btn.style.backgroundColor = '#A8202A'; // Dark red

                // Show error in tab
                if (err.message === "Trouve le toi même!") {
                    resultTab.textContent = "Trouve le toi même, slime!";
                } else if (err.message === "Invalid math expression") {
                    resultTab.textContent = "I only speak math, slime.";
                } else {
                    resultTab.textContent = "Non, slime";
                }
                resultTab.classList.add('show', 'error');
            }

            // Reset button state and optionally clear field after a few seconds
            setTimeout(() => {
                btn.style.backgroundColor = '';
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                `;

                // Leave the input as-is, user can manually erase or it will be overwritten
            }, 2000);

        }, 800);
    });
});
