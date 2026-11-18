'use strict';
const QUESTIONS=[
 {area:0,text:'Tenho reservado um tempinho para estudar e aprender?'},
 {area:0,text:'Procuro revisar o que aprendi durante as aulas?'},
 {area:1,text:'Realizo minhas tarefas de casa com dedicação?'},
 {area:1,text:'Entrego meus trabalhos e atividades com responsabilidade?'},
 {area:2,text:'Chego pontualmente às aulas?'},
 {area:2,text:'Procuro estar presente e participar dos dias de aula?'},
 {area:3,text:'Respeito os combinados e as orientações dos professores?'},
 {area:3,text:'Procuro manter a atenção e contribuir para um ambiente tranquilo?'},
 {area:4,text:'Trato meus colegas com carinho e respeito?'},
 {area:4,text:'Procuro ajudar meus colegas e resolver conflitos com diálogo?'}
];
const AREAS=['Tempo dedicado aos estudos','Realização de tarefas de casa e trabalhos','Pontualidade e assiduidade','Comportamento em sala de aula','Relação interpessoal com os colegas'];
const state={screen:'intro',student:{},answers:[],index:0,selected:null,confirmed:false,commitment:'',selfGrade:null,canvas:null,character:'',stars:0,advancing:false};
const $=(id)=>document.getElementById(id); const app=$('app');
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function changeProgress(num){$('progressWrap').classList.toggle('hidden',num===null);$('progressLabel').textContent=num===null?'':`${num} de 10 reflexões`;$('progressBar').style.width=`${num===null?0:num*10}%`;}
function render(){if(state.screen==='intro')return intro();if(state.screen==='identify')return identify();if(state.screen==='question')return question();if(state.screen==='feedback')return feedback();if(state.screen==='commit')return commit();if(state.screen==='selfgrade')return selfGrade();if(state.screen==='result')return result();}
function intro(){changeProgress(null);app.innerHTML=`<section class="card intro adventure-intro"><div class="emoji">🎒🌟📚</div><span class="eyebrow">Escola Adventista de Quixadá</span><h1>Minha Jornada da Aprendizagem</h1><p class="sub">Olá! Eu sou a Manu, sua orientadora educacional. Hoje você vai viver uma aventura de 10 missões! Escolha seu personagem, ganhe estrelas e avance pelo caminho até o troféu. 💙</p><div class="startbox"><h2>🧒 Escolha seu personagem</h2><div class="chars">${['👧🏻','👦🏻','👧🏽','👦🏾'].map(c=>`<button type="button" class="char ${state.character===c?'sel':''}" data-char="${c}" aria-pressed="${state.character===c}">${c}</button>`).join('')}</div><button id="start" class="btn yellow">🚀 COMEÇAR A JORNADA</button></div></section>`;document.querySelectorAll('[data-char]').forEach(b=>b.onclick=()=>{state.character=b.dataset.char;intro()});$('start').onclick=()=>{if(!state.character){alert('Escolha seu personagem para começar!');return;}state.screen='identify';render()};}
function mapHTML(){return `<div class="hud"><span class="badge">🎯 MISSÃO ${Math.min(state.index+1,10)} DE 10</span><span class="badge">⭐ Estrelas: ${state.index}/10</span></div><div class="adventure-map"><div class="map-sky">☀️ ☁️ ☁️</div><div class="trail">${QUESTIONS.map((q,i)=>`<div class="tile ${i<state.index?'done':''} ${i===state.index?'now':''}">${i===state.index?`<span class="player">${state.character}</span>`:''}<span>${['📚','🙋','📝','🎨','⏰','🔎','👩‍🏫','🏫','🤝','⏳'][i]}</span><small>${i+1}</small></div>`).join('')}</div><span class="finishflag">🏆</span></div>`;}
function identify(){changeProgress(null);app.innerHTML=`<section class="card"><span class="eyebrow">${state.character} Primeiro, vamos nos conhecer</span><h2>Quem está fazendo essa jornada? 💙</h2><p>Preencha apenas seu nome, turma e bimestre.</p><form id="studentForm" class="fields"><label class="field full">Nome completo<input name="name" maxlength="85" required placeholder="Digite seu nome completo" autocomplete="name"></label><label class="field">Turma<input name="classroom" required maxlength="35" placeholder="Ex.: 3º ano A"></label><label class="field">Bimestre<select name="term" required><option value="">Selecione</option><option>1º bimestre</option><option>2º bimestre</option><option>3º bimestre</option><option>4º bimestre</option></select></label><div class="field full"><div class="actions"><button type="button" class="btn secondary" id="back">Voltar</button><button class="btn" type="submit">Iniciar minhas reflexões →</button></div></div></form><p class="notice">As respostas são usadas nesta sessão para montar seu PDF. A participação será enviada à escola ao final da jornada, após a verificação da conexão.</p></section>`;$('back').onclick=()=>{state.screen='intro';render()};$('studentForm').onsubmit=e=>{e.preventDefault();let fd=new FormData(e.currentTarget);state.student=Object.fromEntries(fd.entries());state.student.date=new Date().toLocaleDateString('pt-BR');state.answers=[];state.index=0;state.selected=null;state.advancing=false;state.selfGrade=null;state.screen='question';render()};}
function message(score,index){const act=QUESTIONS[index].text.toLowerCase().replace('?','');if(score<=4){let msgs=[`Obrigado por responder com sinceridade! Você pode melhorar aos poucos. Que tal escolher um pequeno passo para ${act}? 💙`,`Sua sinceridade é muito importante! Com ajuda e dedicação, você pode avançar nessa área. 🌱`,`Cada dia é uma nova oportunidade de aprender! Um pequeno esforço já é um bom começo. 💛`];return msgs[index%3]}if(score<=7){let msgs=[`Você já está no caminho! Pense em uma atitude simples para continuar crescendo. ✨`,`Que bom que você está se observando! Pequenas mudanças podem fazer grande diferença. 🌻`,`Seu esforço merece atenção! Continue praticando e descubra o que pode melhorar. 💙`];return msgs[index%3]}let msgs=[`Que bom perceber sua dedicação! Continue cultivando esse hábito com carinho. 🌟`,`Você reconheceu uma conquista importante! Continue fazendo o seu melhor. 💙`,`Seu empenho é valioso! Siga aprendendo e ajudando quem está ao seu redor. ✨`];return msgs[index%3]}
function question(){changeProgress(state.index+1);let q=QUESTIONS[state.index];app.innerHTML=`<section class="card question-card">${mapHTML()}<span class="eyebrow">Reflexão ${state.index+1} de 10 · ${escapeHTML(AREAS[q.area])}</span><h2>Vamos pensar juntos! 🌈</h2><div class="question-text">${escapeHTML(q.text)}</div><div class="score-grid" role="group" aria-label="Escolha uma nota de 1 a 10">${Array.from({length:10},(_,i)=>`<button class="score" type="button" data-score="${i+1}">${i+1}</button>`).join('')}</div><p class="helper">1 = quero melhorar muito · 10 = estou muito satisfeito(a)</p><p class="small">Escolha uma nota: a Manu vai deixar uma mensagem para você, e seu personagem seguirá sozinho!</p></section>`;document.querySelectorAll('[data-score]').forEach(btn=>{btn.onclick=()=>{if(state.advancing)return;const score=Number(btn.dataset.score);if(!Number.isInteger(score)||score<1||score>10)return;state.advancing=true;state.selected=score;state.screen='feedback';render();}});}
function feedback(){
  const index=state.index,score=state.selected;
  if(score===null||!Number.isInteger(score))return;
  changeProgress(index+1);
  const note=message(score,index);
  app.innerHTML=`<section class="card question-card feedback-card">${mapHTML()}<div class="feedback-celebrate" aria-hidden="true">${state.character} 💙 ⭐</div><span class="eyebrow">Mensagem da Manu · Missão ${index+1}</span><h2>Obrigada por compartilhar! 🌟</h2><div class="feedback-message" role="status">${escapeHTML(note)}</div><div class="feedback-wait"><span class="feedback-spinner" aria-hidden="true"></span>Seu personagem vai avançar para a próxima missão...</div></section>`;
  // Mantém o feedback em tela, sem exigir outro clique ou confirmação.
  window.setTimeout(()=>{
    if(state.screen!=='feedback'||state.index!==index||state.selected!==score)return;
    state.answers.push(score);
    state.index++;
    state.selected=null;
    state.advancing=false;
    state.screen=state.index>=QUESTIONS.length?'commit':'question';
    render();
  },3000);
}
function commit(){changeProgress(10);app.innerHTML=`<section class="card"><div class="win-trophy">${state.character} 🏆 ⭐</div><span class="eyebrow">Você conseguiu! 🌟</span><h2>Uma última reflexão...</h2><p class="sub" style="margin-left:0">Você chegou muito longe! Agora que pensou sobre suas atitudes, quero fazer uma última pergunta.</p><form id="commitForm"><label class="field">O que você gostaria de melhorar no próximo bimestre?<textarea id="goal" maxlength="650" required placeholder="Escreva aqui seu compromisso para o próximo bimestre..."></textarea></label><div class="actions"><button class="btn" type="submit">Continuar →</button></div></form></section>`;$('goal').value=state.commitment;$('commitForm').onsubmit=e=>{e.preventDefault();state.commitment=$('goal').value.trim();if(!state.commitment)return;state.screen='selfgrade';render()};}
function selfGrade(){changeProgress(null);app.innerHTML=`<section class="card question-card"><div class="win-trophy">${state.character} ⭐🏆</div><span class="eyebrow">Sua última escolha</span><h2>Que nota você dá para sua participação nesta jornada?</h2><p class="sub">Pense na sua dedicação e responda com sinceridade. Esta nota é uma autoavaliação e não altera as notas das dez perguntas.</p><div class="final-grade-grid">${[['0','0,0'],['0.5','0,5'],['1','1,0']].map(([value,label])=>`<button type="button" class="final-grade-btn" data-final-grade="${value}">${label}</button>`).join('')}</div><p class="small">Ao escolher, você verá sua parabenização e sua Roda da Vida.</p></section>`;document.querySelectorAll('[data-final-grade]').forEach(btn=>{btn.onclick=()=>{if(state.advancing)return;state.advancing=true;state.selfGrade=Number(btn.dataset.finalGrade);state.screen='result';render();state.advancing=false}});}
const means=()=>[0,1,2,3,4].map(i=>(state.answers[2*i]+state.answers[2*i+1])/2);
function formatNumber(v){return Number(v).toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});}
const asset=new Image();asset.src='assets/roda-original.png';
async function createDocument(){await (asset.decode?asset.decode():new Promise((res,rej)=>{asset.onload=res;asset.onerror=rej}));const canvas=document.createElement('canvas');canvas.width=asset.naturalWidth;canvas.height=asset.naturalHeight;const ctx=canvas.getContext('2d');ctx.drawImage(asset,0,0);const sx=canvas.width/1024,sy=canvas.height/1448;ctx.save();ctx.scale(sx,sy);const data=state.student;function fitText(t,x,y,maxWidth,size=16,color='#143954'){let fontSize=size;ctx.textBaseline='middle';ctx.fillStyle=color;do{ctx.font=`bold ${fontSize}px Arial, sans-serif`;if(ctx.measureText(t).width<=maxWidth)break;fontSize-=.5}while(fontSize>10);ctx.fillText(t,x,y)}fitText('Quixadá',55,231,365,23,'#143f67');fitText(data.name,610,70,368,19);fitText(data.classroom,610,139,368,19);fitText(data.date,610,205,368,19);fitText(data.term,610,272,368,19);fitText('Autoavaliação geral',412,323,550,19,'#0b4167');const ratings=means();const centerX=514,centerY=1038,outerRadius=214;ratings.forEach((rating,i)=>{let theta=(-90+i*72)*Math.PI/180,spread=36*Math.PI/180;let r=outerRadius*rating/10;ctx.beginPath();ctx.moveTo(centerX,centerY);for(let a=theta-spread;a<=theta+spread+.0001;a+=(2*spread/48)){ctx.lineTo(centerX+r*Math.cos(a),centerY+r*Math.sin(a))}ctx.lineTo(centerX+r*Math.cos(theta+spread),centerY+r*Math.sin(theta+spread));ctx.closePath();ctx.fillStyle='rgba(46,166,224,.29)';ctx.fill();ctx.strokeStyle='rgba(0,111,186,.65)';ctx.lineWidth=1.5;ctx.stroke()});const avg=ratings.reduce((a,b)=>a+b,0)/5;fitText(formatNumber(avg),433,1402,105,21,'#105b88');ctx.restore();return canvas;}
function saveBytes(name,bytes,mime){let blob=new Blob([bytes],{type:mime});let url=URL.createObjectURL(blob);let a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);}
function latinBytes(s){return new TextEncoder().encode(s)}
function pdfFromJPEG(jpegBytes,width,height){const enc=latinBytes;const chunks=[];let size=0;const append=b=>{chunks.push(b);size+=b.length};const write=s=>append(enc(s));const offsets=[0];write('%PDF-1.4\n');function obj(n,content){offsets[n]=size;write(`${n} 0 obj\n${content}\nendobj\n`)}obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.5 842.25] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>');offsets[4]=size;write(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);append(jpegBytes);write('\nendstream\nendobj\n');const pageContent='q\n595.5 0 0 842.25 0 0 cm\n/Im1 Do\nQ\n';const c=enc(pageContent);offsets[5]=size;write(`5 0 obj\n<< /Length ${c.length} >>\nstream\n${pageContent}endstream\nendobj\n`);const xref=size;write('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)write(`${String(offsets[i]).padStart(10,'0')} 00000 n \n`);write(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);const out=new Uint8Array(size);let at=0;for(const c of chunks){out.set(c,at);at+=c.length}return out;}
async function downloadPDF(){const canvas=state.canvas||await createDocument();let data=canvas.toDataURL('image/jpeg',.96).split(',')[1];let raw=atob(data),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const filename=`roda-da-vida-${state.student.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.pdf`;saveBytes(filename,pdfFromJPEG(bytes,canvas.width,canvas.height),'application/pdf');}
async function result(){changeProgress(null);let ratings=means(),avg=ratings.reduce((a,b)=>a+b,0)/5;app.innerHTML=`<section class="card"><div style="text-align:center"><div class="emoji">${state.character} 🎉🏆🌟</div><span class="eyebrow">Você concluiu sua jornada!</span><h1>Parabéns, ${escapeHTML(state.student.name.split(' ')[0])}!</h1><p class="sub">Você concluiu sua Roda da Vida! Hoje, deu um passo importante: olhou para suas atitudes, reconheceu conquistas e descobriu como continuar crescendo. Você não precisa ser perfeito(a). O importante é aprender um pouquinho a cada dia! 💙<br><b>Deus criou você com amor e tem planos especiais para sua vida.</b><br>Com carinho, Manu — Orientação Educacional.</p></div><div class="student-grade"><b>Minha nota de autoavaliação</b><strong>${formatNumber(state.selfGrade)} / 1,0</strong></div><h2 style="text-align:center">Sua Roda da Vida preenchida</h2><div class="result-cards">${ratings.map((v,i)=>`<div class="result-item"><b>${escapeHTML(AREAS[i])}</b><strong>${formatNumber(v)} / 10</strong></div>`).join('')}<div class="result-item"><b>Média geral</b><strong>${formatNumber(avg)} / 10</strong></div></div><div class="document" id="documentPreview"><p style="text-align:center">Preparando seu documento...</p></div><div class="actions center"><button class="btn" id="download">⬇ Baixar minha Roda da Vida (PDF)</button><button class="btn secondary" id="print">🖨 Imprimir</button></div><div class="notice" id="statusEnvio" role="status" aria-live="polite">Verificando conexão com a escola...</div><div class="actions center print-hide"><button class="btn secondary" type="button" id="retrySend" style="display:none">Tentar enviar novamente</button></div><div class="actions center print-hide"><button class="btn secondary" id="again">Nova participação</button></div></section>`;try{state.canvas=await createDocument();$('documentPreview').replaceChildren(state.canvas);$('download').onclick=downloadPDF;$('print').onclick=()=>window.print()}catch(e){$('documentPreview').textContent='Não foi possível carregar o modelo da Roda da Vida. Confira a pasta assets e recarregue a página.';console.error(e)}iniciarEnvioEAQ();$('again').onclick=()=>{state.screen='intro';state.answers=[];state.index=0;state.selected=null;state.confirmed=false;state.commitment='';state.canvas=null;state.character='';state.selfGrade=null;state.advancing=false;eaqID='';eaqRecorded=false;render()};}

