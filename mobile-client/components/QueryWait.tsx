import { UseQueryResult } from "@tanstack/react-query"
import EmptyMsg from "./EmptyMsg"
import ErrorMsg from "./ErrorMsg"
import LoadingMsg from "./LoadingMsg"
import { View } from "react-native"

const Content = ({ query }: {
  query: UseQueryResult
}) => {
  if (query.isLoading) return <LoadingMsg />
  if (query.isError) return <ErrorMsg />
  if (query.data === null) return <EmptyMsg />
}

export default ({ query }: {
  query: UseQueryResult
}) => (
  <View className="p-6 flex-1">
    <Content query={query} />
  </View>
)
