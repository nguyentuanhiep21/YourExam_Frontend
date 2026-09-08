import { useState, useEffect } from "react";
import { profileApi } from "../api/profile.api";
import { Profile } from "../types";

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await profileApi.getProfileById(userId);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Không thể tải thông tin người dùng.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, isLoading, error };
}
