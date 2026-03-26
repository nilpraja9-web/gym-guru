import type { UserProfile } from "../types/Index";


const BASE_URL= import.meta.env.VITE_API_URL;

async function post(path:String , body :  Record<string, unknown>) {
    const res =await fetch (`${BASE_URL}/api${path}`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || "Request failed");
    }

    return res.json();
    
}
async function get(path: string) {
  const res = await fetch(`${BASE_URL}/api${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.details || errorData.error || "Request failed");
  }

  return res.json();
}


    

export const api = {
  saveProfile: (
    userId: string,
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => {
    return post("/profile", { userId, ...profile });
   
  },
   generatePlan: (userId: string) => {
    return post("/plan/generate", { userId });
   
  },
  getCurrentPlan: (userId: string) => {
    return get(`/plan/current?userId=${userId}`);
  }
}