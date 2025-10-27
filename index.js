import express from "express";
import bodyParser from "body-parser";
import md5 from "md5";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

// Подключение к Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

// Регистрация
app.post("/register", async (req, res) => {
  const { login, password } = req.body;
  const hashedPassword = md5(password); // Хешируем пароль
  const { error } = await supabase
    .from("users")
    .insert([{ login, hashed_password: hashedPassword }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "User registered" });
});

// Вход
app.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const hashedPassword = md5(password);
  console.log('Login attempt:', { login, hashedPassword });
  const { data, error } = await supabase.from('users').select().eq('login', login).eq('hashed_password', hashedPassword);
  console.log('Supabase response:', { data, error });
  if (error) return res.status(500).json({ error: error.message });
  if (!data.length) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ message: 'Login successful', user: data[0] });
});

// Получение данных
app.get("/data", async (req, res) => {
  const { data, error } = await supabase.from("data").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// Добавление данных
app.post("/data", async (req, res) => {
  const { content, user_id } = req.body;
  const { error } = await supabase.from("data").insert([{ content, user_id }]);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Record added" });
});

// Обновление данных
app.put("/data/:id", async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const { error } = await supabase
    .from("data")
    .update({ content })
    .eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Record updated" });
});

// Удаление данных
app.delete("/data/:id", async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("data").delete().eq("id", id);
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Record deleted" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
