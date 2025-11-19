// =========================
// APP ORIGINAL REFACTORED COM 2 MOCKS + FILTROS + REQUISIÇÃO
// =========================

import React, { useEffect, useContext, useState } from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import { AuthContext } from './auth/AuthContext';
import BrazilMap from './components/Brazil';

// =======================================
// MOCK 1 — ESTADOS (resposta simulada de /teste1)
// =======================================
const mockEstados = {
  area: { type: 'global', center: null },
  timeWindow: {
    from: '2025-11-16T11:44:32.654+00:00',
    to: '2025-11-17T11:44:32.654+00:00',
    bucket: '15m',
    baselineFrom: '2025-11-15T11:44:32.654+00:00',
    baselineTo: '2025-11-16T11:44:32.654+00:00',
  },
  metrics: {
    total: 26500,
    anaemic: 5000,
    prevalence: 18.87,
    baselinePrevalence: 15.5,
    deltaPrevalence: 3.37,
    deltaPercent: 21.74,
    severity: 'moderate',
    minSamples: 10,
    minDistinctPatients: 5,
  },
  timeSeries: [
    { uf: 'GO', total: 3000, anaemic: 600, prevalence: 60 },
    { uf: 'SP', total: 10000, anaemic: 2000, prevalence: 30 },
    { uf: 'RJ', total: 6500, anaemic: 900, prevalence: 10 },
    { uf: 'MG', total: 7000, anaemic: 1500, prevalence: 80 },
  ],
};

// =======================================
// MOCK 2 — MUNICÍPIOS (resposta simulada de /teste2?uf=XX)
// =======================================
const mockMunicipios = uf => ({
  area: { type: 'state', state: uf },
  timeWindow: {
    from: '2025-11-16T11:44:32.654+00:00',
    to: '2025-11-17T11:44:32.654+00:00',
    bucket: '15m',
  },
  metrics: {
    total: 0,
    anaemic: 0,
    prevalence: 0,
    baselinePrevalence: 0,
    deltaPrevalence: 0,
    deltaPercent: null,
    severity: 'none',
    minSamples: 10,
    minDistinctPatients: 5,
  },
  timeSeries: [
    { city: 'Cidade 1', total: 1200, anaemic: 200, prevalence: 40 },
    { city: 'Cidade 2', total: 1600, anaemic: 320, prevalence: 20 },
  ],
});

