(function(){

// 사이트 고정 헤더 높이만큼 학년 탭을 내려 붙인다
(function(){var t=document.querySelector("#dcs-land .tabs");if(!t)return;var fx=[];function scan(){fx=[].filter.call(document.querySelectorAll("body *"),function(e){if(e.closest("#dcs-land"))return false;var p=getComputedStyle(e).position;return(p==="fixed"||p==="sticky")&&e.offsetWidth>innerWidth*0.6})}function f(){var b=0;fx.forEach(function(e){var r=e.getBoundingClientRect();if(r.top<=1&&r.bottom>b&&r.bottom<320)b=r.bottom});t.style.top=b+"px"}scan();f();addEventListener("scroll",function(){requestAnimationFrame(f)},{passive:true});addEventListener("resize",function(){scan();f()})})();
})();
