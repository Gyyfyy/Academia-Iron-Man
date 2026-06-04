import { View, StyleSheet, Alert, useColorScheme, Platform, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Btn } from '../../components/button';
import { Inpt } from '../../components/input';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase.ts';
import { LightTheme, DarkTheme } from '../../constants/themes.ts'; 

export default function Login() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      router.replace('/(app)/home'); 
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        Alert.alert("Erro de Acesso", "E-mail ou senha incorretos.");
      } else {
        Alert.alert("Erro", "Não foi possível fazer login. Tente novamente mais tarde.");
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
        
        <Image 
          source={require('../../../assets/images/academia-logo.png')} 
          style={styles.logo} 
          contentFit="contain" 
          transition={500}
        />
        
        <Inpt
          label='E-mail'
          placeholder='Digite o seu e-mail'
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
          onChangeText={setEmail}
        />
        
        <Inpt
          label='Senha'
          placeholder='Digite a sua senha'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <Link 
          href="./forgotpwd" 
          style={[
            styles.link, 
            { 
              color: theme.colors.textSecondary,
              fontSize: theme.fonts.size.small 
            }
          ]}
        >
          Esqueceu a sua senha?
        </Link>
        
        <Btn title='Entrar' onPress={handleLogin}/>
        <Btn title='Cadastre-se' onPress={() => router.push('/register')}/>
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
  link: {
    marginBottom: 16,
    alignSelf: 'flex-end',
  },
  logo: {
    width: 140, 
    height: 140,
    marginBottom: 16,
  },
});
