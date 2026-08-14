
const qs=(s,p=document)=>p.querySelector(s), qsa=(s,p=document)=>[...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded",()=>{
  const loader=qs(".loader");
  window.addEventListener("load",()=>setTimeout(()=>loader?.classList.add("hide"),350));

  const header=qs(".site-header"), progress=qs(".progress"), back=qs(".back-top");
  const onScroll=()=>{
    const y=scrollY;
    header?.classList.toggle("scrolled",y>60);
    back?.classList.toggle("show",y>600);
    if(progress){
      const max=document.documentElement.scrollHeight-innerHeight;
      progress.style.width=(max>0?(y/max)*100:0)+"%";
    }
  };
  addEventListener("scroll",onScroll,{passive:true}); onScroll();

  qs(".nav-toggle")?.addEventListener("click",()=>{
    qs(".nav-links")?.classList.toggle("open");
  });
  qsa(".nav-links a").forEach(a=>a.addEventListener("click",()=>qs(".nav-links")?.classList.remove("open")));
  back?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

  // Active page
  const page=location.pathname.split("/").pop()||"index.html";
  qsa(".nav-links a").forEach(a=>{
    if(a.getAttribute("href")===page) a.classList.add("active");
  });

  // Reveal on scroll
  const revealObs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");revealObs.unobserve(e.target)}});
  },{threshold:.08});
  qsa(".reveal").forEach(el=>revealObs.observe(el));

  // Hero parallax
  const heroBg=qs(".hero-bg");
  if(heroBg && !matchMedia("(prefers-reduced-motion: reduce)").matches){
    addEventListener("scroll",()=>heroBg.style.transform=`translateY(${scrollY*.12}px) scale(1.04)`,{passive:true});
  }

  // Gallery filtering
  const filterBtns=qsa(".filter-btn"), items=qsa(".masonry-item");
  filterBtns.forEach(btn=>btn.addEventListener("click",()=>{
    filterBtns.forEach(b=>b.classList.remove("active")); btn.classList.add("active");
    const filter=btn.dataset.filter;
    items.forEach(item=>{
      item.style.display=(filter==="all"||item.dataset.category===filter)?"block":"none";
    });
  }));

  // Lightbox
  const lb=qs(".lightbox"), lbImg=qs(".lightbox img"), lbTitle=qs(".lb-title"), lbMeta=qs(".lb-meta"), lbCount=qs(".lb-count");
  let current=0, visibleItems=[];
  const refreshVisible=()=>visibleItems=items.filter(i=>i.style.display!=="none");
  const openLb=(idx)=>{
    refreshVisible(); current=Math.max(0,idx);
    showLb(); lb?.classList.add("open"); document.body.style.overflow="hidden";
  };
  const showLb=()=>{
    const item=visibleItems[current]; if(!item)return;
    const img=qs("img",item);
    lbImg.src=img.dataset.full||img.src;
    lbImg.alt=img.alt;
    lbTitle.textContent=item.dataset.title||img.alt;
    lbMeta.textContent=item.dataset.meta||"Nature Photography";
    lbCount.textContent=`${current+1} / ${visibleItems.length}`;
  };
  items.forEach((item,i)=>item.addEventListener("click",()=>{
    refreshVisible(); openLb(visibleItems.indexOf(item)>=0?visibleItems.indexOf(item):i);
  }));
  const closeLb=()=>{lb?.classList.remove("open");document.body.style.overflow=""};
  qs(".lb-close")?.addEventListener("click",closeLb);
  qs(".lb-prev")?.addEventListener("click",()=>{refreshVisible();current=(current-1+visibleItems.length)%visibleItems.length;showLb()});
  qs(".lb-next")?.addEventListener("click",()=>{refreshVisible();current=(current+1)%visibleItems.length;showLb()});
  lb?.addEventListener("click",e=>{if(e.target===lb)closeLb()});
  document.addEventListener("keydown",e=>{
    if(!lb?.classList.contains("open"))return;
    if(e.key==="Escape")closeLb();
    if(e.key==="ArrowLeft")qs(".lb-prev")?.click();
    if(e.key==="ArrowRight")qs(".lb-next")?.click();
  });

  // Contact form
  const contact=qs("#contact-form"), contactMsg=qs("#contact-message");
  contact?.addEventListener("submit",e=>{
    e.preventDefault();
    if(!contact.checkValidity()){contact.reportValidity();return}
    contactMsg.textContent="Thank you. Your message has been prepared successfully.";
    contact.reset();
  });

  // Newsletter
  const news=qs("#newsletter-form"), newsMsg=qs("#newsletter-message");
  news?.addEventListener("submit",e=>{
    e.preventDefault();
    const input=qs("input[type=email]",news);
    if(!input.checkValidity()){input.reportValidity();return}
    newsMsg.textContent="You're on the list. Welcome to the journal.";
    news.reset();
  });

  // Cursor
  const dot=qs(".cursor-dot");
  if(dot && matchMedia("(pointer:fine)").matches){
    addEventListener("mousemove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px"},{passive:true});
  }
});
