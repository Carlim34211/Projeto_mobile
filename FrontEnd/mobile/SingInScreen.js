import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Adicione esta importação para fazer requisições HTTP
import { API_URL } from '@env';

export default function SignInScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSignUp = async () => {
    if (name === '' || email === '' || password === '' || mobile === '') {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      // Envia os dados para o backend
      const response = await axios.post(`${API_URL}/api/auth/users`, {
        name,
        email,
        password,
        mobile,
      });

      Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login'); // Volta para a tela de Login após o cadastro
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível realizar o cadastro.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Imagem no topo */}
      <Image
        source={require('./assets/ImageSingIn.png')} // Substitua pelo caminho correto da sua imagem
        style={styles.image}
      />

      {/* Título */}
      <Text style={styles.title}>Registrar</Text>

      {/* Campo Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      {/* Campo Nome */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* Campo Mobile */}
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />
      </View>

      {/* Campo Senha */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Termos e Condições */}
      <Text style={styles.termsText}>
        Ao se inscrever, você concorda com nossos{' '}
        <Text style={styles.linkText}>Termos e Condições</Text> e{' '}
        <Text style={styles.linkText}>Políticas de Privacidade</Text>
      </Text>

      {/* Botão Continuar */}
      <TouchableOpacity style={styles.continueButton} onPress={handleSignUp}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Link para Login */}
      <View style={styles.loginContainer}>
        <Text>Já tem cadastro? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderWidth: 1,
    borderColor: '#ccc', // Borda cinza clara
    borderRadius: 8, // Bordas arredondadas
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff', // Fundo branco
  },
  icon: {
    marginRight: 10,
    color: '#666', // Cor do ícone
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333', // Cor do texto digitado
    backgroundColor: 'transparent', // Fundo transparente
    borderWidth: 0, // Remove a borda interna
    fontFamily: 'Arial', // Fonte mais limpa
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  continueButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#0FC2C0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  loginText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});