import { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, ActivityIndicator } from 'react-native';

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [texto, setTexto] = useState('');
  const [loading, setLoading] = useState(true);

  // Certifique-se de que a URL não tenha barra no final e que o Codespace esteja como PUBLIC
  const API = 'https://react-native-fullstack.onrender.com/tarefas';

  async function carregar() {
    setLoading(true);
    try {
      const res = await fetch(API, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Falha ao carregar: Status ${res.status}`);
      const data = await res.json();
      setTarefas(data);
    } catch (err) {
      Alert.alert('Erro de Conexão', 'Não foi possível carregar as tarefas. Verifique se a porta do Codespaces está "Public".');
      console.log('Erro carregar:', err);
    } finally {
      setLoading(false);
    }
  }

  async function adicionar() {
    if (!texto.trim()) {
      Alert.alert('Aviso', 'Digite algo antes de adicionar');
      return;
    }

    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ titulo: texto })
      });

      if (!res.ok) throw new Error('Erro ao criar tarefa');
      setTexto('');
      carregar(); // Recarrega a lista após adicionar
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível adicionar a tarefa');
      console.log('Erro adicionar:', err);
    }
  }

  async function deletar(id) {
    try {
      const res = await fetch(`${API}/${id}`, { 
        method: 'DELETE',
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Erro ao deletar tarefa');
      carregar(); // Recarrega a lista após deletar
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível deletar a tarefa');
      console.log('Erro deletar:', err);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={{ flex: 1, marginTop: 50, padding: 20 }}>
      <TextInput
        value={texto}
        onChangeText={setTexto}
        placeholder="Digite a nova tarefa"
        style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 }}
      />

      <Button title="Adicionar" onPress={adicionar} />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={tarefas}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ marginTop: 20 }}
          renderItem={({ item }) => (
            <View style={{ padding: 15, marginVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ flex: 1, fontSize: 16 }}>{item.titulo}</Text>
              <Button title="Excluir" color="red" onPress={() => deletar(item._id)} />
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhuma tarefa encontrada.</Text>}
        />
      )}
    </View>
  );
}