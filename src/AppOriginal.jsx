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

const BASE_URL = 'https://c07ae8a09d31.ngrok-free.app';

// const payloadGlobal = {
//   area: { type: 'global', city: null, state: null },
//   metrics: {
//     total: 2847,
//     anaemic: 456,
//     prevalence: 0.16,
//     baselinePrevalence: 0.142,
//     deltaPrevalence: 0.018,
//     deltaPercent: 0.127,
//     severity: 'moderate',
//   },
//   breakdown: {
//     type: 'by-state',
//     states: [
//       {
//         state: 'SP',
//         metrics: {
//           total: 1245,
//           anaemic: 187,
//           prevalence: 0.15,
//           baselinePrevalence: 0.135,
//           deltaPrevalence: 0.015,
//           deltaPercent: 0.111,
//           severity: 'low',
//         },
//       },
//       {
//         state: 'GO',
//         metrics: {
//           total: 892,
//           anaemic: 151,
//           prevalence: 0.169,
//           baselinePrevalence: 0.148,
//           deltaPrevalence: 0.021,
//           deltaPercent: 0.142,
//           severity: 'moderate',
//         },
//       },
//       {
//         state: 'MG',
//         metrics: {
//           total: 710,
//           anaemic: 118,
//           prevalence: 0.4,
//           baselinePrevalence: 0.151,
//           deltaPrevalence: 0.015,
//           deltaPercent: 0.099,
//           severity: 'moderate',
//         },
//       },
//       {
//         state: 'RJ',
//         metrics: {
//           total: 980,
//           anaemic: 280,
//           prevalence: 0.62,
//           baselinePrevalence: 0.5,
//           deltaPrevalence: 0.12,
//           deltaPercent: 0.24,
//           severity: 'high',
//         },
//       },
//       {
//         state: 'BA',
//         metrics: {
//           total: 540,
//           anaemic: 320,
//           prevalence: 0.88,
//           baselinePrevalence: 0.75,
//           deltaPrevalence: 0.13,
//           deltaPercent: 0.173,
//           severity: 'severe',
//         },
//       },
//     ],
//   },
// };

// const payloadStates = {
//   SP: {
//     area: { type: 'admin-area', state: 'SP' },
//     metrics: {
//       total: 1245,
//       anaemic: 187,
//       prevalence: 0.15,
//       baselinePrevalence: 0.135,
//       deltaPrevalence: 0.015,
//       deltaPercent: 0.111,
//       severity: 'low',
//     },
//     breakdown: {
//       type: 'by-city',
//       cities: [
//         {
//           city: 'São Paulo',
//           metrics: { total: 500, anaemic: 60, prevalence: 0.12 },
//         },
//         {
//           city: 'Campinas',
//           metrics: { total: 380, anaemic: 52, prevalence: 0.137 },
//         },
//         {
//           city: 'Santos',
//           metrics: { total: 365, anaemic: 75, prevalence: 0.205 },
//         },
//       ],
//     },
//   },

//   GO: {
//     area: { type: 'admin-area', state: 'GO' },
//     metrics: {
//       total: 892,
//       anaemic: 151,
//       prevalence: 0.169,
//       baselinePrevalence: 0.148,
//       deltaPrevalence: 0.021,
//       deltaPercent: 0.142,
//       severity: 'moderate',
//     },
//     breakdown: {
//       type: 'by-city',
//       cities: [
//         {
//           city: 'Goiânia',
//           metrics: { total: 487, anaemic: 85, prevalence: 0.175 },
//         },
//         {
//           city: 'Aparecida de Goiânia',
//           metrics: { total: 245, anaemic: 40, prevalence: 0.163 },
//         },
//         {
//           city: 'Anápolis',
//           metrics: { total: 160, anaemic: 26, prevalence: 0.163 },
//         },
//       ],
//     },
//   },

