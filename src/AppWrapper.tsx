import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import Onboarding from './components/Onboarding'
import App from './App'

const DONE_KEY = 'assettracker-pro_onboarded_v1'
type Phase = 'splash' | 'onboard' | 'app'

export default function AppWrapper() {
  const [phase, setPhase] = useState<Phase>('splash')
  const features = ["Track all asset types", "Net worth chart", "Currency support", "Offline and private"]
  return (
    <>
      {phase === 'splash' && <SplashScreen onDone={()=>setPhase(localStorage.getItem(DONE_KEY)?'app':'onboard')} color1="#10b981" color2="#059669" emoji="🏦" name="AssetTracker Pro" tagline="Personal asset and net worth tracker"/>}
      {phase === 'onboard' && <Onboarding onDone={()=>{localStorage.setItem(DONE_KEY,'1');setPhase('app')}} color1="#10b981" emoji="🏦" name="AssetTracker Pro" features={features}/>}
      {phase === 'app' && <App/>}
    </>
  )
}