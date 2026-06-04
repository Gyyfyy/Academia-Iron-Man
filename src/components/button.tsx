import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '../constants/themes';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  backgroundColor?: string; 
}

export function Btn({ title, style, backgroundColor, ...rest }: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? DarkTheme : LightTheme;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: backgroundColor || theme.colors.primary },
        style
      ]} 
      activeOpacity={0.7} 
      {...rest}
    >
      <Text 
        style={[
          styles.buttonText, 
          { 
            fontSize: theme.fonts.size.medium,
            color: '#0F140E'
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});
