import {TextInput, TextInputProps, StyleSheet, View, Text} from 'react-native';
import {THEME} from '../constants/themes.ts';

// herda todas as propriedades padrão do TextInput
interface InputProps extends TextInputProps {
  label: string;
}

export function Inpt({label, ...rest}: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TextInput 
        style={styles.input}
        placeholderTextColor={THEME.COLORS.TEXT_MUTED}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: THEME.FONTS.SIZE.SMALL,
    color: THEME.COLORS.TEXT_PRIMARY,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: THEME.COLORS.SURFACE,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDER,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: THEME.FONTS.SIZE.MEDIUM,
    color: THEME.COLORS.TEXT_PRIMARY,
  },
});
