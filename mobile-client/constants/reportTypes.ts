import { ReportType } from "@/types";

const reportTypes = [
  {
    label: '🔪 Robo a mano armada',
    value: 'robbery_with_violence'
  },
  {
    label: '💀 Homicidio',
    value: 'homicide'
  },
  {
    label: '🚗 Robo de vehículo',
    value: 'vehicle_theft'
  },
  {
    label: '👪 Violencia doméstica',
    value: 'domestic_violence'
  },
  {
    label: '😠 Acoso sexual',
    value: 'sexual_harassment'
  },
  {
    label: '💼 Acoso laboral',
    value: 'workplace_harassment'
  },
  {
    label: '⚧️ Violencia de género',
    value: 'gender_based_violence'
  },
  {
    label: '💥 Choque',
    value: 'collision'
  },
  {
    label: '🚙 Choque múltiple',
    value: 'multiple_collision'
  },
  {
    label: '🔥 Incendio',
    value: 'fire'
  },
  {
    label: '🚑 Accidente de tránsito con heridos',
    value: 'traffic_accident_with_injuries'
  },
  {
    label: '⚰️ Accidente de tránsito con fallecidos',
    value: 'traffic_accident_with_deaths'
  },
  {
    label: '❓ Otro',
    value: 'other'
  }
]

export default reportTypes