//   MG: {
//     area: { type: 'admin-area', state: 'MG' },
//     metrics: {
//       total: 710,
//       anaemic: 118,
//       prevalence: 0.4,
//       baselinePrevalence: 0.151,
//       deltaPrevalence: 0.015,
//       deltaPercent: 0.099,
//       severity: 'moderate',
//     },
//     breakdown: {
//       type: 'by-city',
//       cities: [
//         {
//           city: 'Belo Horizonte',
//           metrics: { total: 300, anaemic: 120, prevalence: 0.4 },
//         },
//         {
//           city: 'Uberlândia',
//           metrics: { total: 220, anaemic: 76, prevalence: 0.345 },
//         },
//         {
//           city: 'Contagem',
//           metrics: { total: 190, anaemic: 60, prevalence: 0.315 },
//         },
//       ],
//     },
//   },

//   RJ: {
//     area: { type: 'admin-area', state: 'RJ' },
//     metrics: {
//       total: 980,
//       anaemic: 280,
//       prevalence: 0.62,
//       baselinePrevalence: 0.5,
//       deltaPrevalence: 0.12,
//       deltaPercent: 0.24,
//       severity: 'high',
//     },
//     breakdown: {
//       type: 'by-city',
//       cities: [
//         {
//           city: 'Rio de Janeiro',
//           metrics: { total: 400, anaemic: 250, prevalence: 0.625 },
//         },
//         {
//           city: 'Niterói',
//           metrics: { total: 300, anaemic: 150, prevalence: 0.5 },
//         },
//         {
//           city: 'Volta Redonda',
//           metrics: { total: 280, anaemic: 120, prevalence: 0.428 },
//         },
//       ],
//     },
//   },

//   BA: {
//     area: { type: 'admin-area', state: 'BA' },
//     metrics: {
//       total: 540,
//       anaemic: 320,
//       prevalence: 0.88,
//       baselinePrevalence: 0.75,
//       deltaPrevalence: 0.13,
//       deltaPercent: 0.173,
//       severity: 'severe',
//     },
//     breakdown: {
//       type: 'by-city',
//       cities: [
//         {
//           city: 'Salvador',
//           metrics: { total: 250, anaemic: 200, prevalence: 0.8 },
//         },
//         {
//           city: 'Feira de Santana',
//           metrics: { total: 180, anaemic: 160, prevalence: 0.88 },
//         },
//         {
//           city: 'Vitória da Conquista',
//           metrics: { total: 110, anaemic: 80, prevalence: 0.727 },
//         },
//       ],
//     },
//   },
// };

