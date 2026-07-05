let currentUser = "";

function joinApp() {
    const usernameInput = document.getElementById('username-input').value.trim();
    const errorMsg = document.getElementById('error-msg');

    if (usernameInput.length < 3) {
        errorMsg.innerText = "Username must be at least 3 characters long.";
        return;
    }

    // Ekhan theke amra pore Firebase database check korbo je name ta unique kina
    currentUser = usernameInput;
    
    // UI Change
    document.getElementById('login-screen').classList.remove('active');
    document.getElementById('login-screen').classList.add('hidden');
    
    document.getElementById('chat-screen').classList.remove('hidden');
    document.getElementById('chat-screen').classList.add('active');
    
    document.getElementById('display-username').innerText = "@" + currentUser;
}

function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
        const chatBox = document.getElementById('chat-box');
        
        // Create new message element
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sent');
        
        messageDiv.innerHTML = `
            <p>${messageText}</p>
        `;
        
        chatBox.appendChild(messageDiv);
        messageInput.value = ""; // Clear input
        
        // Auto scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