// === EAQ: Integração com Google Apps Script. ===
// O envio não é declarado concluído até o servidor confirmar o recebimento.
const EAQ_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxg7J2UkBwUBMkq1TI7S8Sz-_ij3qs4BR0PcRbrCz_QEB9MUoJYR6-5mJmHqCpY4Zf1/exec';
let eaqID = '';
let eaqSending = false;
let eaqRecorded = false;
function eaqNovoID(){
  if (window.crypto?.randomUUID) return 'EAQ-'+crypto.randomUUID();
  const bytes=new Uint8Array(16);crypto.getRandomValues(bytes);
  return 'EAQ-'+Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
}
function eaqStatus(text){const el=document.getElementById('statusEnvio');if(el)el.textContent=text;}
function eaqBotaoReenvio(show){const el=document.getElementById('retrySend');if(el)el.style.display=show?'inline-flex':'none';}
function eaqConsultar(id){
  return new Promise(resolve=>{
    const nome='EAQ_STATUS_'+Math.random().toString(36).slice(2);
    const tag=document.createElement('script');let terminado=false;
    const terminar=(value)=>{if(terminado)return;terminado=true;clearTimeout(timer);tag.remove();try{delete window[nome]}catch(e){}resolve(value)};
    window[nome]=(value)=>terminar(value);
    const timer=setTimeout(()=>terminar(null),10000);
    tag.onerror=()=>terminar(null);
    tag.src=EAQ_WEBAPP_URL+'?acao=status&id='+encodeURIComponent(id)+'&callback='+encodeURIComponent(nome)+'&_='+Date.now();
    document.head.appendChild(tag);
  });
}
function eaqEnviar(id,dados){
  return new Promise(resolve=>{
    // Formulário em iframe: contorna preflight CORS, mas não dá confirmação de recebimento.
    const iframe=document.createElement('iframe');iframe.hidden=true;
    iframe.name='eaq_frame_'+Math.random().toString(36).slice(2);
    const form=document.createElement('form');form.method='POST';form.action=EAQ_WEBAPP_URL;form.target=iframe.name;form.hidden=true;
    const field=document.createElement('input');field.type='hidden';field.name='payload';field.value=JSON.stringify({...dados,idParticipacao:id});form.appendChild(field);
    document.body.append(iframe,form);
    form.submit();
    setTimeout(()=>{iframe.remove();form.remove();resolve()},2200);
  });
}
async function iniciarEnvioEAQ(){
  const btn=document.getElementById('retrySend');if(btn)btn.onclick=iniciarEnvioEAQ;
  if(eaqRecorded){eaqStatus('✅ Resultado confirmado na planilha da escola.');return}
  if(eaqSending)return;
  eaqSending=true;eaqBotaoReenvio(false);
  try {
    if(!eaqID)eaqID=eaqNovoID();
    eaqStatus('Verificando comunicação com a escola...');
    const inicial=await eaqConsultar(eaqID);
    if(!inicial){eaqStatus('⚠️ Não foi possível verificar a conexão. Salve seu PDF e tente novamente com o professor.');eaqBotaoReenvio(true);return}
    if(inicial.modoTeste){eaqStatus('🧪 Conexão de teste estabelecida! Nenhum dado foi enviado à planilha.');return}
    if(inicial.recebido){eaqRecorded=true;eaqStatus('✅ Resultado já confirmado na planilha da escola.');return}
    const dados={nome:state.student.name,turma:state.student.classroom,bimestre:state.student.term,personagem:state.character,respostas:[...state.answers],notaFinal:state.selfGrade,compromisso:state.commitment};
    for(let tentativa=1;tentativa<=3;tentativa++){
      eaqStatus('Enviando resultado à escola... tentativa '+tentativa+' de 3. Não feche esta página.');
      await eaqEnviar(eaqID,dados);
      await new Promise(r=>setTimeout(r,1200*tentativa + Math.floor(Math.random()*1000)));
      const confirmado=await eaqConsultar(eaqID);
      if(confirmado?.recebido){eaqRecorded=true;eaqStatus('✅ Resultado confirmado na planilha da escola!');return}
    }
    eaqStatus('⚠️ Não conseguimos confirmar o registro. Baixe o PDF e avise o professor; você pode tentar novamente.');
    eaqBotaoReenvio(true);
  }catch(e){console.error('Falha de conexão EAQ',e);eaqStatus('⚠️ Falha na conexão com a escola. Baixe o PDF e tente novamente.');eaqBotaoReenvio(true)}
  finally{eaqSending=false}
}

render();
