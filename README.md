# Iron Man App

Uma aplicação móvel desenvolvida para prescrição de rotinas de exercícios e o gerenciamento de históricos e anotações por profissionais de educação física.

---


## Funcionalidades

- **Gestão de fichas de treino:** Visualização clara de séries, repetições, cargas e tempos de descanso.
- **Anotações do Instrutor:** Campo para observações sobre a evolução ou limitações do aluno.

---


## Principais Telas

### Login

| Modo Escuro | Modo Claro |
| :---: | :---: |
| <img width="1080" height="2340" alt="Image" src="https://github.com/user-attachments/assets/97225d9c-497e-4e07-8518-5a961f54298e" /> | <img width="1080" height="2340" alt="Image" src="https://github.com/user-attachments/assets/2386031f-2bfe-4b1d-93a1-90fc9d1eeff6" /> |



### Home e Painel do Professor

| Modo Escuro | Modo Claro |
| :---: | :---: |
|<img width="1080" height="2340" alt="Image" src="https://github.com/user-attachments/assets/b7165d55-b90f-49d8-b922-a1bd79b3ebeb" /> | <img width="1080" height="2340" alt="Image" src="https://github.com/user-attachments/assets/7db7ad90-b72f-431c-a505-4d6bbb5f3e56" /> |

---

## Instalação e Execução

### Requisitos

- **Node.js v24**
- **Dispositivo móvel**

### Passos para a execução

1. **Clonar o repositório**
   ```bash
   git clone https://github.com/Gyyfyy/Iron-Man-App
   cd Iron-Man-App
   ```
   
2. **Instalar as dependências**
   ```bash
   npm install
   ```

3. **Build Local**
   ```bash
   npx expo prebuild --platform android
   cd android && ./gradlew assembleRelease
   ```

4. **Mover o apk para o dispositivo móvel**
   
   - **Se o dispositivo móvel estiver conectado a sua máquina por um cabo** execute o comando abaixo e mova o arquivo app-release.apk para a pasta Downloads do dispositivo móvel.
   - **Se o dispositivo móvel não estiver conectado a sua máquina por um cabo** execute o comando abaixo e envie o arquivo app-release.apk para o dispositivo móvel de alguma outra forma.
   
   ```bash
   cd app/build/outputs/apk/release
   ```
   
5. **Executar a instalação**

   Acesse a pasta onde está salvo o app-release.apk no seu dispositivo móvel toque nele e execute a instalação.
