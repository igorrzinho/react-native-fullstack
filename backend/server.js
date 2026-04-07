const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Tarefa = require('./models/Tarefa'); 

const app = express();

// CORS configurado para aceitar requisições de qualquer lugar
// Isso aqui já resolve tudo, inclusive o preflight (OPTIONS)!
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization']
}));

// Middlewares
app.use(express.json());

// Conexão com MongoDB Atlas
const MONGO_URI = 'urlmongo';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Atlas conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// --- ROTAS ---

app.post('/tarefas', async (req, res) => {
  try {
    const tarefa = await Tarefa.create(req.body);
    res.status(201).json(tarefa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

app.get('/tarefas', async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.status(200).json(tarefas);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
});

app.put('/tarefas/:id', async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(200).json(tarefa);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

app.delete('/tarefas/:id', async (req, res) => {
  try {
    const tarefa = await Tarefa.findByIdAndDelete(req.params.id);
    if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });
    res.status(200).json({ ok: true, message: 'Tarefa deletada com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
