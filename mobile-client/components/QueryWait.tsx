import { UseQueryResult } from "@tanstack/react-query"
import EmptyMsg from "./EmptyMsg"
import ErrorMsg from "./ErrorMsg"
import LoadingMsg from "./LoadingMsg"
import { View } from "react-native"

const Content = ({ qr }: {
  qr: UseQueryResult
}) => {
  if (qr.isLoading) return <LoadingMsg />
  if (qr.isError) {
    console.error(qr.error)
    return <ErrorMsg />
  }
  if (qr.data === null) return <EmptyMsg />
}

export default ({ qr }: {
  qr: UseQueryResult
}) => (
  <View className="p-6 flex-1">
    <Content qr={qr} />
  </View>
)
