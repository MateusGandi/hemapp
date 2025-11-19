import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../auth/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function LoginScreen() {
  const { login, create } = useContext(AuthContext);

  const passwordRef = useRef(null);

  const [isCreateMode, setIsCreateMode] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [uf, setUf] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    try {
      if (isCreateMode) {
        await create({ username, password, uf });
      } else {
        await login({ username, password });
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* SCROLLVIEW - CAMPOS */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* ============ BLOCO 1 - IMAGEM ============ */}
          <View style={styles.topSection}>
            <Image
              source={require('../assets/logo_app_clear.png')}
              style={styles.topImage}
            />
          </View>

          {/* ============ BLOCO 2 - CAMPOS ============ */}
          <View style={styles.middleSection}>
            <Text style={styles.title}>
              {isCreateMode ? 'Crie sua conta' : 'Acesse sua conta'}
            </Text>

            {/* USERNAME */}
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#777"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            {/* SENHA */}
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#777"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="go"
              blurOnSubmit={true}
              onSubmitEditing={handleSubmit}
              onKeyPress={e => {
                if (e.nativeEvent.key === 'Enter') {
                  handleSubmit();
                }
              }}
            />

            {/* PICKER NO MODO CRIAR */}
            {isCreateMode && (
              <View style={styles.pickerContainer}>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={uf}
                    onValueChange={setUf}
                    style={styles.pickerStyle}
                  >
                    <Picker.Item label="Selecione a UF" value="" />
                    <Picker.Item label="AC - Acre" value="AC" />
                    <Picker.Item label="AL - Alagoas" value="AL" />
                    <Picker.Item label="AP - Amapá" value="AP" />
                    <Picker.Item label="AM - Amazonas" value="AM" />
                    <Picker.Item label="BA - Bahia" value="BA" />
                    <Picker.Item label="CE - Ceará" value="CE" />
                    <Picker.Item label="DF - Distrito Federal" value="DF" />
                    <Picker.Item label="ES - Espírito Santo" value="ES" />
                    <Picker.Item label="GO - Goiás" value="GO" />
                    <Picker.Item label="MA - Maranhão" value="MA" />
                    <Picker.Item label="MT - Mato Grosso" value="MT" />
                    <Picker.Item label="MS - Mato Grosso do Sul" value="MS" />
                    <Picker.Item label="MG - Minas Gerais" value="MG" />
                    <Picker.Item label="PA - Pará" value="PA" />
                    <Picker.Item label="PB - Paraíba" value="PB" />
                    <Picker.Item label="PR - Paraná" value="PR" />
                    <Picker.Item label="PE - Pernambuco" value="PE" />
                    <Picker.Item label="PI - Piauí" value="PI" />
                    <Picker.Item label="RJ - Rio de Janeiro" value="RJ" />
                    <Picker.Item label="RN - Rio Grande do Norte" value="RN" />
                    <Picker.Item label="RS - Rio Grande do Sul" value="RS" />
                    <Picker.Item label="RO - Rondônia" value="RO" />
                    <Picker.Item label="RR - Roraima" value="RR" />
                    <Picker.Item label="SC - Santa Catarina" value="SC" />
                    <Picker.Item label="SP - São Paulo" value="SP" />
                    <Picker.Item label="SE - Sergipe" value="SE" />
                    <Picker.Item label="TO - Tocantins" value="TO" />
                  </Picker>
                </View>
              </View>
            )}

            {/* LINK TROCAR MODO */}
            <TouchableOpacity
              onPress={() => setIsCreateMode(!isCreateMode)}
              style={styles.switchMode}
            >
              <Text style={styles.switchText}>
                {isCreateMode
                  ? 'Já possui uma conta? Acesse'
                  : 'Não possui uma conta? Crie uma'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ============ BLOCO 3 - BOTÃO (FORA DO SCROLLVIEW) ============ */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isCreateMode ? 'Criar Conta' : 'Entrar'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  pickerStyle: { color: '#777' },

  /* ===== BLOCO 1 ===== */
  topSection: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },

  topImage: {
    width: 120,
    height: 120,
  },

  /* ===== BLOCO 2 ===== */
  middleSection: {
    flex: 4,
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
  },

  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#EEE',
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },

  pickerContainer: {
    width: '100%',
    marginBottom: 12,
  },

  picker: {
    backgroundColor: '#EEE',
    borderRadius: 10,
  },

  switchMode: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  switchText: {
    color: '#3366FF',
    fontSize: 16,
  },

  /* ===== BLOCO 3 ===== */
  bottomSection: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 15,
  },

  button: {
    backgroundColor: '#3366FF',
    paddingVertical: 15,
    width: '85%',
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
