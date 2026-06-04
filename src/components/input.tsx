import { TextInput, TextInputProps, StyleSheet, View, Text, useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/themes.ts';

interface InputProps extends TextInputProps {
  label: string;
  theme?: typeof LightTheme;
}

export function Inpt({ label, theme: customTheme, ...rest }: InputProps) {
  const colorScheme = useColorScheme();
  
  const theme = customTheme || (colorScheme === 'dark' ? DarkTheme : LightTheme);

  return (
    <View style={styles.container}>
      <Text 
        style={[
          styles.label, 
          { 
            color: theme.colors.text,
            fontSize: theme.fonts.size.small
          }
        ]}
      >
        {label}
      </Text>
      
      <TextInput 
        style={[
          styles.input, 
          { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
            fontSize: theme.fonts.size.medium,
            height: rest.multiline ? 'auto' : 50,
            minHeight: rest.multiline ? 80 : 50,
            paddingTop: rest.multiline ? 12 : 0,
            textAlignVertical: rest.multiline ? 'top' : 'center'
          }
        ]}
        placeholderTextColor={theme.colors.textSecondary}
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
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
});
