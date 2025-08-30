document.addEventListener('DOMContentLoaded', function() {
    const REPO_OWNER = 'paulomarques-png';
    const REPO_NAME = 'Projeto-IA';
    
    const titulo = document.querySelector('.titulo');
    let clickCount = 0;
    let resetTimer;
    
    if (!titulo) return;
    
    titulo.addEventListener('click', function() {
        clickCount++;
        
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
            clickCount = 0;
        }, 3000);
        
        if (clickCount === 8) {
            clickCount = 0;
            showVersionPopup();
        }
    });
    
    async function showVersionPopup() {
        const popup = createPopup();
        document.body.appendChild(popup);
        
        try {
            const commitInfo = await getLastCommitInfo();
            updatePopupContent(popup, commitInfo);
        } catch (error) {
            console.error('Erro ao buscar versão:', error);
            updatePopupContent(popup, null, error.message);
        }
    }
    
    function createPopup() {
        const overlay = document.createElement('div');
        overlay.className = 'version-overlay';
        
        const popup = document.createElement('div');
        popup.className = 'version-popup';
        
        popup.innerHTML = `
            <div class="version-header">
                <h3>🚀 ARIA Version Info</h3>
                <button class="version-close">&times;</button>
            </div>
            <div class="version-content">
                <div class="version-loading">
                    <div class="loading-spinner"></div>
                    <p>Carregando informações...</p>
                </div>
            </div>
        `;
        
        overlay.appendChild(popup);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closePopup(overlay);
        });
        
        popup.querySelector('.version-close').addEventListener('click', () => {
            closePopup(overlay);
        });
        
        return overlay;
    }
    
    async function getLastCommitInfo() {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits`;
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`GitHub API Error: ${response.status}`);
        }
        
        const commits = await response.json();
        const lastCommit = commits[0];
        
        return {
            sha: lastCommit.sha.substring(0, 7),
            date: new Date(lastCommit.commit.author.date),
            message: lastCommit.commit.message,
            author: lastCommit.commit.author.name
        };
    }
    
    function updatePopupContent(popup, commitInfo, error = null) {
        const content = popup.querySelector('.version-content');
        
        if (error) {
            content.innerHTML = `
                <div class="version-error">
                    <p>❌ Erro ao carregar versão</p>
                    <small>${error}</small>
                </div>
            `;
            return;
        }
        
        const deployDate = commitInfo.date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        content.innerHTML = `
            <div class="version-info">
                <div class="version-item">
                    <span class="version-label">📅 Último Deploy:</span>
                    <span class="version-value">${deployDate}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">🔧 Versão:</span>
                    <span class="version-value">#${commitInfo.sha}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">💬 Último Commit:</span>
                    <span class="version-value">${commitInfo.message}</span>
                </div>
                <div class="version-item">
                    <span class="version-label">👨‍💻 Autor:</span>
                    <span class="version-value">${commitInfo.author}</span>
                </div>
            </div>
        `;
    }
    
    function closePopup(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    }
});

const versionCSS = `
.version-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 1;
    transition: opacity 0.3s ease;
}

.version-popup {
    background: linear-gradient(120deg, rgba(7, 27, 57, 0.95) 0%, rgba(64, 35, 58, 0.95) 80%);
    border: 1px solid #00FFF2;
    border-radius: 1em;
    padding: 0;
    max-width: 50em;
    width: 90%;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 242, 0.3);
    font-family: "Inter", sans-serif;
}

.version-header {
    background: rgba(0, 255, 242, 0.1);
    padding: 2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(0, 255, 242, 0.3);
}

.version-header h3 {
    margin: 0;
    color: #00FFF2;
    font-size: 2.5em;
    font-weight: 600;
}

.version-close {
    background: none;
    border: none;
    color: #00FFF2;
    font-size: 3em;
    cursor: pointer;
    padding: 0;
    width: 1em;
    height: 1em;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
}

.version-close:hover {
    background: rgba(255, 0, 0, 0.2);
    color: #ff4444;
}

.version-content {
    padding: 2em;
}

.version-loading {
    text-align: center;
    color: #00FFF2;
    font-size: 1.8em;
}

.loading-spinner {
    width: 4em;
    height: 4em;
    border: 3px solid rgba(0, 255, 242, 0.3);
    border-radius: 50%;
    border-top-color: #00FFF2;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 1em;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.version-info {
    display: flex;
    flex-direction: column;
    gap: 1.5em;
}

.version-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1em;
    background: rgba(0, 255, 242, 0.05);
    border-radius: 0.5em;
    border-left: 3px solid #00FFF2;
}

.version-label {
    color: rgb(226, 172, 71);
    font-weight: 500;
    font-size: 1.6em;
    flex-shrink: 0;
}

.version-value {
    color: #00FFF2;
    font-size: 1.6em;
    text-align: right;
    word-break: break-word;
    max-width: 60%;
}

.version-error {
    text-align: center;
    color: #ff4444;
    font-size: 1.8em;
}

.version-error small {
    display: block;
    color: rgba(255, 68, 68, 0.7);
    font-size: 0.8em;
    margin-top: 1em;
}

@media (max-width: 580px) {
    .version-popup {
        width: 95%;
    }
    
    .version-header h3 {
        font-size: 2em;
    }
    
    .version-item {
        flex-direction: column;
        gap: 0.5em;
    }
    
    .version-value {
        max-width: 100%;
        text-align: left;
    }
}
`;

const style = document.createElement('style');
style.textContent = versionCSS;
document.head.appendChild(style);