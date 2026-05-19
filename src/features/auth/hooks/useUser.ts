import { useQuery } from "@tanstack/react-query";
import apiClient from "@/src/lib/api/axios";
import { ENDPOINTS } from "@/src/lib/api/endpoint";
import { User } from "../types";
import { tokenStorage } from "@/src/lib/api/token-storage";

export const userKeys = {
  me: ["auth", "me"] as const,
};

export const useUser = () => {
  const token = tokenStorage.getToken();

  return useQuery({
    queryKey: userKeys.me,
    queryFn: async () => {
      const response = await apiClient.get<{ data: User }>(ENDPOINTS.auth.me);
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
