import { View, StyleSheet, Alert, useColorScheme } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase.ts';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Btn } from '../../components/button';
import { Inpt } from '../../components/input';
import { LightTheme, DarkTheme } from '../../constants/themes.ts';

export default function ForgotPassword() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleResetPassword() {
    if (!email) {
      Alert.alert("Erro", "Por favor, digite o seu e-mail cadastrado.");
      return;
    }

    setEnviando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      
      Alert.alert(
        "E-mail Enviado!", 
        "Se este e-mail estiver cadastrado, você receberá um link para redefinir sua senha em instantes.",
        [{ text: "OK", onPress: () => router.replace('./login') }]
      );
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/invalid-email') {
        Alert.alert("Erro", "O formato do e-mail digitado é inválida.");
      } else {
        Alert.alert("Erro", "Não foi possível solicitar a recuperação. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <View style={[styles.formContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
        
        <Inpt
          label='Recuperar Senha'
          placeholder='Digite o seu e-mail cadastrado'
          keyboardType='email-address'
          autoCapitalize='none'
          value={email}
          onChangeText={setEmail}
        />
        
        <Btn 
          title={enviando ? "Enviando..." : "Enviar Link de Recuperação"} 
          onPress={handleResetPassword}
          disabled={enviando}
        />

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
  formContainer: {
    width: '85%',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
