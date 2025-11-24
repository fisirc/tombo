import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { supabase } from './supabase';

export default class AlertService {
  static allowAlerts = async (user_id: string) => {
    const { status } = await Notifications.requestPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert(
        'Permiso denegado',
        'Puedes habilitar las notificaciones en el panel de ajustes',
      )
      return
    }

    const { data: device_id } = await Notifications.getExpoPushTokenAsync();

    const { error } = await supabase
      .from('device_identities')
      .upsert({ 
        user_id,
        device_id
      }, { onConflict: 'device_id' });

    if (error) console.error("Error saving token:", error);
  }
}
