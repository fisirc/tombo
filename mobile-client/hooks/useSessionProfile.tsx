import { useQuery } from "@tanstack/react-query";
import ProfileService from "@/services/profile.service";
import useSession from "./useSession";

export default () => {
  const { data: session } = useSession();

  const query = useQuery({
    queryKey: ["profile", session?.user.id],
    queryFn: () => ProfileService.getProfile(session?.user.id as string),
    enabled: session !== null,
  });

  return query;
};
