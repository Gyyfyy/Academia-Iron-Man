import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Register from '../app/(auth)/register';
import { Alert } from 'react-native';

jest.mock('../config/firebase.ts', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: jest.fn() }),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: { uid: '123' } })),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ empty: false, docs: [{ data: () => ({ nome: 'Aluno Teste' }) }] })),
  doc: jest.fn(),
  setDoc: jest.fn(() => Promise.resolve()),
}));

jest.spyOn(Alert, 'alert');

describe('Testes Automatizados - Tela de Registro', () => {
  
  it('deve renderizar o botão de cadastrar na tela', () => {
    const { getByText } = render(<Register />);
    
    const botaoCadastrar = getByText('Cadastrar');
    
    expect(botaoCadastrar).toBeTruthy();
  });

  it('deve exibir um erro se as senhas digitadas forem diferentes', () => {
    const { getByPlaceholderText, getByText } = render(<Register />);
    
    fireEvent.changeText(getByPlaceholderText('Ex: 12345'), '123');
    fireEvent.changeText(getByPlaceholderText('seu-email@gmail.com'), 'aluno@academia.com');
    fireEvent.changeText(getByPlaceholderText('Digite uma senha'), 'senha123');
    fireEvent.changeText(getByPlaceholderText('Digite novamente a sua senha'), 'senhaDIFERENTE');
    
    fireEvent.press(getByText('Cadastrar'));
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'As senhas digitadas não são iguais.');
  });

});
