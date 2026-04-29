/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Database, PenTool, Layout, Users, Mail, Phone, Linkedin, ExternalLink, Download, Play,
  Settings, Save, Plus, Trash2, ArrowRight, Sparkles
} from 'lucide-react';
import { initialData } from './data';
import { PortfolioData, Project, Experience, SkillCategory } from './types';

// --- Utility Components ---
const Section = ({ id, title, children }: { id: string, title?: string, children: React.ReactNode }) => (
  <section id={id} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
    {title && (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="w-12 h-1 bg-brand-blue mb-4"></div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      </motion.div>
    )}
    {children}
  </section>
);

// --- Component Definitions ---

export default function App() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editingData, setEditingData] = useState<PortfolioData | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mergedProjects = [...(parsed.projects || [])];
        initialData.projects.forEach(initialProj => {
          const existingIdx = mergedProjects.findIndex(p => p.id === initialProj.id);
          if (existingIdx === -1) {
            mergedProjects.push(initialProj);
          } else if (initialProj.id === 'etude-rebranding' || initialProj.id === 'megabox-campaign') {
            // Force sync for requested projects to ensure metadata like videoUrl/reportUrl is present
            mergedProjects[existingIdx] = {
              ...mergedProjects[existingIdx],
              title: initialProj.title,
              videoUrl: initialProj.videoUrl || mergedProjects[existingIdx].videoUrl,
              reportUrl: initialProj.reportUrl || mergedProjects[existingIdx].reportUrl,
              pdfLabel: initialProj.pdfLabel || mergedProjects[existingIdx].pdfLabel || "PDF 보기",
              reportLabel: initialProj.reportLabel || mergedProjects[existingIdx].reportLabel || "pdf 리포트 보기"
            };
          }
        });
        
        // Force sync skills if structure is different
        const savedSkills = parsed.skills || [];
        const hasNewStructure = savedSkills.some((s: any) => s.title === 'AI Tools');
        const finalSkills = hasNewStructure ? savedSkills : initialData.skills;

        setData({ 
          ...initialData,
          ...parsed, 
          projects: mergedProjects,
          experiences: parsed.experiences || initialData.experiences,
          skills: finalSkills,
          profile: {
            ...initialData.profile,
            ...(parsed.profile || {}),
            footerHeadline: parsed.profile?.footerHeadline || initialData.profile.footerHeadline,
            footerSubtext: parsed.profile?.footerSubtext || initialData.profile.footerSubtext,
            profileImage: parsed.profile?.profileImage || initialData.profile.profileImage,
          }
        });
      } catch (e) {
        console.error("Failed to load saved data", e);
        setData(initialData);
      }
    } else {
      setData(initialData);
    }
  }, []);

  const handleSave = (newData: PortfolioData) => {
    try {
      setData(newData);
      localStorage.setItem('portfolio_data', JSON.stringify(newData));
      setIsAdmin(false);
    } catch (e) {
      console.error("Failed to save data", e);
      if (e instanceof Error && e.name === 'QuotaExceededError') {
        alert('파일(이미지/PDF) 용량이 너무 커서 저장에 실패했습니다. 더 작은 파일을 사용하거나 외부 링크(Google Drive 등)를 활용해주세요.');
      } else {
        alert('저장 중 오류가 발생했습니다.');
      }
    }
  };

  const handleAdminLogin = () => {
    if (password === '1111') {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setEditingData(data);
      setPassword('');
    } else {
      alert('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="min-h-screen selection:bg-brand-blue selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 bg-brand-beige/80 backdrop-blur-md border-b border-brand-dark/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="text-xl font-bold tracking-tighter text-brand-dark">PORTFOLIO.</a>
          <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-widest text-brand-dark/60">
            {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-brand-blue transition-colors">
                {item}
              </a>
            ))}
          </div>
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="p-2 hover:bg-brand-dark/5 rounded-full transition-colors"
          >
            <Settings size={20} className="text-brand-dark/40" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen relative flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl z-10"
        >
          <div className="flex gap-3 mb-6">
            {(data.profile.keywords ?? []).map((kw) => (
              <span key={kw} className="text-xs font-bold tracking-widest uppercase bg-brand-dark px-3 py-1 text-white">
                {kw}
              </span>
            ))}
          </div>
          <h1 className="text-5xl md:text-8xl font-black leading-[0.95] mb-8 whitespace-pre-wrap tracking-tighter italic">
            {data.profile.mainTitle}
          </h1>
          <p className="text-lg md:text-xl text-brand-dark/70 mb-10 leading-relaxed max-w-2xl whitespace-pre-wrap">
            {data.profile.subTitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="bg-brand-dark text-white px-10 py-5 text-sm font-bold tracking-widest flex items-center gap-2 hover:bg-brand-blue transition-all group shadow-xl">
              PROJECTS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>

        {data.profile.profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block absolute bottom-12 right-12 w-72 aspect-square group z-0"
          >
            <div className="absolute inset-0 border-2 border-brand-dark/10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-700" />
            <div className="relative w-full h-full overflow-hidden shadow-2xl">
              <img 
                src={data.profile.profileImage} 
                alt={data.profile.name} 
                className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:contrast-100 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        )}
      </section>

      {/* About Me */}
      <Section id="about" title="About Me">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-6">Education</h4>
              <div className="space-y-2.5">
                {(data.profile.education ?? []).map((edu, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -2 }}
                    className="p-5 bg-white/70 backdrop-blur-md border border-brand-dark/5 rounded-2xl shadow-sm"
                  >
                    <p className="text-sm text-brand-blue font-bold mb-1">{edu.period}</p>
                    <p className="font-bold text-xl mb-1">{edu.school}</p>
                    <p className="text-base text-brand-dark/70 font-medium">{edu.major} · {edu.status}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-blue mb-6">Certifications</h4>
              <div className="grid gap-2.5">
                {(data.profile.certifications ?? []).map((cert, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -2 }}
                    className="p-5 bg-white/70 backdrop-blur-md border border-brand-dark/5 rounded-2xl shadow-sm flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-brand-dark/90 text-lg mb-0.5">{cert.name}</p>
                      <p className="text-sm text-brand-dark/50 font-medium">{cert.grade}</p>
                    </div>
                    <p className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-3 py-1.5 rounded-full">{cert.date}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="md:sticky md:top-32">
            <h3 className="text-2xl md:text-3xl font-bold mb-8 italic">"데이터와 감각을 함께 보는 마케터"</h3>
            <p className="text-lg text-brand-dark/80 leading-relaxed whitespace-pre-wrap">
              {data.profile.aboutText}
            </p>
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="projects" title="Featured Projects">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.projects ?? []).map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedProject(project)}
              className="bg-white border border-brand-dark/5 group cursor-pointer hover:border-brand-blue transition-all duration-500 overflow-hidden rounded-2xl shadow-sm"
            >
              <div className="h-48 bg-brand-dark/5 overflow-hidden">
                <img 
                  src={(project.images && project.images[0]) || 'https://images.unsplash.com/photo-1541462608141-ad60397d4ad7?auto=format&fit=crop&q=80&w=800'} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              <div className="p-8">
                <p className="text-xs font-bold text-brand-blue mb-2">{project.period}</p>
                <h3 className="text-xl font-bold mb-4 min-h-[3.5rem] group-hover:text-brand-blue transition-colors whitespace-pre-wrap">{project.title}</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-bold block mb-1">Problem</span>
                    <p className="text-brand-dark/70 line-clamp-2 whitespace-pre-wrap">{project.problem}</p>
                  </div>
                  <div>
                    <span className="font-bold block mb-1">Result</span>
                    <p className="font-medium text-brand-dark/90 whitespace-pre-wrap">{project.result}</p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-brand-dark/5 flex gap-2 flex-wrap">
                  {(project.tools ?? []).slice(0, 3).map(tool => (
                    <span key={tool} className="text-[10px] uppercase tracking-tighter px-2 py-0.5 border border-brand-dark/10 rounded-full">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section id="skills" title="Strategic Skills">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(data.skills ?? []).map((category) => (
            <div key={category.title} className="p-8 border border-brand-dark/5 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl hover:shadow-brand-blue/5 transition-all">
              <div className="mb-6 flex justify-between items-start">
                <h3 className="font-bold text-lg tracking-tight uppercase">{category.title}</h3>
                {category.title === 'AI Tools' && <Sparkles size={24} className="text-brand-blue" />}
                {category.title === 'Data Analysis' && <Database size={24} className="text-brand-blue" />}
                {category.title === 'Content&Communication' && <PenTool size={24} className="text-brand-blue" />}
              </div>
              <ul className="space-y-3">
                {(category.skills ?? []).map(skill => (
                  <li key={skill} className="flex items-center gap-3 text-brand-dark/70">
                    <div className="w-1.5 h-1.5 bg-brand-blue/30 rounded-full"></div>
                    <span className="font-medium">{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section id="experience" title="Experience">
        <div className="space-y-12">
          {(data.experiences ?? []).map((exp) => (
            <div key={exp.id} className="grid md:grid-cols-4 gap-4 md:gap-12 pb-12 border-b border-brand-dark/10">
              <div className="col-span-1">
                <p className="text-brand-blue font-bold text-sm tracking-widest">{exp.period}</p>
                <h4 className="text-xl font-bold mt-1">{exp.company}</h4>
                <p className="text-brand-dark/50 font-medium uppercase text-xs tracking-wider">{exp.role}</p>
              </div>
              <div className="col-span-3">
                <p className="text-lg mb-6 leading-relaxed text-brand-dark/80 whitespace-pre-wrap">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {(exp.capabilities ?? []).map(cap => (
                    <div key={cap} className="flex items-center gap-2 group">
                      <div className="w-6 h-px bg-brand-dark/20 group-hover:bg-brand-blue transition-colors"></div>
                      <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/60 group-hover:text-brand-dark transition-colors">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Resume / Contact */}
      <footer id="contact" className="py-24 px-6 md:px-12 bg-brand-dark text-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter whitespace-pre-wrap">{data.profile.footerHeadline || "LET'S CONNECT."}</h2>
            <p className="text-white/40 text-lg max-w-xl whitespace-pre-wrap">
              {data.profile.footerSubtext || "브랜드의 문제를 데이터와 콘텐츠로 해결하는 마케터가 되겠습니다.\n언제든 편하게 연락주세요."}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <a href={`mailto:${data.profile.email}`} className="flex flex-col p-10 border border-white/10 hover:bg-white hover:text-brand-dark transition-all group">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-brand-dark/40 mb-4">Email</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl md:text-3xl font-bold">{data.profile.email}</span>
                <Mail className="opacity-20 group-hover:opacity-100" size={32} />
              </div>
            </a>
            <div className="flex flex-col p-10 border border-white/10 hover:border-white/20 transition-all group">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Phone</span>
              <div className="flex justify-between items-center">
                <span className="text-2xl md:text-3xl font-bold">{data.profile.phone}</span>
                <Phone className="opacity-20 group-hover:opacity-40" size={32} />
              </div>
            </div>
          </div>

          <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] text-white/20 uppercase tracking-[0.5em]">
              © 2026 PORTFOLIO — BUILT WITH STRATEGY
            </div>
            {/* Optional Links can still live here at the bottom very small if needed, but per request we focus on Email/Phone */}
          </div>
        </div>
      </footer>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-beige overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto py-24 px-6 md:px-12 relative text-brand-dark">
              <button 
                onClick={() => setSelectedProject(null)}
                className="fixed top-8 right-8 p-3 bg-brand-dark text-white rounded-full hover:bg-brand-blue transition-colors z-[60]"
              >
                <X size={24} />
              </button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid md:grid-cols-12 gap-12 md:gap-20"
              >
                {/* Left Column: Title & Media (Sticky) */}
                <div className="md:col-span-5">
                  <div className="md:sticky md:top-24 space-y-10">
                    <div>
                      <p className="text-brand-blue font-bold tracking-widest text-xs mb-3 uppercase">{selectedProject.period}</p>
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 whitespace-pre-wrap">{selectedProject.title}</h2>
                        <div className="flex flex-wrap gap-4 mb-6">
                        {selectedProject.pdfUrl && (
                          <a 
                            href={selectedProject.pdfUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold text-xs tracking-widest hover:bg-brand-dark transition-all rounded-sm shadow-lg shadow-brand-blue/10"
                          >
                           <Download size={16} /> {selectedProject.pdfLabel || "PDF 보기"}
                          </a>
                        )}
                        {selectedProject.reportUrl && (
                          <a 
                            href={selectedProject.reportUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-blue/80 text-white font-bold text-xs tracking-widest hover:bg-brand-dark transition-all rounded-sm shadow-lg shadow-brand-blue/10"
                          >
                           <Download size={16} /> {selectedProject.reportLabel || "pdf 리포트 보기"}
                          </a>
                        )}
                        {selectedProject.videoUrl && (
                          <button 
                            onClick={() => {
                              const videoSection = document.getElementById('project-video');
                              videoSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white font-bold text-xs tracking-widest hover:bg-brand-blue transition-all rounded-sm shadow-lg"
                          >
                            <Play size={16} /> Brand Film 보기
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedProject.videoUrl && (
                        <div id="project-video" className="aspect-video w-full bg-black rounded-sm overflow-hidden border border-brand-dark/10 shadow-lg">
                          <iframe 
                            src={selectedProject.videoUrl} 
                            className="w-full h-full" 
                            allowFullScreen 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        </div>
                      )}
                      {(selectedProject.images ?? []).map((img, i) => (
                        <div key={i} className="bg-brand-dark/5 overflow-hidden border border-brand-dark/5 rounded-sm">
                          <img 
                            src={img} 
                            alt={`${selectedProject.title} ${i + 1}`} 
                            className="w-full h-auto object-contain max-h-[400px] mx-auto" 
                          />
                        </div>
                      ))}
                      {(selectedProject.images ?? []).length === 0 && (
                        <div className="aspect-video w-full bg-brand-dark/5 flex items-center justify-center border border-dashed border-brand-dark/10">
                          <p className="text-brand-dark/20 uppercase tracking-widest text-[10px] font-bold">No images provided</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Detailed Content */}
                <div className="md:col-span-7 space-y-16">
                  {/* Dashboard Info */}
                  <div className="grid grid-cols-2 gap-8 py-8 border-y border-brand-dark/10">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-3">Role</h4>
                      <p className="font-bold text-lg">{selectedProject.role}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-3">Tools</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedProject.tools ?? []).map(tool => (
                          <span key={tool} className="text-[10px] font-bold px-3 py-1 border border-brand-dark/10 bg-white rounded-full">{tool}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section Details */}
                  <div className="space-y-16">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-4">01. 개요 (Overview)</h4>
                      <p className="text-xl md:text-2xl leading-relaxed font-bold tracking-tight whitespace-pre-wrap">
                        {selectedProject.overview || selectedProject.problem}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-4">02. 담당 업무 (Role & Tasks)</h4>
                      <p className="text-lg leading-relaxed text-brand-dark/80 whitespace-pre-wrap">
                        {selectedProject.detailedRole || selectedProject.strategy}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-blue mb-4">03. 인사이트 (Insights)</h4>
                      <p className="text-lg leading-relaxed text-brand-dark/60 italic border-l-2 border-brand-blue/30 pl-6 whitespace-pre-wrap">
                        {selectedProject.learnings}
                      </p>
                    </div>
                  </div>

                  <div className="pt-24 border-t border-brand-dark/10">
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="inline-flex items-center gap-2 font-bold uppercase tracking-widest text-brand-dark/40 hover:text-brand-dark transition-colors"
                    >
                      CLOSE PROJECT <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Dialog */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-dark/20 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-8 max-w-sm w-full shadow-2xl border border-brand-dark/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Admin Login</h3>
                <button onClick={() => setShowAdminLogin(false)}><X size={20} /></button>
              </div>
              <p className="text-sm text-brand-dark/60 mb-4">비밀번호를 입력하세요 (기본: 1111)</p>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full p-3 border border-brand-dark/10 mb-6 bg-brand-beige focus:outline-none focus:border-brand-blue"
                autoFocus
              />
              <button 
                onClick={handleAdminLogin}
                className="w-full bg-brand-dark text-white py-3 font-bold hover:bg-brand-blue transition-colors"
              >
                LOGIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Panel (Simplified Overlay/Page) */}
      <AnimatePresence>
        {isAdmin && editingData && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-brand-beige overflow-y-auto p-6 md:p-12"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-12 sticky top-0 bg-brand-beige py-4 z-10">
                <h2 className="text-4xl font-bold tracking-tight">MANAGE PORTFOLIO</h2>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsAdmin(false)}
                    className="px-6 py-2 border border-brand-dark/10 font-bold"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={() => handleSave(editingData)}
                    className="px-6 py-2 bg-brand-dark text-white font-bold flex items-center gap-2"
                  >
                    <Save size={18} /> SAVE CHANGES
                  </button>
                </div>
              </div>

              {/* Profile Editor */}
              <section className="mb-16">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-6">Profile Information</h3>
                <div className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Main Name (Supports Line Breaks)</label>
                      <textarea 
                        className="w-full p-3 bg-white border border-brand-dark/5 h-12 min-h-[3rem]"
                        value={editingData.profile.name}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, name: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Main Headline (Supports Line Breaks)</label>
                      <textarea 
                        className="w-full p-3 bg-white border border-brand-dark/5 min-h-[4rem]"
                        value={editingData.profile.mainTitle}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, mainTitle: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Email</label>
                      <input 
                        className="w-full p-3 bg-white border border-brand-dark/5"
                        value={editingData.profile.email}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, email: e.target.value}})}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Phone</label>
                      <input 
                        className="w-full p-3 bg-white border border-brand-dark/5"
                        value={editingData.profile.phone}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, phone: e.target.value}})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-40">Profile Image</label>
                    <div className="flex items-center gap-4">
                      {editingData.profile.profileImage && (
                        <img src={editingData.profile.profileImage} alt="Preview" className="w-12 h-12 object-cover border border-brand-dark/10" />
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="text-xs"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditingData({
                                ...editingData, 
                                profile: {
                                  ...editingData.profile, 
                                  profileImage: reader.result as string
                                }
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Footer Headline</label>
                      <input 
                        className="w-full p-3 bg-white border border-brand-dark/5 font-bold"
                        value={editingData.profile.footerHeadline || ''}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, footerHeadline: e.target.value}})}
                        placeholder="LET'S CONNECT."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase opacity-40">Footer Subtext</label>
                      <textarea 
                        className="w-full p-3 bg-white border border-brand-dark/5 h-20"
                        value={editingData.profile.footerSubtext || ''}
                        onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, footerSubtext: e.target.value}})}
                        placeholder="Footer description text..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-40">Sub Headline</label>
                    <textarea 
                      className="w-full p-3 bg-white border border-brand-dark/5 h-24"
                      value={editingData.profile.subTitle}
                      onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, subTitle: e.target.value}})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase opacity-40">About Me Story (Long Text)</label>
                    <textarea 
                      className="w-full p-3 bg-white border border-brand-dark/5 h-32"
                      value={editingData.profile.aboutText}
                      onChange={(e) => setEditingData({...editingData, profile: {...editingData.profile, aboutText: e.target.value}})}
                    />
                  </div>

                  {/* Education Editor */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase opacity-40">Education</label>
                      <button 
                        onClick={() => {
                          const newEdu = { school: "새 학교", major: "전공", status: "졸업", period: "2020.01 - 2024.01" };
                          setEditingData({...editingData, profile: {...editingData.profile, education: [...(editingData.profile.education ?? []), newEdu]}});
                        }}
                        className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded"
                      >
                        + ADD
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingData.profile.education ?? []).map((edu, eduIdx) => (
                        <div key={eduIdx} className="bg-brand-dark/5 p-3 rounded space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="학교명" value={edu.school} onChange={(e) => {
                              const newList = [...(editingData.profile.education ?? [])];
                              newList[eduIdx] = { ...newList[eduIdx], school: e.target.value };
                              setEditingData({...editingData, profile: {...editingData.profile, education: newList}});
                            }} />
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="전공" value={edu.major} onChange={(e) => {
                              const newList = [...(editingData.profile.education ?? [])];
                              newList[eduIdx] = { ...newList[eduIdx], major: e.target.value };
                              setEditingData({...editingData, profile: {...editingData.profile, education: newList}});
                            }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="기간 (예: 2020.01 - 2024.02)" value={edu.period} onChange={(e) => {
                              const newList = [...(editingData.profile.education ?? [])];
                              newList[eduIdx] = { ...newList[eduIdx], period: e.target.value };
                              setEditingData({...editingData, profile: {...editingData.profile, education: newList}});
                            }} />
                            <div className="flex gap-1">
                              <input className="p-1 text-xs flex-1 border border-brand-dark/5" placeholder="상태 (졸업/재학)" value={edu.status} onChange={(e) => {
                                const newList = [...(editingData.profile.education ?? [])];
                                newList[eduIdx] = { ...newList[eduIdx], status: e.target.value };
                                setEditingData({...editingData, profile: {...editingData.profile, education: newList}});
                              }} />
                              <button onClick={() => {
                                const newList = (editingData.profile.education ?? []).filter((_, i) => i !== eduIdx);
                                setEditingData({...editingData, profile: {...editingData.profile, education: newList}});
                              }} className="text-red-500 px-2">×</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Editor */}
                  <div className="space-y-4 pt-4 border-t border-brand-dark/10">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase opacity-40">Certifications</label>
                      <button 
                        onClick={() => {
                          const newCert = { name: "새 자격증", date: "2024.01", grade: "합격" };
                          setEditingData({...editingData, profile: {...editingData.profile, certifications: [...(editingData.profile.certifications ?? []), newCert]}});
                        }}
                        className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded"
                      >
                        + ADD
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingData.profile.certifications ?? []).map((cert, certIdx) => (
                        <div key={certIdx} className="bg-brand-dark/5 p-3 rounded space-y-2">
                          <input className="w-full p-1 text-xs border border-brand-dark/5" placeholder="자격증 명" value={cert.name} onChange={(e) => {
                            const newList = [...(editingData.profile.certifications ?? [])];
                            newList[certIdx] = { ...newList[certIdx], name: e.target.value };
                            setEditingData({...editingData, profile: {...editingData.profile, certifications: newList}});
                          }} />
                          <div className="flex gap-2">
                            <input className="p-1 text-xs flex-1 border border-brand-dark/5" placeholder="취득일 (예: 2024.01)" value={cert.date} onChange={(e) => {
                              const newList = [...(editingData.profile.certifications ?? [])];
                              newList[certIdx] = { ...newList[certIdx], date: e.target.value };
                              setEditingData({...editingData, profile: {...editingData.profile, certifications: newList}});
                            }} />
                            <input className="p-1 text-xs flex-1 border border-brand-dark/5" placeholder="등급/결과 (합격/점수)" value={cert.grade} onChange={(e) => {
                              const newList = [...(editingData.profile.certifications ?? [])];
                              newList[certIdx] = { ...newList[certIdx], grade: e.target.value };
                              setEditingData({...editingData, profile: {...editingData.profile, certifications: newList}});
                            }} />
                            <button onClick={() => {
                              const newList = (editingData.profile.certifications ?? []).filter((_, i) => i !== certIdx);
                              setEditingData({...editingData, profile: {...editingData.profile, certifications: newList}});
                            }} className="text-red-500 px-2">×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Editor - Integrated like Education */}
                  <div className="space-y-4 pt-4 border-t border-brand-dark/10">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase opacity-40">Experience</label>
                      <button 
                        onClick={() => {
                          const newExp: Experience = { 
                            id: Date.now().toString(),
                            company: "새 회사", 
                            role: "직무", 
                            period: "2024.01 - 현재", 
                            description: "담당 업무 및 성과 요약",
                            capabilities: ["Skill 1", "Skill 2"]
                          };
                          setEditingData({...editingData, experiences: [...(editingData.experiences ?? []), newExp]});
                        }}
                        className="text-[10px] bg-brand-blue/10 text-brand-blue px-2 py-1 rounded"
                      >
                        + ADD
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingData.experiences ?? []).map((exp, expIdx) => (
                        <div key={exp.id || expIdx} className="bg-brand-dark/5 p-3 rounded space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="회사명" value={exp.company} onChange={(e) => {
                              const newList = [...(editingData.experiences ?? [])];
                              newList[expIdx] = { ...newList[expIdx], company: e.target.value };
                              setEditingData({...editingData, experiences: newList});
                            }} />
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="직무" value={exp.role} onChange={(e) => {
                              const newList = [...(editingData.experiences ?? [])];
                              newList[expIdx] = { ...newList[expIdx], role: e.target.value };
                              setEditingData({...editingData, experiences: newList});
                            }} />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="기간 (예: 2024.01 - 2024.12)" value={exp.period} onChange={(e) => {
                              const newList = [...(editingData.experiences ?? [])];
                              newList[expIdx] = { ...newList[expIdx], period: e.target.value };
                              setEditingData({...editingData, experiences: newList});
                            }} />
                            <input className="p-1 text-xs border border-brand-dark/5" placeholder="역량 (쉼표 구분)" value={(exp.capabilities || []).join(', ')} onChange={(e) => {
                              const newList = [...(editingData.experiences ?? [])];
                              newList[expIdx] = { ...newList[expIdx], capabilities: e.target.value.split(',').map(s => s.trim()) };
                              setEditingData({...editingData, experiences: newList});
                            }} />
                          </div>
                          <div className="flex gap-2">
                            <textarea className="p-1 text-xs flex-1 border border-brand-dark/5 min-h-[40px]" placeholder="설명 및 주요 성과" value={exp.description} onChange={(e) => {
                              const newList = [...(editingData.experiences ?? [])];
                              newList[expIdx] = { ...newList[expIdx], description: e.target.value };
                              setEditingData({...editingData, experiences: newList});
                            }} />
                            <button onClick={() => {
                              const newList = (editingData.experiences ?? []).filter((_, i) => i !== expIdx);
                              setEditingData({...editingData, experiences: newList});
                            }} className="text-red-500 px-2 self-start">×</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>


                  </div>
              </section>

              {/* Projects Editor */}
              <section className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue">Projects</h3>
                  <button 
                    onClick={() => {
                      const newProj: Project = {
                        id: Date.now().toString(),
                        title: "신규 프로젝트",
                        period: "2024",
                        tools: [],
                        role: "역할",
                        overview: "전반적인 개요",
                        detailedRole: "상세 담당 업무 및 수행 내용",
                        learnings: "인사이트 및 회고",
                        result: "최종 결과 및 성과",
                        problem: "", // Backwards compatibility if needed
                        strategy: "",
                        images: []
                      };
                      setEditingData({...editingData, projects: [...(editingData.projects ?? []), newProj]});
                    }}
                    className="text-xs font-bold flex items-center gap-1 bg-brand-blue/10 text-brand-blue px-3 py-1 rounded"
                  >
                    <Plus size={14} /> ADD PROJECT
                  </button>
                </div>
                <div className="space-y-8">
                  {(editingData.projects ?? []).map((proj, idx) => (
                    <div key={proj.id} className="p-6 bg-white border border-brand-dark/5 relative group">
                      <button 
                        onClick={() => {
                          const newProjs = editingData.projects.filter(p => p.id !== proj.id);
                          setEditingData({...editingData, projects: newProjs});
                        }}
                        className="absolute top-4 right-4 text-brand-dark/20 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase opacity-40">Project Title (Supports Line Breaks)</label>
                          <textarea 
                            className="font-bold p-2 border-b border-brand-dark/10 w-full min-h-[3rem]"
                            value={proj.title}
                            onChange={(e) => {
                              const newProjs = [...editingData.projects];
                              newProjs[idx].title = e.target.value;
                              setEditingData({...editingData, projects: newProjs});
                            }}
                            placeholder="Project Title"
                          />
                        </div>
                        <input 
                          className="text-sm p-2 bg-brand-beige/50"
                          value={proj.period}
                          onChange={(e) => {
                            const newProjs = [...editingData.projects];
                            newProjs[idx].period = e.target.value;
                            setEditingData({...editingData, projects: newProjs});
                          }}
                          placeholder="Period"
                        />
                      </div>

                      {/* Image Manager */}
                      <div className="mb-4">
                        <p className="text-[10px] font-bold uppercase opacity-40 mb-2">Project Images</p>
                        <div className="grid grid-cols-4 gap-2 mb-2">
                          {(proj.images ?? []).map((img, imgIdx) => (
                            <div key={imgIdx} className="aspect-square relative group bg-brand-dark/5 overflow-hidden">
                              <img src={img} className="w-full h-full object-cover" />
                              <button 
                                onClick={() => {
                                  const newProjs = [...editingData.projects];
                                  newProjs[idx].images = (newProjs[idx].images ?? []).filter((_, i) => i !== imgIdx);
                                  setEditingData({...editingData, projects: newProjs});
                                }}
                                className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square border border-dashed border-brand-dark/20 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-dark/5 transition-colors">
                            <Plus size={16} className="text-brand-dark/40 mb-1" />
                            <span className="text-[10px] font-bold opacity-40">ADD IMAGE</span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              multiple
                              onChange={async (e) => {
                                if (e.target.files) {
                                  const files = Array.from(e.target.files) as File[];
                                  for (const file of files) {
                                    try {
                                      const dataUrl = await new Promise<string>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          const img = new Image();
                                          img.onload = () => {
                                            const canvas = document.createElement('canvas');
                                            let width = img.width;
                                            let height = img.height;
                                            
                                            // Max width/height 1200px
                                            const MAX_SIZE = 1200;
                                            if (width > height) {
                                              if (width > MAX_SIZE) {
                                                height *= MAX_SIZE / width;
                                                width = MAX_SIZE;
                                              }
                                            } else {
                                              if (height > MAX_SIZE) {
                                                width *= MAX_SIZE / height;
                                                height = MAX_SIZE;
                                              }
                                            }
                                            
                                            canvas.width = width;
                                            canvas.height = height;
                                            const ctx = canvas.getContext('2d');
                                            ctx?.drawImage(img, 0, 0, width, height);
                                            // Compress as jpeg with 0.7 quality
                                            resolve(canvas.toDataURL('image/jpeg', 0.7));
                                          };
                                          img.src = reader.result as string;
                                        };
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                      });
                                      
                                      setEditingData((prev) => {
                                        if (!prev) return prev;
                                        const newProjects = [...(prev.projects ?? [])];
                                        const pIdx = newProjects.findIndex(p => p.id === proj.id);
                                        if (pIdx !== -1) {
                                          const prevProject = newProjects[pIdx];
                                          const currentImages = prevProject.images ?? [];
                                          if (!currentImages.includes(dataUrl)) {
                                            newProjects[pIdx] = {
                                              ...prevProject,
                                              images: [...currentImages, dataUrl]
                                            };
                                          }
                                        }
                                        return { ...prev, projects: newProjects };
                                      });
                                    } catch (err) {
                                      console.error("File reading failed", err);
                                    }
                                  }
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <input 
                          className="text-sm p-2 border border-brand-dark/5"
                          value={proj.role}
                          onChange={(e) => {
                            const newProjs = [...editingData.projects];
                            newProjs[idx].role = e.target.value;
                            setEditingData({...editingData, projects: newProjs});
                          }}
                          placeholder="담당 업무 (Role)"
                        />
                        <input 
                          className="text-sm p-2 border border-brand-dark/5"
                          value={proj.period}
                          onChange={(e) => {
                            const newProjs = [...editingData.projects];
                            newProjs[idx].period = e.target.value;
                            setEditingData({...editingData, projects: newProjs});
                          }}
                          placeholder="기간 (Period, e.g. 2023.10 - 2023.12)"
                        />
                        <input 
                          className="text-sm p-2 border border-brand-dark/5"
                          value={(proj.tools || []).join(', ')}
                          onChange={(e) => {
                            const newProjs = [...editingData.projects];
                            newProjs[idx].tools = e.target.value.split(',').map(s => s.trim());
                            setEditingData({...editingData, projects: newProjs});
                          }}
                          placeholder="사용 툴 (Tools, 쉼표로 구분)"
                        />
                        <input 
                          className="text-sm p-2 border border-brand-dark/5"
                          value={proj.videoUrl || ''}
                          onChange={(e) => {
                            const newProjs = [...editingData.projects];
                            newProjs[idx].videoUrl = e.target.value;
                            setEditingData({...editingData, projects: newProjs});
                          }}
                          placeholder="Embed Video URL (YouTube/Vimeo)"
                        />
                        <div className="flex flex-col gap-2 col-span-full">
                          <div className="grid md:grid-cols-2 gap-2">
                            <div className="flex gap-2">
                              <input 
                                className="text-sm p-2 border border-brand-dark/5 flex-1"
                                value={proj.pdfUrl || ''}
                                onChange={(e) => {
                                  const newProjs = [...editingData.projects];
                                  newProjs[idx].pdfUrl = e.target.value;
                                  setEditingData({...editingData, projects: newProjs});
                                }}
                                placeholder="PDF URL (기본)"
                              />
                              <input 
                                className="text-sm p-2 border border-brand-dark/5 w-32"
                                value={proj.pdfLabel || ''}
                                onChange={(e) => {
                                  const newProjs = [...editingData.projects];
                                  newProjs[idx].pdfLabel = e.target.value;
                                  setEditingData({...editingData, projects: newProjs});
                                }}
                                placeholder="버튼 이름 (PDF)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input 
                                className="text-sm p-2 border border-brand-dark/5 flex-1"
                                value={proj.reportUrl || ''}
                                onChange={(e) => {
                                  const newProjs = [...editingData.projects];
                                  newProjs[idx].reportUrl = e.target.value;
                                  setEditingData({...editingData, projects: newProjs});
                                }}
                                placeholder="PDF 리포트 URL (추가)"
                              />
                              <input 
                                className="text-sm p-2 border border-brand-dark/5 w-32"
                                value={proj.reportLabel || ''}
                                onChange={(e) => {
                                  const newProjs = [...editingData.projects];
                                  newProjs[idx].reportLabel = e.target.value;
                                  setEditingData({...editingData, projects: newProjs});
                                }}
                                placeholder="버튼 이름 (리포트)"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] bg-brand-dark/5 p-2 border border-dashed border-brand-dark/20 text-center cursor-pointer hover:bg-brand-dark/10 transition-colors uppercase tracking-widest font-bold text-brand-dark/40">
                              PDF 파일 업로드 (기기 내 저장)
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="application/pdf"
                                onChange={async (e) => {
                                  if (e.target.files?.[0]) {
                                    const file = e.target.files[0];
                                    
                                    // 2MB limit check
                                    if (file.size > 2 * 1024 * 1024) {
                                      alert('35MB와 같은 대용량 파일은 직접 업로드할 수 없습니다.\n구글 드라이브에 업로드 후 링크를 위에 붙여넣어 주세요.');
                                      return;
                                    }

                                    try {
                                      const dataUrl = await new Promise<string>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.onerror = reject;
                                        reader.readAsDataURL(file);
                                      });
                                      const newProjs = [...editingData.projects];
                                      newProjs[idx].pdfUrl = dataUrl;
                                      setEditingData({...editingData, projects: newProjs});
                                    } catch (err) {
                                      console.error("PDF upload failed", err);
                                    }
                                  }
                                }}
                              />
                            </label>
                            <p className="text-[9px] text-brand-dark/40 italic">
                              * 2MB 이상의 대형 PDF는 구글 드라이브 등에 업로드 후 링크를 입력하세요.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 block">Overview (개요)</label>
                          <textarea 
                            className="w-full text-sm p-2 border border-brand-dark/5 min-h-[100px] focus:border-brand-blue outline-none transition-colors"
                            value={proj.overview || ''}
                            onChange={(e) => {
                              const newProjs = [...editingData.projects];
                              newProjs[idx].overview = e.target.value;
                              setEditingData({...editingData, projects: newProjs});
                            }}
                            placeholder="프로젝트의 전반적인 정의와 목표를 작성하세요."
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 block">Problem (문제 정의)</label>
                            <textarea 
                              className="w-full text-sm p-2 border border-brand-dark/5 min-h-[80px] focus:border-brand-blue outline-none transition-colors"
                              value={proj.problem || ''}
                              onChange={(e) => {
                                const newProjs = [...editingData.projects];
                                newProjs[idx].problem = e.target.value;
                                setEditingData({...editingData, projects: newProjs});
                              }}
                              placeholder="직면했던 핵심 문제"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 block">Result (결과 및 성과)</label>
                            <textarea 
                              className="w-full text-sm p-2 border border-brand-dark/5 min-h-[80px] focus:border-brand-blue outline-none transition-colors"
                              value={proj.result || ''}
                              onChange={(e) => {
                                const newProjs = [...editingData.projects];
                                newProjs[idx].result = e.target.value;
                                setEditingData({...editingData, projects: newProjs});
                              }}
                              placeholder="도출된 최종 성과"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 block">Role & Tasks (담당 업무)</label>
                          <textarea 
                            className="w-full text-sm p-2 border border-brand-dark/5 min-h-[120px] focus:border-brand-blue outline-none transition-colors"
                            value={proj.detailedRole || ''}
                            onChange={(e) => {
                              const newProjs = [...editingData.projects];
                              newProjs[idx].detailedRole = e.target.value;
                              setEditingData({...editingData, projects: newProjs});
                            }}
                            placeholder="상세 업무 수행 내용"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest mb-1 block">Insights (인사이트)</label>
                          <textarea 
                            className="w-full text-sm p-2 border border-brand-dark/5 min-h-[120px] focus:border-brand-blue outline-none transition-colors"
                            value={proj.learnings}
                            onChange={(e) => {
                              const newProjs = [...editingData.projects];
                              newProjs[idx].learnings = e.target.value;
                              setEditingData({...editingData, projects: newProjs});
                            }}
                            placeholder="프로젝트를 통해 얻은 성과와 배운 점을 작성하세요."
                          />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </section>

              {/* Skills Editor - Simplified List View */}
              <section className="mb-16">
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-blue mb-6">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {(editingData.skills ?? []).map((cat, idx) => (
                    <div key={cat.title} className="p-4 bg-white border border-brand-dark/5">
                      <span className="text-[10px] font-bold uppercase opacity-40">{cat.title}</span>
                      <textarea 
                        className="w-full mt-2 p-2 text-sm bg-brand-beige/30"
                        value={(cat.skills ?? []).join(', ')}
                        onChange={(e) => {
                          const newSkills = [...(editingData.skills ?? [])];
                          newSkills[idx].skills = e.target.value.split(',').map(s => s.trim());
                          setEditingData({...editingData, skills: newSkills});
                        }}
                        placeholder="쉼표로 구분하여 입력"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
