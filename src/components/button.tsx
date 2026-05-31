import {TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, StyleProp, ViewStyle} from 'react-native';
import {THEME} from '../constants/themes';

// herda de TouchableOpacityProps para ganhar suporte a prop style.
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  backgroundColor?: string; 
}

export function Btn({title, style, backgroundColor, ...rest}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button, //estilo padrão
        backgroundColor ? {backgroundColor} : {}, //cor passada pela prop backgroundColor
        style //estilo vindo de fora
      ]} 
      activeOpacity={0.7} 
      {...rest}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#95E06C',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: THEME.FONTS.SIZE.MEDIUM,
    fontWeight: 'bold',
  },
});
