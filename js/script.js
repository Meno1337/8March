const welcomeScreen = document.getElementById('welcome-screen');
const startBtn = document.getElementById('start-btn');
const flowerIcons = ['🌸','🌹','🌷','🌺','🌼','💐'];

function createFlower() {
    const flower = document.createElement('div');
    flower.className = 'flower';
    flower.innerText = flowerIcons[Math.floor(Math.random()*flowerIcons.length)];
    flower.style.left = (Math.random()*100)+'vw';
    flower.style.fontSize = (Math.random()*20+20)+'px';
    flower.style.animationDuration = (Math.random()*3+4)+'s';
    welcomeScreen.appendChild(flower);
    setTimeout(()=>flower.remove(), parseFloat(flower.style.animationDuration)*1000);
}

const flowerGenerator = setInterval(createFlower, 200);

startBtn.addEventListener('click', () => {
    clearInterval(flowerGenerator);
    welcomeScreen.classList.add('fade-out');

    const photoTop = document.querySelector('.photo-top');
    const photoBottom = document.querySelector('.photo-bottom');
    const photoNew = document.querySelector('.photo-new');
    const photoBack = document.querySelector('.photo-back');
    const photo5 = document.querySelector('.photo-arc');
    const photo6Img = document.getElementById('scratch-cover');
    const photo7 = document.getElementById('photo-7');
    const canvas = document.getElementById('scratch-canvas');

    setTimeout(() => {
        if(photoBottom) photoBottom.classList.add('move-right-exit');
        if(photoNew) photoNew.classList.add('move-left-enter');

        if(photoNew){
            photoNew.addEventListener('animationend', function(){
                if(photoTop) photoTop.style.display='none';
                if(photoBottom) photoBottom.style.display='none';
                if(photoBack) photoBack.style.display='block';

                if(photo5){
                    photo5.classList.add('move-arc');
                    photo5.addEventListener('animationend', function(){
                        photo5.style.setProperty('display','none','important');
                        if(photo7) photo7.style.display='block';

                        if(photo6Img && photo6Img.src){
                            const img6 = new Image();
                            img6.crossOrigin='anonymous';
                            img6.src = photo6Img.src;
                            img6.onload = () => {
                                const targetWidth = 1300;
                                const scale = targetWidth / img6.naturalWidth;
                                const targetHeight = Math.round(img6.naturalHeight * scale);

                                canvas.width = targetWidth;
                                canvas.height = targetHeight;
                                canvas.style.width = targetWidth+'px';
                                canvas.style.height = targetHeight+'px';
                                canvas.style.display='block';
                                canvas.style.left='50%';
                                canvas.style.transform='translateX(-50%)';
                                canvas.style.top='10%';
                                canvas.style.zIndex=10;

                                const ctx = canvas.getContext('2d');
                                ctx.clearRect(0,0,canvas.width,canvas.height);
                                ctx.drawImage(img6,0,0,canvas.width,canvas.height);
                                ctx.globalCompositeOperation='destination-out';
                                ctx.lineJoin='round';
                                ctx.lineCap='round';

                                const brushRadius = Math.round(Math.max(20, canvas.width*0.03));
                                let isPointerDown=false, lastX=0, lastY=0;
                                let checking=false;
                                let textShown=false;

                                function drawLine(x1,y1,x2,y2){
                                    ctx.beginPath();
                                    ctx.moveTo(x1,y1);
                                    ctx.lineTo(x2,y2);
                                    ctx.lineWidth=brushRadius*2;
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.arc(x2,y2,brushRadius,0,Math.PI*2);
                                    ctx.fill();
                                }

                                function checkErasedPercent(){
                                    if(checking) return;
                                    checking=true;
                                    requestAnimationFrame(()=>{
                                        try{
                                            const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
                                            const data = imgData.data;
                                            let transparent=0;
                                            for(let i=3;i<data.length;i+=4){
                                                if(data[i]<128) transparent++;
                                            }
                                            const totalPixels = canvas.width*canvas.height;
                                            const percent = (transparent/totalPixels)*100;

                                            if(percent>=90 && !textShown){
                                                textShown=true;
                                                const repoText = document.getElementById('repo-text');
                                                repoText.classList.add('show');

                                                setTimeout(()=>{
                                                    const subText = document.getElementById('sub-text');
                                                    subText.classList.add('show');
                                                }, 800);

                                                setTimeout(()=>{
                                                    startHearts();
                                                }, 1800);
                                            }
                                        } catch(e){ console.error(e); }
                                        finally{ checking=false; }
                                    });
                                }

                                function onPointerDown(e){
                                    isPointerDown=true;
                                    const rect=canvas.getBoundingClientRect();
                                    lastX = (e.clientX-rect.left)*(canvas.width/rect.width);
                                    lastY = (e.clientY-rect.top)*(canvas.height/rect.height);
                                    ctx.beginPath();
                                    ctx.arc(lastX,lastY,brushRadius,0,Math.PI*2);
                                    ctx.fill();
                                    checkErasedPercent();
                                    canvas.setPointerCapture(e.pointerId);
                                    e.preventDefault();
                                }

                                function onPointerMove(e){
                                    if(!isPointerDown) return;
                                    const rect=canvas.getBoundingClientRect();
                                    const x=(e.clientX-rect.left)*(canvas.width/rect.width);
                                    const y=(e.clientY-rect.top)*(canvas.height/rect.height);
                                    drawLine(lastX,lastY,x,y);
                                    lastX=x; lastY=y;
                                    checkErasedPercent();
                                    e.preventDefault();
                                }

                                function onPointerUp(e){
                                    isPointerDown=false;
                                    try{ canvas.releasePointerCapture(e.pointerId);}catch(e){}
                                    checkErasedPercent();
                                }

                                canvas.addEventListener('pointerdown',onPointerDown);
                                canvas.addEventListener('pointermove',onPointerMove);
                                window.addEventListener('pointerup',onPointerUp);
                                window.addEventListener('pointercancel',onPointerUp);

                            };
                        }
                    }, {once:true});
                }
            }, {once:true});
        }
    }, 500);

    setTimeout(()=>{ welcomeScreen.style.display='none';},1500);
});

// Сердечки
function createHeart(){
    const heart = document.createElement('div');
    heart.className='heart';
    heart.innerText='❤️';
    const startX = Math.random()*100;
    const size = Math.random()*20+20;
    const duration = Math.random()*2+3;
    heart.style.left=startX+'vw';
    heart.style.fontSize=size+'px';
    heart.style.animationDuration=duration+'s';
    document.getElementById('hearts-container').appendChild(heart);
    setTimeout(()=>heart.remove(),duration*1000);
}

function startHearts(){
    const interval = setInterval(createHeart,200);
    setTimeout(()=>clearInterval(interval),10000);
}