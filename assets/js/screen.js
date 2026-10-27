/* Screen renderer: draws the highlight screen states on a 16:9 canvas */
const SCR = (() => {
  const BLUE = '#1c69d4', CYAN = '#7cc4ff', ICE = 'rgba(210,232,255,1)';
  const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

  function glow(ctx, c, b) { ctx.shadowColor = c; ctx.shadowBlur = b; }
  function noGlow(ctx) { ctx.shadowBlur = 0; }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }

  function kidneys(ctx, cx, cy, s, a) {
    const w = s * 0.42, h = s, g = s * 0.08;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = ICE; ctx.lineWidth = s * 0.03;
    glow(ctx, 'rgba(160,205,255,0.95)', s * 0.12);
    rr(ctx, cx - g / 2 - w, cy - h / 2, w, h, w * 0.38); ctx.stroke();
    rr(ctx, cx + g / 2, cy - h / 2, w, h, w * 0.38); ctx.stroke();
    ctx.restore();
  }

  function xMark(ctx, cx, cy, s, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = ICE;
    glow(ctx, 'rgba(160,205,255,0.9)', s * 0.5);
    const t = s * 0.22;
    ctx.beginPath(); ctx.moveTo(cx - s, cy - s); ctx.lineTo(cx - s + t, cy - s); ctx.lineTo(cx + s, cy + s); ctx.lineTo(cx + s - t, cy + s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + s * 0.85, cy - s); ctx.lineTo(cx + s * 0.85 - t * 0.7, cy - s); ctx.lineTo(cx - s * 0.85, cy + s); ctx.lineTo(cx - s * 0.85 + t * 0.7, cy + s); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function bar(ctx, x, y, w, h, a, col) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col || ICE; glow(ctx, 'rgba(160,205,255,0.8)', h * 3);
    rr(ctx, x, y, w, h, h / 2); ctx.fill(); ctx.restore();
  }

  const GR = [{"cx":0.0279,"p":[[[0.05255,-0.04068],[0.02427,-0.04033],[0.0096,-0.03928],[-0.00105,-0.0309],[-0.00681,-0.02444],[-0.00751,0.08397],[-0.00576,0.08781],[-0.00244,0.092],[0.00332,0.09532],[0.02566,0.09584],[0.04696,0.09375],[0.04906,0.0927],[0.05395,0.08781],[0.06145,0.07629],[0.06302,0.04068],[0.06337,-0.03003],[0.06215,-0.0323],[0.05796,-0.03666]],[[0.05168,-0.03684],[0.06006,-0.02846],[0.05988,0.01798],[0.05848,0.06809],[0.05779,0.07577],[0.04976,0.08642],[0.04522,0.09008],[0.02968,0.092],[0.00978,0.09218],[0.00244,0.09113],[-0.00035,0.08886],[-0.00384,0.0831],[-0.00349,-0.02304],[0.00244,-0.02916],[0.01117,-0.03596],[0.02793,-0.03684]]]},{"cx":-0.0585,"p":[[[-0.08397,-0.03998],[-0.09131,-0.03317],[-0.09358,-0.03038],[-0.09392,-0.02863],[-0.0934,0.03561],[-0.09235,0.06931],[-0.09131,0.07839],[-0.08258,0.08886],[-0.07821,0.09323],[-0.07664,0.09392],[-0.06302,0.09567],[-0.03998,0.09567],[-0.033,0.09497],[-0.02706,0.09061],[-0.02357,0.0852],[-0.02374,-0.02409],[-0.02863,-0.03003],[-0.03753,-0.03806],[-0.04033,-0.0398],[-0.06163,-0.0405]],[[-0.08118,-0.03684],[-0.05656,-0.03684],[-0.04207,-0.03596],[-0.0295,-0.02566],[-0.02706,-0.02287],[-0.02654,0.02008],[-0.02689,0.08188],[-0.02723,0.0838],[-0.02916,0.08729],[-0.03282,0.09096],[-0.03928,0.09166],[-0.06006,0.092],[-0.0749,0.09061],[-0.07629,0.08991],[-0.08275,0.08328],[-0.08712,0.07769],[-0.08816,0.07105],[-0.08921,0.04103],[-0.08973,-0.02706],[-0.08921,-0.02881],[-0.08624,-0.0323]]]},{"cx":0.1624,"p":[[[0.24895,-0.03212],[0.24721,-0.033],[0.07734,-0.02479],[0.07612,-0.02409],[0.07594,0.02479],[0.07664,0.02531],[0.12413,0.02427],[0.14001,0.02304],[0.1648,0.02287],[0.17231,0.022],[0.19256,0.02165],[0.24127,0.01938],[0.24389,0.01711],[0.24354,0.01589],[0.13862,0.02078],[0.07961,0.02217],[0.07891,0.02147],[0.07891,-0.02217],[0.08013,-0.02339],[0.24738,-0.03108]]]},{"cx":0.1666,"p":[[[0.24773,0.01117],[0.24633,0.0103],[0.17877,0.01414],[0.12098,0.01641],[0.09462,0.01676],[0.08642,0.01728],[0.08554,0.01781],[0.08537,0.01885],[0.08624,0.0199],[0.09043,0.01903],[0.14438,0.01746],[0.24686,0.01257]]]},{"cx":0.1721,"p":[[[0.25052,0.00646],[0.2493,0.00576],[0.18104,0.0096],[0.09497,0.01222],[0.09375,0.01257],[0.09358,0.01362],[0.09532,0.01414],[0.13827,0.01292],[0.24948,0.00768],[0.25052,0.00716]]]},{"cx":-0.1918,"p":[[[-0.27758,-0.03247],[-0.27723,-0.0316],[-0.11697,-0.02427],[-0.11034,-0.02374],[-0.10929,-0.02252],[-0.10929,0.02095],[-0.10999,0.022],[-0.18802,0.01955],[-0.27147,0.01536],[-0.27217,0.01659],[-0.27025,0.01885],[-0.14647,0.02392],[-0.10824,0.02479],[-0.10632,0.02409],[-0.10615,-0.02444],[-0.10667,-0.02531],[-0.27689,-0.03334]]]},{"cx":-0.1955,"p":[[[-0.27601,0.01082],[-0.27514,0.01222],[-0.19815,0.01606],[-0.11592,0.01868],[-0.11522,0.01781],[-0.11575,0.01659],[-0.20566,0.01379],[-0.26571,0.011],[-0.27409,0.01013]]]},{"cx":-0.2009,"p":[[[-0.27863,0.00594],[-0.27828,0.00716],[-0.23638,0.0096],[-0.1477,0.01292],[-0.12325,0.01309],[-0.1236,0.01205],[-0.21823,0.0089],[-0.27636,0.00559]]]},{"cx":0.2861,"p":[[[0.27392,-0.03527],[0.27357,-0.03422],[0.2905,-0.01798],[0.29225,-0.01938],[0.29836,-0.02916],[0.29836,-0.03003],[0.29207,-0.03649]]]},{"cx":0.3036,"p":[[[0.33397,-0.03771],[0.33345,-0.03823],[0.32018,-0.03788],[0.30674,-0.03666],[0.29976,-0.02619],[0.27304,0.01833],[0.27881,0.01851],[0.3001,0.01571],[0.31163,-0.00122]],[[0.32071,-0.03666],[0.32123,-0.03614],[0.32071,-0.03422],[0.3029,-0.00663],[0.29068,0.01501],[0.28422,0.01641],[0.27689,0.01676],[0.27636,0.01624],[0.27671,0.01484],[0.2823,0.00663],[0.30744,-0.03474],[0.30883,-0.03596]]]},{"cx":-0.3146,"p":[[[-0.32769,-0.02968],[-0.32088,-0.01938],[-0.31948,-0.01851],[-0.3022,-0.03474],[-0.30168,-0.03614],[-0.32071,-0.03753],[-0.32559,-0.033]]]},{"cx":0.3218,"p":[[[0.30971,0.00663],[0.30971,0.00733],[0.31634,0.01397],[0.33345,0.011],[0.3338,0.01047],[0.31809,-0.00506],[0.31652,-0.00419]]]},{"cx":-0.3316,"p":[[[-0.36226,-0.03911],[-0.36191,-0.03753],[-0.3448,-0.01082],[-0.32961,0.01484],[-0.30325,0.01816],[-0.30133,0.01781],[-0.3015,0.01606],[-0.33258,-0.03352],[-0.33607,-0.03788],[-0.35981,-0.03963]],[[-0.34969,-0.03788],[-0.33781,-0.03701],[-0.33677,-0.03631],[-0.30482,0.01449],[-0.30464,0.01554],[-0.30534,0.01624],[-0.31686,0.01519],[-0.31896,0.01397],[-0.33834,-0.01851],[-0.34969,-0.03579],[-0.35021,-0.03719]]]},{"cx":-0.3499,"p":[[[-0.33781,0.00611],[-0.34497,-0.00524],[-0.34619,-0.00576],[-0.35632,0.00332],[-0.36226,0.00978],[-0.36051,0.01065],[-0.34497,0.01309],[-0.34061,0.00978],[-0.33799,0.00716]]]},{"cx":0.3856,"p":[[[0.3764,-0.0398],[0.37709,-0.03841],[0.38914,-0.02863],[0.39054,-0.02916],[0.39455,-0.03544],[0.39403,-0.03666],[0.38932,-0.0405]]]},{"cx":0.3977,"p":[[[0.42022,-0.0412],[0.41934,-0.04172],[0.40381,-0.0412],[0.40066,-0.04033],[0.37552,-0.00227],[0.375,-0.00052],[0.37605,0.00017],[0.39735,-0.00611]],[[0.41027,-0.03998],[0.41079,-0.03858],[0.40014,-0.02252],[0.39054,-0.00628],[0.38827,-0.00471],[0.37919,-0.00262],[0.37884,-0.00436],[0.40119,-0.03858],[0.40363,-0.0398]]]},{"cx":0.4131,"p":[[[0.4052,-0.01449],[0.4059,-0.01309],[0.40957,-0.0103],[0.42091,-0.01274],[0.42022,-0.01397],[0.41079,-0.02165],[0.40904,-0.02043]]]},{"cx":-0.4136,"p":[[[-0.40503,-0.0405],[-0.41742,-0.0412],[-0.42196,-0.03771],[-0.42249,-0.03631],[-0.41725,-0.02916],[-0.4052,-0.03928]]]},{"cx":-0.425,"p":[[[-0.44658,-0.04277],[-0.44658,-0.04155],[-0.43907,-0.02916],[-0.42423,-0.00681],[-0.40416,-0.00087],[-0.40346,-0.0014],[-0.40503,-0.00506],[-0.42493,-0.03788],[-0.42825,-0.04207]],[[-0.43715,-0.04103],[-0.43034,-0.04085],[-0.42825,-0.03911],[-0.42563,-0.03387],[-0.42161,-0.02863],[-0.4073,-0.00559],[-0.40765,-0.00419],[-0.4169,-0.00611],[-0.42912,-0.02671],[-0.43017,-0.02968],[-0.43244,-0.03195],[-0.43698,-0.03911]]]},{"cx":-0.4408,"p":[[[-0.43331,-0.01641],[-0.43802,-0.02287],[-0.44274,-0.0199],[-0.44815,-0.01554],[-0.4485,-0.01449],[-0.44763,-0.01379],[-0.43767,-0.01152],[-0.43366,-0.01536]]]}];
  function signature(ctx, W, H, t, a = 1) {
    const sc = W * 0.8, ox = W / 2, oy = H * 0.5;
    const breathe = 0.82 + 0.18 * Math.sin(t * 1.6);
    GR.forEach((g, k) => {
      const d = Math.abs(g.cx);
      const al = a * breathe * ease((t - d * 3.2) / 0.9);
      if (al <= 0) return;
      ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = ICE;
      glow(ctx, 'rgba(160,205,255,0.9)', H * 0.022);
      ctx.beginPath();
      g.p.forEach(poly => { poly.forEach(([x, y], n) => { const X = ox + x * sc, Y = oy + y * sc; n ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.closePath(); });
      ctx.fill('evenodd'); ctx.restore();
    });
  }

  function shards(ctx, W, H, t, a = 1) {
    // diagonal parallelograms streaming, blue gradient
    ctx.save(); ctx.globalAlpha = a;
    const n = 22;
    for (let i = 0; i < n; i++) {
      const seed = (i * 97.13) % 1;
      const sp = 0.12 + ((i * 37) % 10) / 60;
      const x = ((i / n + t * sp) % 1.3 - 0.15) * W;
      const w = W * (0.025 + ((i * 13) % 7) / 160);
      const g = ctx.createLinearGradient(x, 0, x + W * 0.3, H);
      g.addColorStop(0, i % 3 ? BLUE : '#ffffff'); g.addColorStop(1, i % 2 ? '#0a1d3d' : CYAN);
      ctx.fillStyle = g;
      ctx.globalAlpha = a * (0.35 + ((i * 7) % 6) / 10);
      ctx.beginPath(); ctx.moveTo(x, H); ctx.lineTo(x + w, H); ctx.lineTo(x + w + H * 0.75, 0); ctx.lineTo(x + H * 0.75, 0); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function lines(ctx, W, H, t, count, a = 1) {
    for (let i = 0; i < count; i++) {
      const p = ease((t - i * 0.35) / 1.1);
      const y = H * 0.5 + (i - (count - 1) / 2) * H * 0.07;
      const w = W * (0.62 - i * 0.03) * p;
      bar(ctx, W / 2 - w / 2, y, w, H * 0.009, a);
    }
  }

  function suv(ctx, x, y, w, alpha, roof) {
    const h = w * 0.42, p = (u, v) => [x + u * w, y + v * h];
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = ICE; ctx.lineWidth = Math.max(1.2, w * 0.012);
    glow(ctx, 'rgba(160,205,255,0.85)', w * 0.06);
    const pts = [[0.02, 0.78], [0.0, 0.5], [0.04, 0.3], [0.14, 0.08 + roof], [0.6, 0.04 + roof * 0.5], [0.74, 0.34], [0.96, 0.42], [1.0, 0.62], [0.98, 0.78]];
    ctx.beginPath(); ctx.moveTo(...p(...pts[0])); for (const q of pts.slice(1)) ctx.lineTo(...p(...q));
    ctx.stroke();
    ctx.beginPath(); ctx.moveTo(...p(0.02, 0.78)); ctx.lineTo(...p(0.1, 0.78)); ctx.moveTo(...p(0.3, 0.78)); ctx.lineTo(...p(0.7, 0.78)); ctx.moveTo(...p(0.9, 0.78)); ctx.lineTo(...p(0.98, 0.78)); ctx.stroke();
    for (const u of [0.2, 0.8]) { ctx.beginPath(); const [cx, cy] = p(u, 0.8); ctx.arc(cx, cy, h * 0.17, 0, Math.PI * 2); ctx.stroke(); }
    ctx.restore();
  }

  function txt(ctx, s, x, y, size, a, weight = 300, align = 'center', font = 'BMWNext') {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff'; ctx.textAlign = align; ctx.textBaseline = 'middle';
    ctx.font = `${weight} ${size}px ${font}, Helvetica, Arial, sans-serif`; ctx.fillText(s, x, y); ctx.restore();
  }

  function harrat(ctx, W, H, t, a = 1, warm = 0) {
    ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#0b1a22'); g.addColorStop(0.45, '#23434a'); g.addColorStop(0.62, warm ? '#d08a4a' : '#b8784a'); g.addColorStop(0.66, '#2a2420'); g.addColorStop(1, '#0d0b0a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const dx = (t * 6) % W;
    // cones
    const cones = [[0.12, 0.13, 0.09], [0.33, 0.2, 0.12], [0.52, 0.1, 0.07], [0.71, 0.17, 0.1], [0.9, 0.12, 0.08]];
    for (const [u, r, hh] of cones) {
      const cx = u * W - dx * 0.3;
      ctx.fillStyle = '#151210';
      ctx.beginPath(); ctx.moveTo(cx - r * W, H * 0.66); ctx.lineTo(cx - r * W * 0.25, H * (0.66 - hh)); ctx.lineTo(cx + r * W * 0.25, H * (0.66 - hh)); ctx.lineTo(cx + r * W, H * 0.66); ctx.fill();
    }
    // lava field texture
    for (let i = 0; i < 260; i++) {
      const hs = n => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
      const u = hs(i), v = hs(i + 500);
      ctx.fillStyle = `rgba(${40 + (i % 5) * 6},${36 + (i % 3) * 5},32,0.55)`;
      ctx.fillRect(((u * W - dx * 0.8) % W + W) % W, H * (0.68 + v * 0.32), W * 0.012 * (1 + v), H * 0.004 * (1 + v * 2));
    }
    ctx.restore();
  }

  const PLATES = [
    { n: 'Harrat Khaybar, sunrise', ar: 'حرة خيبر', sky: ['#1b2c3a', '#e2a35f', '#3a2a20'], k: 'cones' },
    { n: 'Jeddah corniche, golden hour', ar: 'كورنيش جدة', sky: ['#2b5d7a', '#f0b56d', '#1f4e66'], k: 'sea' },
    { n: 'AlUla, Hegra', ar: 'العلا', sky: ['#3d5a75', '#e7a36e', '#7a4a2e'], k: 'rocks' },
    { n: 'Jabal Al-Lawz, winter', ar: 'جبل اللوز', sky: ['#6d8299', '#dfe7ee', '#c9d3dc'], k: 'snow' },
    { n: 'Riyadh, KAFD at night', ar: 'الرياض', sky: ['#050913', '#13284a', '#0a0f1a'], k: 'city' },
    { n: 'The 1am shawarma run', ar: 'مشوار الشاورما', sky: ['#07070b', '#2a1030', '#120c10'], k: 'neon' },
    { n: 'Or just here. For now.', ar: 'أو هنا، حالياً', sky: ['#000', '#000', '#000'], k: 'live' }
  ];

  function plate(ctx, W, H, i, t, a = 1) {
    const P = PLATES[i]; ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, P.sky[0]); g.addColorStop(0.6, P.sky[1]); g.addColorStop(1, P.sky[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const d = t * 8;
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    if (P.k === 'cones') { for (let j = 0; j < 5; j++) { const cx = (j * 0.24 + 0.1) * W - d; ctx.beginPath(); ctx.moveTo(cx - W * 0.12, H * 0.7); ctx.lineTo(cx - W * 0.03, H * (0.55 - j % 2 * 0.04)); ctx.lineTo(cx + W * 0.03, H * (0.55 - j % 2 * 0.04)); ctx.lineTo(cx + W * 0.12, H * 0.7); ctx.fill(); } ctx.fillRect(0, H * 0.7, W, H); }
    if (P.k === 'sea') { ctx.fillStyle = 'rgba(15,50,70,0.7)'; ctx.fillRect(0, H * 0.62, W, H); for (let j = 0; j < 14; j++) { ctx.fillStyle = 'rgba(255,220,160,0.25)'; ctx.fillRect(W * 0.45 + Math.sin(j + t) * 20, H * (0.64 + j * 0.02), W * 0.1 - j * 4, 2); } ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(W * 0.7 - d, H * 0.45, 8, H * 0.2); }
    if (P.k === 'rocks') { ctx.fillStyle = 'rgba(70,35,20,0.85)'; rr(ctx, W * 0.15 - d, H * 0.38, W * 0.22, H * 0.4, 40); ctx.fill(); rr(ctx, W * 0.6 - d, H * 0.45, W * 0.3, H * 0.35, 50); ctx.fill(); ctx.fillStyle = 'rgba(120,70,40,0.9)'; ctx.fillRect(0, H * 0.75, W, H); }
    if (P.k === 'snow') { ctx.fillStyle = 'rgba(90,100,115,0.9)'; ctx.beginPath(); ctx.moveTo(0, H * 0.72); ctx.lineTo(W * 0.3 - d, H * 0.35); ctx.lineTo(W * 0.55 - d, H * 0.6); ctx.lineTo(W * 0.8 - d, H * 0.3); ctx.lineTo(W, H * 0.6); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill(); ctx.fillStyle = 'rgba(245,248,252,0.9)'; ctx.beginPath(); ctx.moveTo(W * 0.3 - d - 40, H * 0.4); ctx.lineTo(W * 0.3 - d, H * 0.35); ctx.lineTo(W * 0.3 - d + 50, H * 0.42); ctx.fill(); ctx.fillRect(0, H * 0.78, W, H); }
    if (P.k === 'city') { for (let j = 0; j < 18; j++) { const bw = W * 0.04, bh = H * (0.15 + ((j * 37) % 10) / 22); const bx = j * W * 0.058 - d * 0.5; ctx.fillStyle = '#04070d'; ctx.fillRect(bx, H * 0.72 - bh, bw, bh); for (let k = 0; k < 8; k++) { ctx.fillStyle = `rgba(255,${200 + k * 5},150,${((j + k) % 3) ? 0.15 : 0.5})`; ctx.fillRect(bx + 4, H * 0.72 - bh + 8 + k * bh / 9, bw - 8, 2); } } ctx.fillStyle = '#04070d'; ctx.beginPath(); ctx.moveTo(W * 0.5 - d * 0.5, H * 0.72); ctx.lineTo(W * 0.53 - d * 0.5, H * 0.08); ctx.lineTo(W * 0.56 - d * 0.5, H * 0.72); ctx.fill(); }
    if (P.k === 'neon') { ctx.fillStyle = '#0c0a0e'; ctx.fillRect(0, H * 0.3, W, H * 0.45); bar(ctx, W * 0.2, H * 0.36, W * 0.34, H * 0.025, 0.6 + 0.4 * (Math.sin(t * 9) > -0.6 ? 1 : 0), '#ff4fa8'); bar(ctx, W * 0.6, H * 0.4, W * 0.18, H * 0.02, 0.9, '#ffd36b'); txt(ctx, 'شاورما', W * 0.37, H * 0.5, H * 0.07, 0.7, 700, 'center', 'Arial'); ctx.fillStyle = '#16131a'; ctx.fillRect(0, H * 0.75, W, H); }
    if (P.k === 'live') { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(255,255,255,0.18)'; for (let j = 0; j < 4; j++) { const s = 1 - j * 0.2; ctx.strokeRect(W / 2 - W * s * 0.4, H / 2 - H * s * 0.4, W * s * 0.8, H * s * 0.8); } ctx.fillStyle = '#ff3b3b'; ctx.globalAlpha = a * (Math.sin(t * 4) > 0 ? 1 : 0.3); ctx.beginPath(); ctx.arc(W * 0.06, H * 0.08, H * 0.012, 0, 7); ctx.fill(); ctx.globalAlpha = a; txt(ctx, 'Set camera, live', W * 0.08, H * 0.08, H * 0.028, 0.8, 400, 'left'); }
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, H * 0.86, W, H * 0.14); ctx.restore();
    txt(ctx, String(i + 1).padStart(2, '0'), W * 0.05, H * 0.93, H * 0.03, a, 700, 'left');
    txt(ctx, P.n, W * 0.1, H * 0.93, H * 0.032, a, 300, 'left');
    txt(ctx, P.ar, W * 0.95, H * 0.93, H * 0.032, a * 0.8, 400, 'right', 'Arial');
  }

  // Chapters: name, duration, draw(ctx,W,H,t)
  const CH = [
    { id: 'standby', name: 'Pre-show loop', d: 8, f: (c, W, H, t) => { signature(c, W, H, t + 2, 0.55); txt(c, 'Starting soon', W / 2, H * 0.84, H * 0.035, 0.85, 300); txt(c, 'نبدأ قريباً', W / 2, H * 0.9, H * 0.03, 0.6, 400, 'center', 'Arial'); } },
    { id: 'sig', name: 'Act I  Signature', d: 7, f: (c, W, H, t) => signature(c, W, H, t) },
    { id: 'q1', name: 'Act II  Q1 One line', d: 5, f: (c, W, H, t) => { lines(c, W, H, t, 1, 1); txt(c, '1999', W / 2, H * 0.62, H * 0.04, ease((t - 1) / 1) * 0.8, 100); } },
    { id: 'q2', name: 'Act II  Q2 Five lines', d: 6, f: (c, W, H, t) => { lines(c, W, H, t, 5, 1); } },
    { id: 'q3', name: 'Act II  Q3 New language', d: 7, f: (c, W, H, t) => { lines(c, W, H, 99, 5, 1 - ease(t / 1.5)); shards(c, W, H, t, ease((t - 0.6) / 1.6)); } },
    { id: 'gen', name: 'Act III  Five generations', d: 10, f: (c, W, H, t) => { const yrs = ['1999', '2006', '2013', '2018', '2026']; const w = W * 0.15; for (let i = 0; i < 5; i++) { const a = ease((t - i * 1.4) / 0.8); const x = W * 0.09 + i * W * 0.17; suv(c, x, H * 0.4, w, a * (i === 4 ? 1 : 0.75), (2 - i) * 0.025); txt(c, yrs[i], x + w / 2, H * 0.68, H * 0.032, a, i === 4 ? 700 : 300); } ['E53', 'E70', 'F15', 'G05', 'G65'].forEach((m, i) => txt(c, m, W * 0.09 + i * W * 0.17 + w / 2, H * 0.73, H * 0.02, 0.4 * ease((t - i * 1.4 - 0.6) / 0.8), 400)); } },
    { id: 'hand', name: 'Act III  The handover', d: 5, f: (c, W, H, t) => { const p = ease(t / 2.2); const w = W * 0.15; suv(c, W * 0.77 + p * W * 0.4, H * 0.4, w, 1 - ease((t - 1.6) / 0.6), -0.05); bar(c, W * 0.5 + p * W * 0.6, H * 0.6, W * 0.4, H * 0.008, 1 - ease((t - 1.8) / 0.4)); if (t > 2.4) txt(c, 'Blackout. 2 seconds of silence.', W / 2, H / 2, H * 0.025, 0.25 * ease((t - 3) / 0.5), 300); } },
    { id: 'home', name: 'Act IV  Home: harrat plate', d: 8, f: (c, W, H, t) => harrat(c, W, H, t, ease(t / 2.5)) },
    ...PLATES.map((P, i) => ({ id: 'w' + i, name: 'Act V  Where to? ' + String(i + 1).padStart(2, '0'), d: 4.2, f: (c, W, H, t) => plate(c, W, H, i, t, ease(t / 0.25)) })),
    { id: 'end', name: 'End card', d: 7, f: (c, W, H, t) => { const a = ease(t / 1); txt(c, 'THE NEW BMW X5.', W / 2, H * 0.4, H * 0.06, a, 300); txt(c, 'Coming soon.', W / 2, H * 0.49, H * 0.035, a * 0.85, 300); txt(c, 'Book your private viewing', W / 2, H * 0.62, H * 0.024, ease((t - 1) / 1), 400); txt(c, 'Central    Western    Eastern', W / 2, H * 0.68, H * 0.02, ease((t - 1.5) / 1) * 0.6, 300); } }
  ];

  function frame(ctx, W, H, chIdx, t) {
    ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    CH[chIdx].f(ctx, W, H, t);
    ctx.restore();
  }
  return { CH, frame, signature, shards };
})();
