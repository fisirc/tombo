import dayjs from "dayjs";

export function formatDate(dateString: string): string {
  const date = dayjs(dateString)
  return date.format('DD/MM/YYYY')
}

export function formatTimeElapsed(dateString: string): string {
  const date = dayjs(dateString)
  return date.toNow()
}

