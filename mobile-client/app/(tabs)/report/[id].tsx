import { ReportService } from "@/api/services/report";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { ScrollView, Text, View } from "react-native";

const Content = () => {
  return (
    <div>

    </div>
  )
}

const QueryLayer = () => {
  const { id } = useLocalSearchParams()

  console.log(id)

  const reportQuery = useQuery({
    queryKey: ['reports', id],
    queryFn: () => ReportService.getReport(id as string)
  })

  return <Content />
}

export default function Report() {
  return (
    <ScrollView className="flex-1 bg-default">
      <QueryLayer />
    </ScrollView>
  );
}
