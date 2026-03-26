import { Show,RedirectToSignIn } from '@clerk/react'
import { useAuth } from "../context/AuthContext" 
import { Card } from "../components/ui/Card"
import { Select } from "../components/ui/Select"
import { useState } from 'react';
import { Textarea } from '../components/ui/Textarea';
import { Button } from '../components/ui/Button';
import { Loader2, MoveRight } from 'lucide-react';
import type { UserProfile } from '../types/Index';
import { useNavigate } from 'react-router-dom';

const goalOptions =[
  {value: "bulk", label: "Build Muscle"},
  {value: "cut", label: "Fat Loss"},
  {value: "recomp", label: "Body Recomposition"},
  {value: "strength", label: "Build Strength"},
  {value: "endurance", label: "Improve Endurance"},
];

const experienceOptions = [
    {value: "beginner", label: "Beginner"},
    {value: "intermediate", label: "Intermediate"},
    {value: "advanced", label: "Advanced"},

    ];
const daysOptions = [
        {value: "1", label: "1 day / week"},
        {value: "2", label: "2 days/ week"},
        {value: "3", label: "3 days/ week"},
        {value: "4", label: "4 days/ week"},
        {value: "5", label: "5 days/ week"},
        {value: "6", label: "6 days/ week"},
    ];

    const sessionOptions = [
      { value: "30", label: "30 minutes"},
      { value: "45", label: "45 minutes"},
      { value: "60", label: "60 minutes"},
      { value: "75", label: "75 minutes"},
      { value: "90", label: "90 minutes"},
    ]
    const equipmentOptions = [
      { value: "full_gym", label: "Full Gym"},
      { value: "home", label: "Home Gym"},
      { value: "bodyweight", label: "Bodyweight"},
    ];
    const splitOptions = [
      { value: "full_body", label: "Full Body"},
      { value: "upper_lower", label: "Upper/Lower"},
      { value: "push_pull_legs", label: "Push/Pull/Legs"},
      { value: "custom", label: "Let AI Decide" },
    ];



const initialFormData = {
  goal: "bulk",
  experience: "intermediate",
  daysPerWeek: "4",
  sessionDuration: "60",
  equipment: "full_gym",
  injuries: "",
  split: "full_body",
};


export default function Onboarding() {
    const { user, isLoading,saveProfile,generatePlan} = useAuth();
    const [formData, setFormData] = useState(initialFormData);

    const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

    


    function updateForm(field:string, value : string){
      setFormData(prev => ({...prev, [field]: value}));
    }
    async function handleQuestionner(e: React.FormEvent) {
      e.preventDefault();
      const profile: Omit<UserProfile, 'userId' | 'updatedAt'> = {
        goal: formData.goal as UserProfile["goal"],
        experience: formData.experience as UserProfile["experience"],
        daysPerWeek: parseInt(formData.daysPerWeek),
        sessionDuration: parseInt(formData.sessionDuration),
        equipment: formData.equipment as UserProfile["equipment"],
        injuries: formData.injuries || undefined,
        split: formData.split as UserProfile["split"],
      }
       try{
            setError("");
            await saveProfile(profile); 
            setIsGenerating(true);
            await generatePlan();
            navigate("/profile");
          }catch(err){
            setError(err instanceof Error ? err.message : "Failed to save profile");
          }finally{
            setIsGenerating(false);
          }      
    }
    

    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log(user);
        

    if (!user) {
        return <RedirectToSignIn />;
        
    }

    return (
         <Show when="signed-in">
            <div className='min-h-screen pt-24 pb-12 px-6'>
                <div className='max-w-xl mx-auto    text-white'> 
                    {/*progess indicator */}
                    {/*progess iquestionner*/}
                    { !isGenerating ?(<Card variant="bordered" className="p-7">
                      <h1 className='text-2xl font-bold mb-6 text-center'>What is your main fitness goal?</h1>
                      {error && <div className="p-3 mb-6 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">{error}</div>}
                    <p className='text-center text-muted-foreground mb-8'>This helps us create the perfect plan for you</p>
                    <form  onSubmit={handleQuestionner}  className='space-y-5'>
                      
                      
                      <Select 
                      id="experience"
                      label="Training experience"
                      options={experienceOptions}
                      value={formData.experience}
                      onChange={(e) => updateForm("experience", e.target.value)}
                      />
                      <Select 
                      id="goal"
                      label="Goal"
                      options={goalOptions}
                      value={formData.goal}
                      onChange={(e) => updateForm("goal", e.target.value)}
                      />
                    <div className='grid grid-cols-2 gap-4'>

                      
                      <Select 
                      id="daysPerWeek"
                      label="Days per week"
                      options={daysOptions}
                      value={formData.daysPerWeek}
                      onChange={(e) => updateForm("daysPerWeek", e.target.value)}
                      />

                      <Select 
                      id="sessionDuration"
                      label="Session duration"
                      options={sessionOptions}
                      value={formData.sessionDuration}
                      onChange={(e) => updateForm("sessionDuration", e.target.value)}
                      />  
                    </div>
                    <Select 
                      id="equipment"
                      label="Equipment"
                      options={equipmentOptions}
                      value={formData.equipment}
                      onChange={(e) => updateForm("equipment", e.target.value)}
                      />
                      <Select 
                      id="split"
                      label="Training split"
                      options={splitOptions}
                      value={formData.split}
                      onChange={(e) => updateForm("split", e.target.value)}
                      />

                      <Textarea 
                      id="injuries"
                      label="Any injuries or limitations?"
                      placeholder="E.g Lower back pain, knee pain, shoulder pain, etc."
                      rows={3}  
                      value={formData.injuries}
                      onChange={(e) => updateForm("injuries", e.target.value)}
                      />

                    <div className='flex gap-3 pt-2'>
                      <Button type="button" variant ="secondary" className="flex-1 gap-2" onClick={() => setFormData(initialFormData)}>
                        Back
                      </Button>
                      <Button type="submit" className="flex-1">
                       Generate My Plan  <MoveRight />
                      </Button>
                    </div>
                    </form>
                    </Card>) : (
                      <Card variant='bordered' className='text-center py-16 '  >
                        <Loader2 className="animate-spin mx-auto mb-4" />
                        <p className="text-center">Generating your personalized workout plan...</p>
                      </Card>
                    )
                      }
                    {/*progess indicator */}
                    
                </div>
            </div>
        </Show>
    );
}

           
        