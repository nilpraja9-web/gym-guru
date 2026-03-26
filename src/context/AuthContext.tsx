import {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
  
  type ReactNode,
} from "react";
import { useUser } from "@clerk/react";
import type { User } from "../types/Index";
import {api} from "../lib/api";
import type { UserProfile, TrainingPlan } from "../types/Index";

interface AuthContextType {
  user: User | null;
  plan: TrainingPlan | null;
  isLoading: boolean;
  saveProfile: (profile: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const { user: clerkUser, isLoaded } = useUser();
  const isRefreshingRef =useRef(false)
  

  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
        createdAt: clerkUser.createdAt?.toISOString() ?? new Date().toISOString(),
      }
    : null;
    useEffect(()=>{
      if(user){
        refreshData();
      }else {
        setPlan(null);
      }
    },[user?.id,isLoaded])


    const refreshData = useCallback (async()=>{
      if(!user || isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      try {
        const planData = await api.getCurrentPlan(user.id).catch(()=>null);
        if(planData){
          setPlan({
            id: planData.id,
            userId: planData.userId,
            overview: planData.planJson.overview,
            weeklySchedule: planData.planJson.weeklySchedule,
            progression: planData.planJson.progression,
            version: planData.version,
            createdAt: planData.createdAt,
        });
        }
        
      } catch (error) {
        console.error ("Error refreshing data",error)
        
      }finally{
        isRefreshingRef.current = false;
      }

    },[user?.id]
      );

  async function saveProfile(profileData: Omit<UserProfile, 'userId' | 'updatedAt'>) {
    
    if (!user) {
      throw new Error("User not found");
    }
      await api.saveProfile(user.id, profileData); 
      await refreshData();
    
      

  }
  
  async function generatePlan() {
    
    if (!user) {
      throw new Error("User not found");
    }
    console.log(user.id);
    await api.generatePlan(user.id);
    await refreshData();
    
  }

  return (
    <AuthContext.Provider value={{ user,plan ,saveProfile, isLoading: !isLoaded, generatePlan, refreshData }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
