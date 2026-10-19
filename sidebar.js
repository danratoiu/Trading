    const sidebarToggle = document.querySelector('#sidebar-toggle');
    const setCollapsed = (collapsed) => {
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      sidebarToggle.setAttribute('aria-expanded', String(!collapsed));
      const label = collapsed ? 'Expand navigation' : 'Collapse navigation';
      sidebarToggle.setAttribute('aria-label', label);
      sidebarToggle.title = label;
    };
    let collapsed = window.matchMedia('(max-width: 700px)').matches;
    try { const saved = localStorage.getItem('trading-desk-sidebar'); if (saved !== null) collapsed = saved === 'collapsed'; } catch {}
    setCollapsed(collapsed);
    sidebarToggle.addEventListener('click', () => {
      const collapsed = !document.body.classList.contains('sidebar-collapsed');
      setCollapsed(collapsed);
      try { localStorage.setItem('trading-desk-sidebar', collapsed ? 'collapsed' : 'expanded'); } catch {}
    });