export default function AppOriginal() {
  const { logout } = useContext(AuthContext);

  const [filter, setFilter] = useState({
    uf: null,
    period: 'year',
    bucket: '15m',
  });

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  // ================= PERMISSÃO =================
  const requestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        await messaging().registerDeviceForRemoteMessages();
        await messaging().getToken();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  // ================= BUSCA ESTADOS =================
  const loadEstados = async () => {
    try {
      // const res = await axios.post('/teste1', {...})
      const res = mockEstados; // mock
      setEstados(res.timeSeries);
    } catch (e) {
      console.log('Erro estados:', e);
    }
  };

  useEffect(() => {
    loadEstados();
  }, [filter.period, filter.bucket]);

  // ================= BUSCA MUNICÍPIOS =================
  const loadMunicipios = async uf => {
    try {
      // const res = await axios.post(`/teste2?uf=${uf}`, {...})
      const res = mockMunicipios(uf); // mock
      setMunicipios(res.timeSeries);
    } catch (e) {
      console.log('Erro municípios:', e);
    }
  };

  // ================= CORES MAPA =================
  const buildMapColors = () => {
    let colors = {};

    estados.forEach(item => {
      let color = '#FFCCCC';

      if (filter.uf === item.uf) {
        color = '#0000FF';
      } else {
        const p = item.prevalence;
        if (p > 80) color = '#FF0000';
        else if (p > 60) color = '#FF3333';
        else if (p > 40) color = '#FF6666';
        else if (p > 20) color = '#FF9999';
      }

      colors[item.uf] = color;
    });

    return colors;
  };

  // ================= CLIQUE ESTADO =================
  const handleSelectUF = uf => {
    setFilter(f => ({ ...f, uf }));
    loadMunicipios(uf);
  };

  const periodLabels = {
    day: 'Dia',
    week: 'Semana',
    month: 'Mês',
    semester: 'Semestre',
    year: 'Ano',
  };

  const bucketLabels = {
    '15m': '15 minutos',
    '1h': '1 hora',
    '1d': '1 dia',
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* TOPO */}
        <View style={styles.topRow}>
          <Image
            source={require('./assets/logo_app_sec.png')}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={logout}>
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Monitor de Anemia</Text>

        {/* MAPA */}
        <View style={styles.mapCard}>
          <BrazilMap
            width={320}
            colors={buildMapColors()}
            onClick={handleSelectUF}
          />
        </View>

        {/* FILTROS */}
        <View style={styles.filtersContainer}>
          <Text style={styles.sectionTitle}>Filtros</Text>

          <View style={styles.filterRow}>
            {/* PERÍODO */}
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>Período</Text>
              {Object.keys(periodLabels).map(key => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterOption,
                    filter.period === key && styles.filterOptionActive,
                  ]}
                  onPress={() => setFilter(f => ({ ...f, period: key }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filter.period === key && styles.filterOptionTextActive,
                    ]}
                  >
                    {periodLabels[key]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* BUCKET */}
            <View style={styles.filterColumn}>
              <Text style={styles.filterLabel}>Agrupamento</Text>
              {Object.keys(bucketLabels).map(key => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.filterOption,
                    filter.bucket === key && styles.filterOptionActive,
                  ]}
                  onPress={() => setFilter(f => ({ ...f, bucket: key }))}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filter.bucket === key && styles.filterOptionTextActive,
                    ]}
                  >
                    {bucketLabels[key]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        {/* MÉTRICAS */}
        <View style={styles.metricsContainer}>
          <Text style={styles.sectionTitle}>Métricas Gerais</Text>

          <View style={styles.cardGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {mockEstados.metrics.total.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Total de Exames</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>
                {mockEstados.metrics.anaemic.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Anêmicos</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, styles.prevalenceValue]}>
                {mockEstados.metrics.prevalence.toFixed(1)}%
              </Text>
              <Text style={styles.metricLabel}>Prevalência</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={[styles.metricValue, styles.deltaValue]}>
                {mockEstados.metrics.deltaPrevalence > 0 ? '+' : ''}
                {mockEstados.metrics.deltaPrevalence.toFixed(2)}%
              </Text>
              <Text style={styles.metricLabel}>Variação</Text>
            </View>

            <View style={styles.severityCard}>
              <Text style={styles.severityLabel}>Severidade</Text>
              <Text
                style={[
                  styles.severityValue,
                  styles[mockEstados.metrics.severity],
                ]}
              >
                {mockEstados.metrics.severity.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        {/* MUNICÍPIOS */}
        {filter.uf && (
          <>
            <Text style={styles.sectionTitle}>Distribuição em {filter.uf}</Text>

            {municipios.map((c, i) => (
              <View key={i} style={styles.cityBox}>
                <View style={styles.cityRow}>
                  <Text style={styles.cityPercentage}>{c.prevalence}%</Text>
                  <Text style={styles.cityName}>{c.city}</Text>
                </View>

                <Text style={styles.description}>
                  {`${c.anaemic}/${c.total} dos exames`}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, resizeMode: 'contain' },
  logoutText: { fontSize: 18 },
  title: { fontSize: 22, textAlign: 'center', marginVertical: 15 },
  mapCard: {
    backgroundColor: '#EEE',
    padding: 10,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
  },
  filtersContainer: {
    width: '100%',
    marginBottom: 20,
  },

  sectionTitle: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  filterColumn: { width: '45%' },
  filterLabel: { marginBottom: 8, fontSize: 16 },
  filterOption: {
    padding: 10,
    backgroundColor: '#EEE',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  filterOptionActive: { backgroundColor: '#3366FF' },
  filterOptionText: { fontSize: 14, color: '#333' },
  filterOptionTextActive: { color: '#FFF' },
  cityBox: {
    backgroundColor: '#EEE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },

  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },

  cityPercentage: {
    width: '10%',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },

  cityName: {
    width: '90%',
    fontSize: 16,
  },

  description: {
    width: '100%',
    fontSize: 14,
  },
  metricsContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 12,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  prevalenceValue: {
    color: '#FF6600',
  },
  deltaValue: {
    color: '#FF0000',
  },
  severityCard: {
    width: '100%',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  severityLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  severityValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  none: {
    color: '#999',
  },
  moderate: {
    color: '#FF9900',
  },
  severe: {
    color: '#FF0000',
  },
});
