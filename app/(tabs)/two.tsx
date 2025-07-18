import { getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import tw from 'twrnc';
import { db } from '../../firebaseConfig';

export default function TabTwoScreen() {
  const [task, setTask] = useState('');
  const [todos, setTodos] = useState<any[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const todosCollection = collection(db, 'todos');

  useEffect(() => {
    if (user) fetchTodos();
  }, [user]);

  const fetchTodos = async () => {
    try {
      const q = query(todosCollection, where('userId', '==', user?.uid));
      const data = await getDocs(q);
      setTodos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (error) {
      console.log('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!task.trim()) {
      Alert.alert('Enter a task first');
      return;
    }

    try {
      await addDoc(todosCollection, {
        task: task.trim(),
        completed: false,
        userId: user?.uid,
      });
      setTask('');
      fetchTodos();
    } catch (error) {
      console.log('Error adding todo:', error);
    }
  };

  const updateTodo = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'todos', id), {
        completed: !completed,
      });
      fetchTodos();
    } catch (error) {
      console.log('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
      fetchTodos();
    } catch (error) {
      console.log('Error deleting todo:', error);
    }
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-black`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1 px-4 pt-4`}
      >
        <Text style={tw`text-2xl font-bold text-center text-white mb-4 mt-10`}>
          My To-Do List
        </Text>

        <View style={tw`flex-row mb-4 items-center`}>
          <TextInput
            value={task}
            onChangeText={setTask}
            placeholder="New task..."
            style={tw`flex-1 h-12 border border-white rounded-lg px-4 mr-2 bg-white`}
          />
          <TouchableOpacity
            onPress={addTodo}
            style={tw`bg-blue-500 px-4 py-2 rounded-lg`}
          >
            <Text style={tw`text-white font-semibold`}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tw`pb-4`}
          renderItem={({ item }) => (
            <View style={tw`flex-row items-center my-3`}>
              <Text
                style={tw.style(
                  `flex-1 text-white`,
                  item.completed && `line-through text-white`
                )}
              >
                {item.task}
              </Text>
              <TouchableOpacity
                onPress={() => updateTodo(item.id, item.completed)}
                style={tw.style(
                  `px-3 py-2 rounded-lg mr-2`,
                  item.completed ? `bg-yellow-500` : `bg-green-500`
                )}
              >
                <Text style={tw`text-white text-xs`}>
                  {item.completed ? 'Undo' : 'Complete'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteTodo(item.id)}
                style={tw`bg-red-500 px-3 py-2 rounded-lg`}
              >
                <Text style={tw`text-white text-xs`}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
