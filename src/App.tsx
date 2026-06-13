import { useState } from 'react';
import { BarChart2, Plus, Trash2, X } from 'lucide-react';
const C='#10b981';
interface Asset { id:string; name:string; type:string; value:number; cost:number; date:string; }
const TYPES=['Cash','Stocks','Real Estate','Crypto','Vehicle','Other'];
const SK='at_assets_v1';
const ld=():Asset[]=>{try{return JSON.parse(localStorage.getItem(SK)||'[]')}catch{return[]}};

export default function App() {
  const [assets,setAssets]=useState<Asset[]>(ld);
  const [showAdd,setShowAdd]=useState(false);
  const [form,setForm]=useState({name:'',type:'Cash',value:'',cost:'',date:new Date().toISOString().split('T')[0]});
  const sv=(items:Asset[])=>{setAssets(items);localStorage.setItem(SK,JSON.stringify(items))};
  const totalValue=assets.reduce((a,x)=>a+x.value,0);
  const totalCost=assets.reduce((a,x)=>a+x.cost,0);
  const gain=totalValue-totalCost;
  const inp={width:'100%',background:'#080f08',border:'1px solid #14332050',borderRadius:'10px',padding:'11px 14px',color:'white',fontSize:'14px',outline:'none',fontFamily:'Inter'};
  const add=()=>{
    if(!form.name||!form.value)return;
    sv([{id:crypto.randomUUID(),name:form.name,type:form.type,value:+form.value,cost:+form.cost||+form.value,date:form.date},...assets]);
    setForm({name:'',type:'Cash',value:'',cost:'',date:new Date().toISOString().split('T')[0]});setShowAdd(false);
  };
  const byType=TYPES.map(t=>({type:t,total:assets.filter(a=>a.type===t).reduce((s,a)=>s+a.value,0)})).filter(x=>x.total>0);
  return (
    <div style={{minHeight:'100vh',background:'#080f08',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:`1px solid ${C}20`,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
          <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${C},#059669)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${C}30`}}><BarChart2 size={16} color="white"/></div>
          <div><div style={{fontWeight:'700',fontSize:'16px',color:'white',lineHeight:1}}>AssetTracker Pro</div>
          <div style={{fontSize:'11px',color:`${C}60`,marginTop:'2px'}}>{assets.length} assets tracked</div></div>
        </div>
        <button onClick={()=>setShowAdd(true)} style={{display:'flex',alignItems:'center',gap:'5px',padding:'8px 14px',borderRadius:'9px',background:C,border:'none',color:'white',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 4px 12px ${C}30`}}>
          <Plus size={13}/> Add
        </button>
      </header>
      {assets.length>0&&<div style={{margin:'12px 20px',padding:'16px',background:'#0a140a',border:`1px solid ${C}20`,borderRadius:'14px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',textAlign:'center'}}>
          <div><div style={{fontSize:'15px',fontWeight:'700',color:C}}>${totalValue.toLocaleString()}</div><div style={{fontSize:'10px',color:`${C}60`}}>Net Worth</div></div>
          <div><div style={{fontSize:'15px',fontWeight:'700',color:gain>=0?'#34d399':'#f87171'}}>{gain>=0?'+':''}${gain.toLocaleString()}</div><div style={{fontSize:'10px',color:`${C}60`}}>Gain/Loss</div></div>
          <div><div style={{fontSize:'15px',fontWeight:'700',color:'#6ee7b7'}}>{totalCost>0?((gain/totalCost)*100).toFixed(1):0}%</div><div style={{fontSize:'10px',color:`${C}60`}}>Return</div></div>
        </div>
        {byType.length>0&&<div style={{marginTop:'12px'}}>
          {byType.map(bt=><div key={bt.type} style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'5px'}}>
            <span style={{fontSize:'11px',color:`${C}80`,minWidth:'80px'}}>{bt.type}</span>
            <div style={{flex:1,height:'5px',background:`${C}15`,borderRadius:'3px',overflow:'hidden'}}>
              <div style={{width:`${(bt.total/totalValue*100)}%`,height:'100%',background:C,borderRadius:'3px'}}/>
            </div>
            <span style={{fontSize:'11px',color:'white',minWidth:'60px',textAlign:'right'}}>${bt.total.toLocaleString()}</span>
          </div>)}
        </div>}
      </div>}
      <div style={{flex:1,overflow:'auto',padding:'0 20px 20px',display:'flex',flexDirection:'column',gap:'8px'}}>
        {assets.length===0?(<div style={{textAlign:'center',padding:'60px 20px'}}>
          <div style={{fontSize:'52px',marginBottom:'16px'}}>🏦</div>
          <h3 style={{fontSize:'20px',fontWeight:'700',color:'white',marginBottom:'8px'}}>Track your wealth</h3>
          <p style={{color:`${C}60`,fontSize:'14px',lineHeight:'1.6',maxWidth:'240px',margin:'0 auto 24px'}}>Track every asset — cash, stocks, real estate, and more.</p>
          <button onClick={()=>setShowAdd(true)} style={{padding:'12px 24px',borderRadius:'10px',background:C,border:'none',color:'white',fontSize:'14px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter'}}>Add first asset</button>
        </div>):assets.map(a=>{
          const g=a.value-a.cost;const up=g>=0;
          return <div key={a.id} style={{background:'#0a140a',border:`1px solid ${up?C+'30':'#ef444430'}`,borderRadius:'12px',padding:'14px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div>
              <div style={{color:'white',fontSize:'13px',fontWeight:'500',marginBottom:'2px'}}>{a.name}</div>
              <div style={{color:`${C}60`,fontSize:'11px'}}>{a.type} · {a.date}</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
              <div style={{textAlign:'right'}}>
                <div style={{fontSize:'15px',fontWeight:'700',color:'white'}}>${a.value.toLocaleString()}</div>
                <div style={{fontSize:'11px',color:up?'#34d399':'#f87171'}}>{up?'+':''}${g.toLocaleString()}</div>
              </div>
              <button onClick={()=>sv(assets.filter(x=>x.id!==a.id))} style={{padding:'4px',background:'none',border:'none',cursor:'pointer',color:`${C}40`}}><Trash2 size={12}/></button>
            </div>
          </div>;
        })}
      </div>
      {showAdd&&(
        <div style={{position:'fixed',inset:0,background:'#00000080',zIndex:50,display:'flex',alignItems:'flex-end'}} onClick={e=>e.target===e.currentTarget&&setShowAdd(false)}>
          <div style={{width:'100%',background:'#0a140a',borderRadius:'20px 20px 0 0',border:`1px solid ${C}20`,padding:'24px'}}>
            <div style={{width:'36px',height:'3px',background:'#143320',borderRadius:'2px',margin:'0 auto 20px'}}/>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'14px'}}>
              <h3 style={{color:'white',fontSize:'16px',fontWeight:'700',fontFamily:'Inter'}}>Add Asset</h3>
              <button onClick={()=>setShowAdd(false)} style={{background:'none',border:'none',cursor:'pointer',color:`${C}60`}}><X size={16}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
              <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Asset name" style={inp} autoFocus/>
              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                {TYPES.map(t=><button key={t} onClick={()=>setForm({...form,type:t})} style={{padding:'4px 10px',borderRadius:'20px',border:`1px solid ${form.type===t?C:C+'30'}`,background:form.type===t?`${C}15`:'transparent',color:form.type===t?C:`${C}60`,fontSize:'12px',cursor:'pointer',fontFamily:'Inter'}}>{t}</button>)}
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
                <input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="Current value ($)" style={inp}/>
                <input type="number" value={form.cost} onChange={e=>setForm({...form,cost:e.target.value})} placeholder="Purchase cost ($)" style={inp}/>
              </div>
              <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} style={inp}/>
              <button onClick={add} style={{padding:'14px',borderRadius:'12px',background:C,border:'none',color:'white',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'Inter'}}>Add Asset</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}