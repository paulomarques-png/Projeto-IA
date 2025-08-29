document.addEventListener('DOMContentLoaded', function() {
    const pgt = document.querySelector('.btn-pgt');
    const limp = document.querySelector('.btn-limp');
    
    function inicial() {
        if (pgt) {
            pgt.style.boxShadow = '0 8px 16px rgba(0,0,0,0.8)';
            pgt.style.transition = 'all 0.15s ease';
        }
        if (limp) {
            limp.style.boxShadow = '0 8px 16px rgba(0,0,0,0.8)';
            limp.style.transition = 'all 0.15s ease';
        }
    }
    
    function pressionado(btn) {
        btn.addEventListener('mousedown', () => {
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
            btn.style.transform = 'translate(3px, 3px)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.boxShadow = '0 8px 16px rgba(0,0,0,0.8)';
            btn.style.transform = 'translate(0, 0)';
        });
    }

    inicial();
    if (pgt) pressionado(pgt);
    if (limp) pressionado(limp);
});