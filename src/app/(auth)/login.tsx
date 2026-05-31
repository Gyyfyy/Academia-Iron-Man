import {View, StyleSheet, Appearance, useColorScheme} from 'react-native';
import {StatusBar} from 'expo-status-bar';
import {Link} from 'expo-router';
import {Image} from 'expo-image';
import {Btn} from '../../components/button';
import {Inpt} from '../../components/input';

export default function Login() {
  const colorScheme = useColorScheme();
  const themeTextStyle = colorScheme === 'light' ? styles.lightThemeText : styles.darkThemeText;
  const themeBackgroundStyle = colorScheme === 'light' ? styles.lightBackground : styles.darkBackground;
  const buttonColor = colorScheme === 'light' ? '#08F04D' : '#95E06C';
  return (
    <View style={[styles.background, themeBackgroundStyle]}>
      <StatusBar style='dark'/>
      <View style={styles.loginForm}>
        <Image source={require('../../../assets/images/academia-logo.png')} style={styles.logo} cotentFit="contain" transition={500}/>
        <Inpt
        label='E-mail'
        placeholder='Digite o seu e-mail'
        keyboardType='email-address'
        autoCapitalize='none'
        />
        <Inpt
        label='Senha'
        placeholder='Digite a sua senha'
        secureTextEntry
        />
        <Link href="./register" style={[styles.link, themeTextStyle]}>Esqueceu a sua senha?</Link>
        <Btn title='Entrar'/>
        <Btn title='Cadastre-se'/>
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
  link: {
    marginBottom: '5%',
  },
  logo: {
    width: 250,
    height: 250,
  },
});
