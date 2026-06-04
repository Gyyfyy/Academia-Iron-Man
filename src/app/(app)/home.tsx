import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, useColorScheme, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Btn } from '../../components/button';
import { Inpt } from '../../components/input';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from '../../constants/themes.ts';
import { StatusBar } from 'expo-status-bar';

type ThemeModeType = 'light' | 'dark' | 'automatic';

type TreinoItemType = {
  id: string;
  exercicios: string[];
  anotacoes: string;
  dataFormated: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Home() {
  const router = useRouter();
  const systemColorScheme = useColorScheme();
  
  const [themeMode, setThemeMode] = useState<ThemeModeType>('automatic');

  const theme = 
    themeMode === 'automatic'
      ? (systemColorScheme === 'dark' ? DarkTheme : LightTheme)
      : (themeMode === 'dark' ? DarkTheme : LightTheme);

  const [userRole, setUserRole] = useState<'professor' | 'aluno' | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [matriculaBusca, setMatriculaBusca] = useState('');
  const [treinoTexto, setTreinoTexto] = useState('');
  const [anotacoesTexto, setAnotacoesTexto] = useState('');
  const [salvandoTreino, setSalvandoTreino] = useState(false);

  const [historicoTreinos, setHistoricoTreinos] = useState<TreinoItemType[]>([]);

  useEffect(() => {
    carregarTemaSalvo();
    carregarPerfilUsuario();
  }, []);

  async function carregarTemaSalvo() {
    try {
      const temaSalvo = await AsyncStorage.getItem('@app_academia:theme');
      if (temaSalvo !== null) {
        setThemeMode(temaSalvo as ThemeModeType);
      }
    } catch (error) {
      console.error("Erro ao carregar tema do AsyncStorage:", error);
    }
  }

  async function toggleThemeMode() {
    let novoModo: ThemeModeType = 'automatic';
    if (themeMode === 'automatic') novoModo = 'light';
    else if (themeMode === 'light') novoModo = 'dark';
    else novoModo = 'automatic';

    try {
      setThemeMode(novoModo);
      await AsyncStorage.setItem('@app_academia:theme', novoModo);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar sua preferência de tema.");
    }
  }

  async function carregarPerfilUsuario() {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const userDocRef = doc(db, "usuarios", currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const dados = userSnap.data();
        setUserData(dados);
        
        const role = dados.role === 'professor' ? 'professor' : 'aluno';
        setUserRole(role);

        if (role === 'aluno') {
          buscarTreinoDoAluno(dados.matricula);
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar o perfil.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSalvarTreino() {
    if (!matriculaBusca || !treinoTexto) {
      Alert.alert("Erro", "Digite a matrícula e o treino!");
      return;
    }

    setSalvandoTreino(true);
    try {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, where("matricula", "==", matriculaBusca.trim()));
      const snap = await getDocs(q);

      if (snap.empty) {
        Alert.alert("Erro", "Nenhum usuário com essa matrícula foi encontrado.");
        setSalvandoTreino(false);
        return;
      }

      await addDoc(collection(db, "treinos"), {
        matricula_aluno: matriculaBusca.trim(),
        professor_id: auth.currentUser?.uid,
        exercicios: treinoTexto,
        anotacoes: anotacoesTexto,
        updatedAt: new Date().toISOString()
      });

      Alert.alert("Sucesso", "Treino enviado!");
      setTreinoTexto('');
      setAnotacoesTexto('');
      setMatriculaBusca('');

      if (!Device.isDevice) {
        console.log('Notificações nativas funcionam melhor em dispositivos físicos.');
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: " Novo Treino Disponível!",
            body: "Seu professor acabou de atualizar a sua ficha de exercícios de hoje.",
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: 5,
            repeats: false,
          },
        });
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao salvar treino.");
    } finally {
      setSalvandoTreino(false);
    }
  }

  async function buscarTreinoDoAluno(matriculaAluno: string) {
    try {
      const treinosRef = collection(db, "treinos");
      const q = query(
        treinosRef, 
        where("matricula_aluno", "==", matriculaAluno),
        orderBy("updatedAt", "desc")
      );
      
      const snap = await getDocs(q);
      const treinosCarregados: TreinoItemType[] = [];

      snap.forEach((docSnap) => {
        const dados = docSnap.data();
        
        const dataObjeto = new Date(dados.updatedAt);
        const dataFormatada = dataObjeto.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const exerciciosSeparados = dados.exercicios
          .split('\n')
          .filter((item: string) => item.trim() !== '');

        treinosCarregados.push({
          id: docSnap.id,
          exercicios: exerciciosSeparados,
          anotacoes: dados.anotacoes,
          dataFormated: dataFormatada
        });
      });

      setHistoricoTreinos(treinosCarregados);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    Alert.alert(
      "Sair da Conta",
      "Tem certeza que deseja encerrar a sua sessão?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sair", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/login');
            } catch (error) {
              Alert.alert("Erro", "Não foi possível deslogar.");
            }
          }
        }
      ]
    );
  }

  function getThemeButtonTitle() {
    if (themeMode === 'automatic') return "🌓";
    if (themeMode === 'light') return "☀️";
    return "🌙";
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      {userRole === 'professor' && (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.welcomeText, { color: theme.colors.text, fontSize: theme.fonts.size.large }]}>
                Olá, {userData?.nome || 'Usuário'}!
              </Text>
              <Text style={[styles.roleTag, { color: theme.colors.primary }]}>
                Painel do Professor
              </Text>
            </View>

            <View style={styles.rightButtonsContainer}>
              <Btn title={getThemeButtonTitle()} onPress={toggleThemeMode} style={styles.topButton} backgroundColor={theme.colors.surface} />
              <Btn title="Sair" onPress={handleLogout} style={styles.topButton} />
            </View>
          </View>

          <View style={[styles.cardForm, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.text, fontSize: theme.fonts.size.medium }]}>
              Prescrever Novo Treino
            </Text>
            <Inpt 
              label="Matrícula do Aluno" 
              placeholder="Insira a matrícula do aluno"
              theme={theme}
              value={matriculaBusca}
              onChangeText={setMatriculaBusca}
              keyboardType="numeric"
            />
            <Inpt 
              label="Ficha"
              placeholder="Prescreva o treino" 
              theme={theme}
              value={treinoTexto}
              onChangeText={setTreinoTexto}
              multiline
            />
            <Inpt 
              label="Anotações / Observações" 
              placeholder="Escreva anotações" 
              theme={theme}
              value={anotacoesTexto} 
              onChangeText={setAnotacoesTexto} 
              multiline 
            />

            {salvandoTreino ? <ActivityIndicator size="small" color={theme.colors.primary} /> : <Btn title="Enviar Treino" onPress={handleSalvarTreino} />}
          </View>
        </ScrollView>
      )}

      {userRole === 'aluno' && (
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.welcomeText, { color: theme.colors.text, fontSize: theme.fonts.size.large }]}>
                Olá, {userData?.nome || 'Usuário'}!
              </Text>
              <Text style={[styles.roleTag, { color: theme.colors.primary }]}>
                Histórico de Fichas
              </Text>
            </View>

            <View style={styles.rightButtonsContainer}>
              <Btn title={getThemeButtonTitle()} onPress={toggleThemeMode} style={styles.topButton} backgroundColor={theme.colors.surface} />
              <Btn title="Sair" onPress={handleLogout} style={styles.topButton} />
            </View>
          </View>

          <FlatList
            data={historicoTreinos}
            keyExtractor={(item) => item.id}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            
            renderItem={({ item, index }) => (
              <View style={[styles.containerFichaHistorico, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                <Text style={[styles.dataTreinoTitulo, { color: theme.colors.primary, fontSize: theme.fonts.size.small }]}>
                  {index === 0 ? " Ficha Atual (Atualizado em:" : " Ficha Anterior (Atualizado em:"} {item.dataFormated})
                </Text>

                {item.exercicios.map((exercicio, idx) => (
                  <View key={idx} style={[styles.itemExercicio, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
                    <Text style={[styles.itemTexto, { color: theme.colors.text, fontSize: theme.fonts.size.medium }]}>
                      {exercicio}
                    </Text>
                  </View>
                ))}

                <View style={[styles.cardAnotacao, { borderLeftColor: theme.colors.primary }]}>
                  <Text style={[styles.sectionTitleHeader, { color: theme.colors.primary, fontSize: theme.fonts.size.small }]}>
                    Análise do Professor:
                  </Text>
                  <Text style={[styles.anotacaoText, { color: theme.colors.textSecondary, fontSize: theme.fonts.size.small }]}>
                    {item.anotacoes || "Nenhuma observação técnica deixada para esse treino."}
                  </Text>
                </View>
              </View>
            )}

            ListEmptyComponent={() => (
              <Text style={[styles.noTreinoText, { color: theme.colors.textSecondary, fontSize: theme.fonts.size.medium }]}>
                Nenhum treino prescrito encontrado. Solicite ao seu professor!
              </Text>
            )}
          />
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 10
  },
  welcomeText: { fontWeight: 'bold' },
  roleTag: { fontWeight: 'bold', textTransform: 'uppercase', marginTop: 2 },
  rightButtonsContainer: {
    flexDirection: 'column',
    width: 110,
    gap: 4
  },
  topButton: {
    height: 38,
    marginTop: 0,
  },
  cardForm: { width: '100%', borderRadius: 8, padding: 16, borderWidth: 1 },
  cardTitle: { fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  sectionTitle: { fontWeight: 'bold', marginBottom: 12, marginTop: 10 },
  sectionTitleHeader: { fontWeight: 'bold', marginBottom: 4 },
  containerFichaHistorico: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  dataTreinoTitulo: {
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase'
  },
  itemExercicio: { width: '100%', padding: 12, borderRadius: 6, marginBottom: 6, borderWidth: 1 },
  itemTexto: { fontWeight: '500' },
  cardAnotacao: { width: '100%', paddingVertical: 8, paddingHorizontal: 12, borderLeftWidth: 3, marginTop: 8 },
  anotacaoText: { fontStyle: 'italic', lineHeight: 18 },
  noTreinoText: { textAlign: 'center', marginTop: 40 },
});
