import {View, StyleSheet,Appearance, Alert, useColorScheme} from 'react-native';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {doc, setDoc, collection, query, where, getDocs} from 'firebase/firestore';
import {auth, db} from '../../config/firebase.ts';
import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {useRouter} from 'expo-router';
import {Btn} from '../../components/button.tsx';
import {Inpt} from '../../components/input';

export default function Register() {
  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeBackgroundStyle = colorScheme === 'light' ? styles.lightBackground : styles.darkBackground;
  const buttonColor = colorScheme === 'light' ? '#08F04D' : '#95E06C';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "common",
        createdAt: new Date().toISOString()
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      router.replace('./login');

    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro ao cadastrar", error.message);
    }
  }

  return (
    <View style={[styles.background, themeBackgroundStyle]}>
      <StatusBar style='dark'/>
      <View style={styles.loginForm}>
        <Inpt
        label='Digite a sua matricula'
        placeholder='Digite um nome de usuario'
        keyboardType='email-address'
        autoCapitalize='none'
        value={email}
        onChangeText={setEmail}
        />
        <Inpt
        label='Digite o seu e-mail'
        placeholder='Digite o seu e-mail'
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
        value={password}
        onChangeText={setPassword}
        />
        <Btn title='Cadastrar' onPress={handleRegister}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightBackground: {
    backgroundColor: '#d0d0c0',
  },
  darkBackground: {
    backgroundColor: '#555B6E',
  },
  lightThemeText: {
    color: '#242c40',
  },
  darkThemeText: {
    color: '#d0d0c0',
  },
  loginForm: {
    backgroundColor: '#474A48',
    width: '80%',
    height: '70%',
    borderRadius: '5%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