export default function AppOriginal() {
  const { logout } = useContext(AuthContext);
  const mapSeverityTypes = {
    none: 'Nenhuma',
    minor: 'Baixa',
    major: 'Moderada',
    critical: 'Crítica',
  };

  const [filter, setFilter] = useState({
    uf: null,
    period: 'PT24H',
    bucket: '1h',
  });

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [metrics, setMetrics] = useState(null);

  const requestPermission = async () => {
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        await axios
          .post(`${BASE_URL}/api/notifications/register`, {
            token: token,
            topic: 'anaemia-alerts-GO',
          })
          .catch(err => console.log('[ENVIO TOKEN]', err.message));
      }
    } catch {}
  };

  useEffect(() => {
    requestPermission();
  }, []);

  const fetchGlobal = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/analytics/anaemia/geo?bucket=${filter.bucket}&window=${filter.period}`,
      );
      console.log(
        `${BASE_URL}/api/analytics/anaemia/geo?bucket=${filter.bucket}&window=${filter.period}`,
        data,
      );
      return data;
    } catch (error) {
      console.log('erro buscando geral', error);
      return {
        breakdown: { cities: [] },
        metrics: null,
        breakdown: { states: [] },
      };
    }
  };

  const fetchPorEstado = async uf => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/analytics/anaemia/geo?state=${uf}&bucket=${filter.bucket}&window=${filter.period}`,
      );
      console.log(
        `${BASE_URL}/api/analytics/anaemia/geo?state=${uf}&bucket=${filter.bucket}&window=${filter.period}`,
        data,
      );
      return data;
    } catch (error) {
      console.log('erro buscando por uf', error);
      return { breakdown: { cities: [] }, metrics: null };
    }
  };

  const loadEstados = async () => {
    const res = await fetchGlobal();
    setMetrics(res.metrics);

    const mapped = res.breakdown.states.map(s => ({
      uf: s.state,
      total: s.metrics.total,
      anaemic: s.metrics.anaemic,
      prevalence: Number((s.metrics.prevalence * 100).toFixed(1)),
    }));

    setEstados(mapped);
  };

  const loadMunicipios = async uf => {
    const res = await fetchPorEstado(uf);

    if (!res.breakdown.cities || res.breakdown.cities.length === 0) {
      setMunicipios([]);
      return;
    }

    const mapped = res.breakdown.cities.map(c => ({
      city: c.city,
      total: c.metrics.total,
      anaemic: c.metrics.anaemic,
      prevalence: Number((c.metrics.prevalence * 100).toFixed(1)),
    }));

    setMunicipios(mapped);
  };

  useEffect(() => {
    loadEstados();
  }, [filter.period]);

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

  const handleSelectUF = uf => {
    setFilter(f => ({ ...f, uf }));
    loadMunicipios(uf);
  };

  const periodLabels = {
    PT24H: 'Dia',
    P1W: 'Semana',
    P1M: 'Mês',
    P6M: 'Semestre',
    P1Y: 'Ano',
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
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
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
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
        </View>

        <View style={styles.mapCard}>
          <BrazilMap
            width={320}
            colors={buildMapColors()}
            onClick={handleSelectUF}
          />
        </View>

        {metrics && (
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Métricas Gerais</Text>

            <View style={styles.cardGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{metrics.total}</Text>
                <Text style={styles.metricLabel}>Total</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{metrics.anaemic}</Text>
                <Text style={styles.metricLabel}>Anêmicos</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={[styles.metricValue, styles.prevalenceValue]}>
                  {(metrics.prevalence * 100).toFixed(1)}%
                </Text>
                <Text style={styles.metricLabel}>Prevalência</Text>
              </View>

              <View style={styles.metricCard}>
                <Text style={[styles.metricValue, styles.deltaValue]}>
                  {metrics.deltaPrevalence > 0 ? '+' : ''}
                  {(metrics.deltaPrevalence * 100).toFixed(2)}%
                </Text>
                <Text style={styles.metricLabel}>Variação</Text>
              </View>

              <View style={styles.severityCard}>
                <Text style={styles.severityLabel}>Severidade</Text>
                <Text style={[styles.severityValue, styles[metrics.severity]]}>
                  {mapSeverityTypes[metrics.severity]}
                </Text>
              </View>
            </View>
          </View>
        )}

        {filter.uf && municipios.length > 0 && (
          <View style={styles.details}>
            <Text style={styles.sectionTitle}>Distribuição em {filter.uf}</Text>

            {municipios.map((c, i) => (
              <View key={i} style={styles.cityBox}>
                <View style={styles.cityRow}>
                  <Text style={styles.cityPercentage}>{c.prevalence}%</Text>
                  <Text style={styles.cityName}>{c.city}</Text>
                </View>
                <Text
                  style={styles.description}
                >{`${c.anaemic}/${c.total} dos exames`}</Text>
              </View>
            ))}
          </View>
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
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
  },
  filtersContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  details: { paddingBottom: 15 },
  filterRow: { flexDirection: 'row', justifyContent: 'space-between' },
  filterColumn: { display: 'flex' },
  filterLabel: { marginBottom: 8, fontSize: 16 },
  filterOption: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  filterOptionActive: { backgroundColor: '#3366ff' },
  filterOptionText: { fontSize: 14, color: '#333' },
  filterOptionTextActive: { color: '#fff' },
  metricsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
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
  metricValue: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  metricLabel: { fontSize: 12, textAlign: 'center' },
  prevalenceValue: { color: '#ff6600' },
  deltaValue: { color: '#ff0000' },
  severityCard: {
    width: '100%',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  severityLabel: { fontSize: 14, marginBottom: 8 },
  severityValue: { fontSize: 20, fontWeight: 'bold' },

  critical: { color: '#ff9900' },
  major: { color: '#ff5500' },
  low: { color: '#008800' },
  none: { color: '#888' },

  cityBox: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cityPercentage: { width: '20%', fontSize: 18, fontWeight: 'bold' },
  cityName: { width: '80%', fontSize: 16 },
  description: { fontSize: 14 },
});
