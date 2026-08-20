/**
 * Reference implementation: dashboard-standalone.html supplied by the user.
 * It preserves the reference's gradient header, tabbed sections, summary cards,
 * panel geometry, Font Awesome-like visual hierarchy and responsive dashboard flow.
 */
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  BookOpenCheck,
  ChartNoAxesColumnIncreasing,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  GraduationCap,
  Info,
  Lightbulb,
  Newspaper,
  Smartphone,
  Users,
} from "lucide-react";

const PRIMARY = "#4f46e5";
const BAR_COLORS = ["#4f46e5", "#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];

type ClassItem = { id: string; name: string; values: number[] };
type ViewName = "turmas" | "globais" | "noticias" | "recomendacoes";

const classes: ClassItem[] = [
  { id: "9-1", name: "9º Ano · Turma 1", values: [3, 5, 4, 14, 13, 10, 5, 9, 16, 6, 8, 3, 16, 4, 8, 2, 3, 6, 2, 6, 6, 5, 6, 2, 10, 5, 16, 4] },
  { id: "8-3", name: "8º Ano · Turma 3", values: [5, 7, 7, 9, 2, 10, 4, 14, 4, 13, 13, 13, 13, 9, 8, 7, 10, 8, 7, 9, 13, 5, 11, 15, 2, 5, 11, 4, 0.3, 9, 1, 4, 9.3, 7, 1.3, 10, 9, 9, 6] },
  { id: "8-5", name: "8º Ano · Turma 5", values: [13, 8, 12, 9, 10, 15, 15, 10, 16, 2, 5, 3, 3, 8, 11, 8, 6, 8, 6.3, 6, 12, 0.3, 3, 10, 7, 1, 10, 7, 6] },
  { id: "2-1", name: "2º Ano EM · Turma 1", values: [7.44, 5.3, 7.15, 2.3, 5, 8, 4.46, 1, 4, 6, 8, 4, 8, 5.4, 5.25, 2, 4.58, 3.3, 12, 4, 12, 5, 14, 10, 3, 4.3, 15, 8] },
  { id: "2-2", name: "2º Ano EM · Turma 2", values: [5.11, 8, 9, 8, 2, 2.3, 2, 4, 6, 10, 3, 4.3, 10.3, 5, 6, 10, 5, 7, 11, 4, 2, 1, 3, 5.55, 4, 2, 6, 4, 5] },
  { id: "2-3", name: "2º Ano EM · Turma 3", values: [1.3, 16, 8, 9, 11.12, 8.34, 20, 21, 15, 7, 0.5, 0.5, 8, 9, 9, 3, 6.5, 4.3, 9, 12, 5, 6.5, 8.3, 9.3, 11, 5, 9, 10, 18, 8, 2.4, 4, 10, 8.54, 7, 6, 5.3, 7.16, 4] },
  { id: "2-4", name: "2º Ano EM · Turma 4", values: [5.3, 6, 3.3, 3, 6, 6, 4.22, 6, 7, 2.3, 4, 5, 8, 7, 4, 6.07, 6, 5, 8, 10, 9, 2.5, 3, 8, 7, 6, 14, 4] },
];

const fullClassName: Record<string, string> = {
  "9-1": "9º Ano — Turma 1", "8-3": "8º Ano — Turma 3", "8-5": "8º Ano — Turma 5",
  "2-1": "2º Ano EM — Turma 1", "2-2": "2º Ano EM — Turma 2", "2-3": "2º Ano EM — Turma 3", "2-4": "2º Ano EM — Turma 4",
};

const news = [
  { category: "Educação", title: "Academia Americana de Pediatria aposenta o limite de 2 horas de tela", date: "20 jan. 2026", impact: "Alto", summary: "A AAP substituiu o limite fixo por uma avaliação do contexto de uso, priorizando sono, atividade física, convívio e limites consistentes em família.", source: "AAP — Pediatrics", url: "https://publications.aap.org/pediatrics/article/157/2/e2025075320/206129/Digital-Ecosystems-Children-and-Adolescents-Policy" },
  { category: "Educação", title: "Restrição de celulares nas escolas registra ampla adesão", date: "30 jun. 2026", impact: "Alto", summary: "Levantamento do MEC aponta aplicação da restrição em diferentes graus e percepção de maior participação nas atividades pedagógicas.", source: "MEC / Inep", url: "https://www.gov.br/mec/pt-br/assuntos/noticias/2026/junho/pesquisa-aponta-ampla-adesao-a-restricao-de-celulares-nas-escolas" },
  { category: "Saúde", title: "Alerta dos EUA debate uso excessivo de telas entre adolescentes", date: "20 mai. 2026", impact: "Alto", summary: "O alerta ressalta que o uso recreativo pode afetar sono, rotina escolar e relações presenciais quando desloca atividades essenciais.", source: "U.S. Department of Health and Human Services", url: "https://www.hhs.gov/press-room/wtas-secretary-announces-hhs-action-reduce-harmful-screen-use-protect-children-online.html" },
  { category: "Saúde", title: "Meta-análise investiga relação entre telas e miopia", date: "21 fev. 2025", impact: "Médio", summary: "O estudo reúne evidências observacionais sobre exposição a telas e miopia, reforçando a importância de pausas e tempo ao ar livre.", source: "JAMA Network Open", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11846013/" },
  { category: "Tecnologia", title: "Austrália adota restrição de redes sociais para menores de 16", date: "dez. 2025", impact: "Alto", summary: "A medida australiana ampliou o debate internacional sobre idade mínima, proteção de adolescentes e responsabilidade das plataformas.", source: "eSafety Commissioner", url: "https://www.esafety.gov.au/about-us/industry-regulation/social-media-age-restrictions" },
  { category: "Tecnologia", title: "Plataformas reforçam lembretes de tempo para contas adolescentes", date: "2025", impact: "Médio", summary: "Ferramentas de bem-estar digital passaram a destacar pausas, lembretes e silenciamento de notificações em horários de sono.", source: "Social Media Today", url: "https://www.socialmediatoday.com/news/instagram-implements-advanced-protections-teen-users/727299/" },
  { category: "Psicologia", title: "CDC associa 4h ou mais fora da escola a sono insuficiente", date: "2025", impact: "Médio", summary: "O levantamento explora associações entre uso de tela fora do horário escolar, duração do sono e regularidade da rotina em adolescentes.", source: "CDC — Preventing Chronic Disease", url: "https://www.cdc.gov/pcd/issues/2025/24_0537.htm" },
  { category: "Psicologia", title: "Estudo longitudinal explora mediação do sono", date: "2025", impact: "Médio", summary: "Pesquisadores analisaram como qualidade, duração e horário do sono podem ajudar a explicar a relação entre telas e sintomas depressivos.", source: "PMC", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11964217/" },
];

const recommendations = [
  ["0–18 meses", "Evitar telas, exceto chamadas de vídeo", "0 h de uso passivo", "OMS (2019) e AAP (2026)"],
  ["2–5 anos", "Conteúdo de qualidade com mediação adulta", "≈ 1 h/dia recreativa", "OMS (2019); AAP (2026)"],
  ["6–12 anos", "Observar o que a tela desloca na rotina", "Plano de mídia em família", "AAP — Digital Ecosystems (2026)"],
  ["13–18 anos", "Priorizar sono, escola, movimento e convívio", "Sem teto universal", "HHS / Surgeon General; CDC"],
  ["Adultos", "Fazer pausas e proteger a rotina de sono", "Conforme a rotina", "American Academy of Ophthalmology"],
];

function round(value: number, decimals = 2) { return Number(value.toFixed(decimals)); }
function calc(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const median = sorted.length % 2 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  const variance = values.length > 1 ? values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1) : 0;
  return { n: values.length, average: round(average), median: round(median), min: sorted[0], max: sorted.at(-1)!, sd: round(Math.sqrt(variance)), q1: round(sorted[Math.floor(values.length * .25)]), q3: round(sorted[Math.floor(values.length * .75)]) };
}

function ViewHeading({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="section-header"><h2>{icon}{title}</h2><p>{description}</p></div>;
}

export default function Home() {
  const [view, setView] = useState<ViewName>("turmas");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const [selectedId, setSelectedId] = useState(classes[0].id);
  const stats = useMemo(() => classes.map((item) => ({ ...item, ...calc(item.values) })), []);
  const selected = stats.find((item) => item.id === selectedId) ?? stats[0];
  const totalStudents = stats.reduce((total, item) => total + item.n, 0);
  const overall = round(stats.reduce((total, item) => total + item.average * item.n, 0) / totalStudents);
  const highest = [...stats].sort((a, b) => b.average - a.average)[0];
  const lowest = [...stats].sort((a, b) => a.average - b.average)[0];
  const filteredNews = activeFilter === "Todas" ? news : news.filter((item) => item.category === activeFilter);
  const comparison = [...stats.map((item) => ({ label: item.name.replace("Turma ", "T"), value: item.average, kind: "Turma" })), { label: "Brasil", value: 9.15, kind: "Brasil" }, { label: "Mundo", value: 6.63, kind: "Mundo" }];

  function exportCsv() {
    const header = ["Turma", "Alunos", "Média (h)", "Mediana (h)", "Mínimo (h)", "Máximo (h)", "Desvio padrão", "Q1", "Q3"];
    const rows = stats.map((item) => [fullClassName[item.id], item.n, item.average, item.median, item.min, item.max, item.sd, item.q1, item.q3]);
    const url = URL.createObjectURL(new Blob(["\ufeff" + [header, ...rows].map((row) => row.join(";")).join("\n")], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "estatisticas-tempo-de-tela.csv"; anchor.click(); URL.revokeObjectURL(url);
  }

  return <div className="reference-dashboard">
    <header className="header-principal">
      <div className="header-content">
        <div className="logo-section"><Smartphone aria-hidden="true"/><div><h1><ChartNoAxesColumnIncreasing aria-hidden="true"/> Tempo De Tela</h1><p>Análise De Dados</p></div></div>
        <nav className="nav-principal" aria-label="Navegação principal">
          {([ ["turmas", "Dados das Turmas"], ["globais", "Dados Globais"], ["noticias", "Notícias"], ["recomendacoes", "Recomendações"] ] as [ViewName,string][]).map(([key,label]) => <button key={key} className={`nav-link ${view === key ? "active" : ""}`} onClick={() => setView(key)}>{label}</button>)}
        </nav>
      </div>
    </header>

    <main className="main-container">
      {view === "turmas" && <section className="section-completa">
        <ViewHeading icon={<GraduationCap/>} title="Análise das Turmas" description="Tempo de tela dos alunos por turma com estatísticas detalhadas"/>
        <div className="cards-resumo">
          <article className="card-resumo"><Users className="card-icon icon-primary"/><h3>Total de Alunos</h3><strong className="card-valor">{totalStudents}</strong><p className="card-descricao">7 turmas avaliadas</p></article>
          <article className="card-resumo"><BarChart3 className="card-icon icon-primary"/><h3>Média Geral</h3><strong className="card-valor">{overall}h</strong><p className="card-descricao">Tempo médio diário</p></article>
          <article className="card-resumo"><ArrowUp className="card-icon icon-primary"/><h3>Maior Média</h3><strong className="card-valor">{highest.average}h</strong><p className="card-descricao">{fullClassName[highest.id]}</p></article>
          <article className="card-resumo"><ArrowDown className="card-icon icon-primary"/><h3>Menor Média</h3><strong className="card-valor">{lowest.average}h</strong><p className="card-descricao">{fullClassName[lowest.id]}</p></article>
        </div>
        <article className="painel"><h3><ChartNoAxesColumnIncreasing/> Comparação de Médias entre Turmas</h3><div className="grafico-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats} margin={{ top: 10, right: 5, left: -20, bottom: 4 }}><CartesianGrid stroke="#e2e8f0"/><XAxis dataKey="name" tick={{fontSize:11,fill:"#64748b"}}/><YAxis unit="h" tick={{fontSize:11,fill:"#64748b"}}/><Tooltip formatter={(value:number) => [`${value} h`, "Média de tempo de tela"]}/><Legend/><Bar dataKey="average" name="Média de tempo de tela (horas)" radius={[3,3,0,0]}>{stats.map((item,index) => <Cell key={item.id} fill={BAR_COLORS[index]}/>)}</Bar></BarChart></ResponsiveContainer></div></article>
        <article className="painel"><div className="painel-header-flex"><h3><FileText/> Estatísticas Detalhadas por Turma</h3><button className="btn-exportar" onClick={exportCsv}><Download/> Exportar CSV</button></div><div className="tabela-container"><table><thead><tr><th>Turma</th><th>Alunos</th><th>Média (h)</th><th>Mediana (h)</th><th>Mínimo (h)</th><th>Máximo (h)</th><th>Desvio padrão</th><th>Q1 (h)</th><th>Q3 (h)</th></tr></thead><tbody>{stats.map((item) => <tr key={item.id}><td><strong>{fullClassName[item.id]}</strong></td><td>{item.n}</td><td>{item.average}</td><td>{item.median}</td><td>{item.min}</td><td>{item.max}</td><td>{item.sd}</td><td>{item.q1}</td><td>{item.q3}</td></tr>)}</tbody></table></div></article>
        <article className="painel"><h3><Users/> Detalhes Individuais por Turma</h3><div className="turma-selector"><label htmlFor="classe">Selecione a turma:</label><select id="classe" value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>{stats.map((item) => <option key={item.id} value={item.id}>{fullClassName[item.id]}</option>)}</select></div><div className="grafico-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={selected.values.map((value,index) => ({ student:`Aluno ${index+1}`,value }))} margin={{top:10,right:5,left:-20,bottom:4}}><CartesianGrid stroke="#e2e8f0"/><XAxis dataKey="student" tick={{fontSize:9,fill:"#64748b"}} interval="preserveStartEnd"/><YAxis unit="h" tick={{fontSize:11,fill:"#64748b"}}/><Tooltip formatter={(value:number) => [`${value} h`, "Tempo de tela"]}/><Legend/><Bar dataKey="value" name={`Tempo de tela · ${fullClassName[selected.id]} (horas)`} fill={PRIMARY}/></BarChart></ResponsiveContainer></div><div className="stats-detalhe">{[["Alunos",selected.n],["Média",`${selected.average}h`],["Mediana",`${selected.median}h`],["Mínimo",`${selected.min}h`],["Máximo",`${selected.max}h`],["Desvio padrão",selected.sd]].map(([label,value]) => <div key={String(label)}><span>{label}</span><strong>{value}</strong></div>)}</div></article>
      </section>}

      {view === "globais" && <section className="section-completa">
        <ViewHeading icon={<Globe2/>} title="Dados Globais" description="Referências de uso de internet no Brasil e no mundo"/>
        <div className="aviso-metodologia"><Info/> <strong>Importante:</strong> este levantamento escolar mede tempo de tela autodeclarado. As referências abaixo medem tempo conectado à internet, com metodologias distintas; use a comparação como contexto, não como equivalência direta.</div>
        <article className="painel painel-brasil"><h3><Globe2/> Brasil</h3><div className="metrica-principal"><span className="valor-grande">9h09min</span><div className="rotulo-metrica">Tempo médio diário conectado à internet no Brasil.<span className="comparacao-metrica">2º maior tempo entre os países acompanhados</span></div></div><p className="info-texto">Crianças e adolescentes brasileiros apresentam acesso amplo e frequente à internet. O contexto de uso é essencial para interpretar estes indicadores.</p><div className="dados-globais-grid">{[["9–17 anos","93%","usuários de internet"],["Uso frequente","95%","acessam todos os dias ou quase"],["9–10 anos","67%","têm celular próprio"],["15–17 anos","81%","acessam na escola"]].map(([group,value,description]) => <div className="dado-global" key={group}><p className="idade-grupo">{group}</p><strong className="percentual">{value}</strong><p className="descricao">{description}</p></div>)}</div><p className="fonte-citacao">Fonte: <a href="https://cetic.br/media/docs/publicacoes/2/20250512154015/tic_kids_online_2024_resumo_executivo.pdf" target="_blank" rel="noreferrer">Cetic.br / NIC.br — TIC Kids Online Brasil 2024 <ExternalLink/></a></p></article>
        <article className="painel painel-mundo"><h3><Globe2/> Brasil e o Mundo</h3><div className="ranking-paises">{[["1","África do Sul","9h27"],["2","Brasil","9h09"],["3","Estados Unidos","6h40"],["4","Média global","6h38"],["5","Japão","3h57"]].map(([rank,country,hours]) => <div className="pais-card" key={country}><span className="ranking">{rank}</span><p className="pais-nome">{country}</p><strong className="horas">{hours}</strong></div>)}</div><p className="fonte-citacao">Fonte: <a href="https://www.statista.com/statistics/1380282/daily-time-spent-online-global" target="_blank" rel="noreferrer">DataReportal / We Are Social <ExternalLink/></a></p></article>
        <article className="painel painel-comparacao"><h3><BarChart3/> Suas Turmas vs. Brasil e Mundo</h3><div className="grafico-container"><ResponsiveContainer width="100%" height="100%"><BarChart data={comparison} margin={{top:10,right:5,left:-20,bottom:4}}><CartesianGrid stroke="#e2e8f0"/><XAxis dataKey="label" tick={{fontSize:11,fill:"#64748b"}}/><YAxis unit="h" tick={{fontSize:11,fill:"#64748b"}}/><Tooltip formatter={(value:number) => [`${value} h`, "Tempo médio"]}/><Legend/><Bar dataKey="value" name="Tempo médio diário (horas)" radius={[3,3,0,0]}>{comparison.map((item,index) => <Cell key={`${item.label}-${index}`} fill={item.kind === "Brasil" ? "#059669" : item.kind === "Mundo" ? "#0891b2" : PRIMARY}/>)}</Bar></BarChart></ResponsiveContainer></div></article>
      </section>}

      {view === "noticias" && <section className="section-completa">
        <ViewHeading icon={<Newspaper/>} title="Notícias e Evidências" description="Atualizações verificáveis sobre saúde, educação, psicologia e tecnologia"/>
        <div className="filtros-noticias">{["Todas","Saúde","Educação","Psicologia","Tecnologia"].map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`btn-filtro ${activeFilter === filter ? "active" : ""}`}>{filter}</button>)}</div>
        <div className="noticias-grid">{filteredNews.map((item) => <article className="noticia-card" key={item.title}><div className="noticia-header"><span className="noticia-categoria">{item.category}</span><h3 className="noticia-titulo">{item.title}</h3><time className="noticia-data">{item.date}</time></div><div className="noticia-body"><p className="noticia-resumo">{item.summary}</p><div className="noticia-impacto"><span>Impacto:</span><b className={`impacto-badge impacto-${item.impact.toLowerCase()}`}>{item.impact}</b></div><p className="noticia-fonte"><a href={item.url} target="_blank" rel="noreferrer">{item.source} <ExternalLink/></a></p></div></article>)}</div>
      </section>}

      {view === "recomendacoes" && <section className="section-completa">
        <ViewHeading icon={<Lightbulb/>} title="Recomendações de Uso Saudável" description="Orientações atuais por faixa etária, com foco em qualidade, rotina e mediação"/>
        <div className="recomendacoes-container">{recommendations.map(([age,guidance,duration,source]) => <article className="recomendacao-card" key={age}><span className="recomendacao-idade">{age}</span><h4>{guidance}</h4><p className="recomendacao-duracao">{duration}</p><p className="recomendacao-descricao">Mais do que um teto universal de horas, considere o que o uso desloca: sono, atividade física, aprendizagem e convivência.</p><p className="recomendacao-fonte">Fonte: {source}</p></article>)}</div>
        <aside className="info-box"><h4><BookOpenCheck/> Dicas práticas para a rotina</h4><ul><li><strong>Regra 20–20–20:</strong> a cada 20 minutos, olhe por 20 segundos para algo a aproximadamente 20 metros.</li><li><strong>Proteja o sono:</strong> estabeleça momentos sem telas antes de dormir e mantenha dispositivos fora do quarto quando possível.</li><li><strong>Converse sobre conteúdo:</strong> acompanhar o que é consumido é tão importante quanto observar a duração.</li></ul></aside>
      </section>}
    </main>

    <footer className="footer"><div className="footer-content"><div className="footer-info"><h5>Dashboard de Tempo de Tela v2.1</h5><p>Sistema de análise sobre uso de dispositivos digitais.</p></div><div className="footer-stats"><div className="footer-stat"><span className="stat-value">7</span><span className="stat-label">Turmas</span></div><div className="footer-stat"><span className="stat-value">{totalStudents}</span><span className="stat-label">Alunos</span></div><div className="footer-stat"><span className="stat-value">{news.length}</span><span className="stat-label">Notícias</span></div></div><div className="footer-links"><p>© 2026 Dashboard de Tempo de Tela. Dados de terceiros pertencem às respectivas fontes citadas.</p></div></div></footer>
  </div>;
}
