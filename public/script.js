document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  async function register() {
    const login = document.getElementById('reg-login').value;
    const password = document.getElementById('reg-password').value;
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const result = await response.json();
    document.getElementById('message').textContent = result.message || result.error;
    if (response.ok) {
      document.getElementById('register-form').style.display = 'none';
      document.getElementById('login-form').style.display = 'block';
      document.getElementById('reg-login').value = '';
      document.getElementById('reg-password').value = '';
    }
  }

  async function login() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    console.log('Sending login:', { login, password });
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password }),
    });
    const result = await response.json();
    console.log('Response:', result);
    if (response.ok) window.location.href = 'data.html';
    document.getElementById('message').textContent = result.message || result.error;
  }

  function showRegister() {
    if (loginForm) loginForm.style.display = 'none';
    if (registerForm) registerForm.style.display = 'block';
  }

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

  async function loadData() {
    const response = await fetch('/data');
    const data = await response.json();
    const tbody = document.getElementById('data-body');
    tbody.innerHTML = data.map(row => `
      <tr>
        <td>${row.content}</td>
        <td class="actions">
          <button onclick="editRecord('${row.id}')">Edit</button>
          <button onclick="deleteRecord('${row.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  async function addRecord() {
    const content = document.getElementById('new-content').value;
    const user_id = '1'; // Простая заглушка, заменить на реальный user_id после аутентификации
    const response = await fetch('/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, user_id }),
    });
    const result = await response.json();
    document.getElementById('message').textContent = result.message;
    loadData();
    document.getElementById('add-form').style.display = 'none';
    document.getElementById('new-content').value = '';
  }

  function showAddForm() {
    document.getElementById('add-form').style.display = 'block';
  }

  async function editRecord(id) {
    const newContent = prompt('Enter new content');
    if (newContent) {
      const response = await fetch(`/data/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });
      const result = await response.json();
      document.getElementById('message').textContent = result.message;
      loadData();
    }
  }

  async function deleteRecord(id) {
    if (confirm('Are you sure?')) {
      const response = await fetch(`/data/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      document.getElementById('message').textContent = result.message;
      loadData();
    }
  }

  function filterTable() {
    const search = document.getElementById('search').value.toLowerCase();
    const rows = document.getElementById('data-body').getElementsByTagName('tr');
    for (let row of rows) {
      const content = row.getElementsByTagName('td')[0].textContent.toLowerCase();
      row.style.display = content.includes(search) ? '' : 'none';
    }
  }

  if (document.getElementById('data-table')) loadData();
});