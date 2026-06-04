import { View, StyleSheet, Alert, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase.ts';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Btn } from '../../components/button';
import { Inpt } from '../../components/input';
import { LightTheme, DarkTheme } from '../../constants/themes.ts';

export default function Register() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  const router = useRouter();

  async function handleRegister() {
    if (!matricula || !email || !password || !confirmarPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Senha Fraca", "A sua senha deve conter no mínimo 8 dígitos.");
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert("Erro", "As senhas digitadas não são iguais.");
      return;
    }

    try {
      const usuariosRef = collection(db, "usuarios");
      const consultaUsuario = query(usuariosRef, where("matricula", "==", matricula.trim()));
      const resultadoUsuario = await getDocs(consultaUsuario);

      if (!resultadoUsuario.empty) {
        Alert.alert("Matrícula Já Vinculada", "Esta matrícula já possui uma conta ativa.");
        return;
      }

      const alunosRef = collection(db, "alunos");
      const consultaAluno = query(alunosRef, where("matricula", "==", matricula.trim()));
      const resultadoAluno = await getDocs(consultaAluno);

      if (resultadoAluno.empty) {
        Alert.alert("Erro", "Matrícula inválida ou não cadastrada na academia.");
        return;
      }

      const dadosDoAluno = resultadoAluno.docs[0].data();
      const nomeDoAluno = dadosDoAluno.nome;

      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome: nomeDoAluno,
        matricula: matricula,
        email: user.email,
        role: 'aluno',
        createdAt: new Date().toISOString()
      });

      Alert.alert("Sucesso!", `Conta ativada com sucesso! Bem-vindo, ${nomeDoAluno}.`);
      router.replace('/home');

    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert("Erro ao cadastrar", "Este e-mail já está em uso.");
      } else {
        Alert.alert("Erro ao cadastrar", error.message);
      }
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior="padding"
      style={[styles.background, { backgroundColor: theme.colors.background }]}
    >
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <View style={[styles.loginForm, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          
          <Inpt
            label='Digite a sua matricula'
            placeholder='Ex: 12345'
            keyboardType='numeric'
            autoCapitalize='none'
            value={matricula}
            onChangeText={setMatricula}
          />
          
          <Inpt
            label='Digite o seu e-mail'
            placeholder='seu-email@gmail.com'
            keyboardType='email-address'
            autoCapitalize='none'
            value={email}
            onChangeText={setEmail}
          />
          
          <Inpt
            label='Crie a sua senha'
            placeholder='Digite uma senha'
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          
          <Inpt
            label='Confirme a sua senha'
            placeholder='Digite novamente a sua senha'
            secureTextEntry
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
          />
          
          <Btn title='Cadastrar' onPress={handleRegister}/>
        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginForm: {
    width: '85%',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
