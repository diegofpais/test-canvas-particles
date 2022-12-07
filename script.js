const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

console.log(ctx);

ctx.fillStyle = '#290760';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//---------agregar interactividad

class Particle {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.XORIGIN = x;
        this.YORIGIN = y;
        this.color = 'white'//`hsl(${Math.random() * 360}, 100%, 50%)`; // ToDo randomize
        this.angle = Math.random() * 360;
        this.speed = Math.random() * 4 - 2;
        this.speedX = this.speed * Math.sin(this.angle);
        this.speedY = this.speed * Math.cos(this.angle);
        this.radius = 20;
    }

    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.radius >= 1){    
            this.radius -= 0.1;
        }
    }

    draw(){
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 360);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = this.color;
        ctx.stroke();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.XORIGIN, this.YORIGIN);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

}

class Effect{
    constructor(x, y , particlesNumber, label){
        this.x = x;
        this.y = y;
        this.particlesNumber = particlesNumber;
        this.label = label;
        this.particles = [];
    }

    loadParticles(){
        if (this.particles.length < this.particlesNumber){
            for (let i = 0; i < this.particlesNumber; i++){
                this.particles.push(new Particle(this.x, this.y))
            }
        }
    }
    distance(x, y){
        const out = Math.hypot(x - this.x, y - this.y);
        return out
    }

    update(){
        for (let i = 0; i < this.particles.length; i++){
            this.particles[i].update();
            this.particles[i].draw();
            //delete item based on distance to origin, it gives a more circular final shape
            // if (this.distance(this.particles[i].x, this.particles[i].y) > 250){
            //     this.particles.splice(i, 1);
            //     i--;
            // }
            // delete item based on its radius (more square final shape)
            if (this.particles[i].radius < 1){
                this.particles.splice(i, 1);
                i--;
            }

        }
        
    }
}

//FRAME RATE
let lastTime = 0;
let fps = 65; // 20 frames per second
let nextFrame = 1000 / fps; // 1 seg (1000 mseg) dividido por los cuadros por segundo = tiempo entre cuadros (tiempo que hay que esperar para dibujar el proximo cuadro)

const effect1 = new Effect(canvas.width / 2, canvas.height / 2, 500, '90')

function animate(timeStamp){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    //ctx.fillRect(0, 0 , canvas.width, canvas.height)
    //ctx.fillRect(0, 0 , canvas.width, canvas.height)
    deltaTime = timeStamp - lastTime;
    if (deltaTime >= nextFrame){ // ver como ajustar a la frecuencia de refresco del monitor (de lo contrario titila)
        effect1.loadParticles()
        effect1.update();
        lastTime = timeStamp;
    }
    
    requestAnimationFrame(animate)
}

animate();