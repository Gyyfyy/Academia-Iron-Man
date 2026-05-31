import {Tabs} from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#08F04D',
        tabBarInactiveTintColor: '#8E8E93', 
        tabBarStyle: {
          backgroundColor: '#0F140E',
        },
        headerStyle: {
          backgroundColor: '#0F140E',
        },
        headerTintColor: '#d0d0c0',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIconStyle: {display: 'none'},
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIconStyle: {display: 'none'},
        }}
      />
    </Tabs>
  );
}
