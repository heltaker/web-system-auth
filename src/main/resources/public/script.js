function showMessage(text, type = 'error') {
  const messageElement = document.getElementById('message');
  if (messageElement) {
    messageElement.textContent = text;
    messageElement.className = type;
    messageElement.style.display = 'block';
    setTimeout(() => {
      messageElement.style.display = 'none';
    }, 5000);
  }
}

function validateInput(value, fieldName) {
  if (!value || value.trim() === '') {
    showMessage(`${fieldName} is required`);
    return false;
  }
  return true;
}

async function register() {
  const loginInput = document.getElementById('reg-login');
  const passwordInput = document.getElementById('reg-password');
  
  if (!loginInput || !passwordInput) return;
  
  const login = loginInput.value;
  const password = passwordInput.value;
  
  if (!validateInput(login, 'Username')) return;
  if (!validateInput(password, 'Password')) return;
  
  if (password.length < 4) {
    showMessage('Password must be at least 4 characters long');
    return;
  }
  
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const result = await response.json();
    
    if (response.ok) {
      showMessage(result.message || 'Registration successful!', 'success');
      setTimeout(() => {
        const registerForm = document.getElementById('register-form');
        const loginForm = document.getElementById('login-form');
        if (registerForm) registerForm.style.display = 'none';
        if (loginForm) loginForm.style.display = 'block';
        loginInput.value = '';
        passwordInput.value = '';
      }, 1000);
    } else {
      showMessage(result.error || 'Registration failed');
    }
  } catch (error) {
    showMessage('Network error. Please try again.');
  }
}

async function login() {
  const loginInput = document.getElementById('login');
  const passwordInput = document.getElementById('password');
  
  if (!loginInput || !passwordInput) return;
  
  const login = loginInput.value;
  const password = passwordInput.value;
  
  if (!validateInput(login, 'Username')) return;
  if (!validateInput(password, 'Password')) return;
  
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const result = await response.json();
    
    if (response.ok) {
      showMessage('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = 'data.html';
      }, 500);
    } else {
      showMessage(result.error || 'Invalid credentials. Please try again.');
    }
  } catch (error) {
    showMessage('Network error. Please try again.');
  }
}

function showRegister() {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  if (loginForm) loginForm.style.display = 'none';
  if (registerForm) registerForm.style.display = 'block';
}

async function loadData() {
  try {
    const response = await fetch('/data');
    if (!response.ok) {
      showMessage('Failed to load data');
      return;
    }
    
    const data = await response.json();
    const tbody = document.getElementById('data-body');
    if (!tbody) return;
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="2" style="text-align: center; color: #999;">No records found</td></tr>';
      return;
    }
    
    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${escapeHtml(row.content)}</td>
        <td class="actions">
          <button class="edit-btn" onclick="editRecord('${row.id}')">Edit</button>
          <button class="delete-btn" onclick="deleteRecord('${row.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    showMessage('Failed to load data');
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function addRecord() {
  const contentInput = document.getElementById('new-content');
  if (!contentInput) return;
  
  const content = contentInput.value;
  
  if (!validateInput(content, 'Content')) return;
  
  try {
    const userId = '1';
    const response = await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, user_id: userId }),
    });
    const result = await response.json();
    
    if (response.ok) {
      showMessage(result.message || 'Record added successfully!', 'success');
      await loadData();
      const addForm = document.getElementById('add-form');
      if (addForm) addForm.style.display = 'none';
      contentInput.value = '';
    } else {
      showMessage(result.error || 'Failed to add record');
    }
  } catch (error) {
    showMessage('Network error. Please try again.');
  }
}

function showAddForm() {
  const addForm = document.getElementById('add-form');
  if (addForm) {
    addForm.style.display = 'block';
    const contentInput = document.getElementById('new-content');
    if (contentInput) contentInput.focus();
  }
}

async function editRecord(id) {
  const newContent = prompt('Enter new content:');
  if (!newContent || newContent.trim() === '') {
    if (newContent !== null) {
      showMessage('Content cannot be empty');
    }
    return;
  }
  
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newContent }),
    });
    const result = await response.json();
    
    if (response.ok) {
      showMessage(result.message || 'Record updated successfully!', 'success');
      await loadData();
    } else {
      showMessage(result.error || 'Failed to update record');
    }
  } catch (error) {
    showMessage('Network error. Please try again.');
  }
}

async function deleteRecord(id) {
  if (!confirm('Are you sure you want to delete this record?')) {
    return;
  }
  
  try {
    const response = await fetch(`/data/${id}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    
    if (response.ok) {
      showMessage(result.message || 'Record deleted successfully!', 'success');
      await loadData();
    } else {
      showMessage(result.error || 'Failed to delete record');
    }
  } catch (error) {
    showMessage('Network error. Please try again.');
  }
}

function filterTable() {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;
  
  const search = searchInput.value.toLowerCase();
  const tbody = document.getElementById('data-body');
  if (!tbody) return;
  
  const rows = tbody.getElementsByTagName('tr');
  for (let row of rows) {
    const cells = row.getElementsByTagName('td');
    if (cells.length > 0) {
      const content = cells[0].textContent.toLowerCase();
      row.style.display = content.includes(search) ? '' : 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const addForm = document.getElementById('add-form');
  const dataTable = document.getElementById('data-table');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      login();
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      register();
    });
  }

  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      addRecord();
    });
  }

  if (dataTable) {
    loadData();
  }
});
