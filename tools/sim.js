// 검증판 자동 플레이: 무작위 선택으로 N판을 돌려 에러, 칭호 조합 수, 끝난 방식, 카드 등장 빈도를 센다.
// 사용법: node tools/sim.js [판 수]
const fs=require('fs');
const html=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const js=html.split('<script>')[1].split('</script>')[0];
const harness = `
function play(policy){
  G=fresh(); prepTransition();
  const cardsSeen={}; let steps=0;
  for(let pi=0;pi<PRESIDENTS;pi++){
    startPresidency('P'+pi, pi%2?'여':'남');
    while(true){
      if(++steps>500) throw new Error('loop');
      if(G.phase==='play'&&!G.result){ cardsSeen[G.card.id]=(cardsSeen[G.card.id]||0)+1;
        // validate make+fx render paths
        const d=C[G.card.id],c=d.make(G.card.prm); fxHTML(c.L); fxHTML(c.R);
        choose(policy(G)); continue; }
      if(G.phase==='play'&&G.result){ next(); continue; }
      if(G.phase==='election'){ beginCount(); continue; }
      if(G.phase==='legacy'){ legacyHTML&&0; toGallery(); afterGallery(); break; }
      throw new Error('phase '+G.phase);
    }
    if(G.phase==='final') break;
  }
  countryText(); logText();
  return {titles:G.pres.map(P=>titleOf(P).main||'—'), ends:G.pres.map(P=>P.end), stage:G.stage, cardsSeen, n:G.pres.map(P=>P.decisions.length)};
}
module.exports={play};
`;
const m={exports:{}};
new Function('module','require',js+harness)(m,require);
const {play}=m.exports;
const N=+process.argv[2]||2000;
const combos={},titles={},ends={},stages=[0,0,0,0],cards={};
let errs=0;
for(let i=0;i<N;i++){
  try{
    const r=play(()=>Math.random()<.5?'L':'R');
    combos[r.titles.join(' · ')]=1;
    r.titles.forEach(t=>titles[t]=(titles[t]||0)+1);
    r.ends.forEach(e=>ends[e]=(ends[e]||0)+1);
    stages[r.stage]++;
    for(const k in r.cardsSeen)cards[k]=(cards[k]||0)+r.cardsSeen[k];
    for(const n of r.n) if(n<8 && !r.ends.some(e=>['국가 부도','혁명','국제 고립','포획된 국가'].includes(e))) {}
  }catch(e){errs++; if(errs<4)console.log('ERR',e.stack.split('\n').slice(0,4).join('\n'));}
}
console.log('games',N,'errors',errs);
console.log('distinct title combos',Object.keys(combos).length);
console.log('titles',Object.entries(titles).sort((a,b)=>b[1]-a[1]));
console.log('ends',ends);
console.log('final stages',stages);
console.log('cards',Object.entries(cards).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+(v/N).toFixed(2)).join(' '));
