let redLight;
let yellowLight;
let greenLight;
let car;

let currentState = "red";  // Estado inicial del semáforo
let lastChangeTime = 0;  // Para evitar cambios demasiado rápidos
let changeDelay = 500;  // Tiempo mínimo entre clics (en milisegundos)

function setup() {
  createCanvas(800, 800);
  noStroke();

  // Definir las luces
  redLight = new Light(width / 2, 150, color(255, 0, 0));  // Luz roja
  yellowLight = new Light(width / 2, 250, color(255, 255, 0));  // Luz amarilla
  greenLight = new Light(width / 2, 350, color(0, 255, 0));  // Luz verde
  
  // Crear coche
  car = new Car(width / 2 - 40, height - 50);  // Posición inicial del coche
}

function draw() {
  background(0);

  // Mostrar las luces como rayos
  redLight.show();
  yellowLight.show();
  greenLight.show();

  // Mostrar el coche
  car.show();
car.move();
  // Detectar interacción del ratón para cambiar el estado del semáforo
  if (millis() - lastChangeTime > changeDelay) {
    if (dist(mouseX, mouseY, width / 2, 150) < 50) {
      // Mouse sobre la luz roja
      changeLight("red");
    } else if (dist(mouseX, mouseY, width / 2, 250) < 50) {
      // Mouse sobre la luz amarilla
      changeLight("yellow");
    } else if (dist(mouseX, mouseY, width / 2, 350) < 50) {
      // Mouse sobre la luz verde
      changeLight("green");
    }
  }

  // Activar las luces correspondientes según el estado actual
  if (currentState === "red") {
    redLight.activate();
    yellowLight.deactivate();
    greenLight.deactivate();
    car.stop();  // Detener el coche si el semáforo está en rojo
  
  } else if (currentState === "yellow") {
    redLight.deactivate();
    yellowLight.activate();
    greenLight.deactivate();
    car.stop();  // Detener el coche si el semáforo está en amarillo
    
  } else if (currentState === "green") {
    redLight.deactivate();
    yellowLight.deactivate();
    greenLight.activate();
      // Mover el coche si el semáforo está en verde
    
  }
}

function changeLight(newState) {
  // Cambiar el estado del semáforo si ha pasado suficiente tiempo
  if (millis() - lastChangeTime > changeDelay) {
    currentState = newState;
    lastChangeTime = millis();
  }
}

class Light {
  constructor(x, y, c) {
    this.pos = createVector(x, y);
    this.color = c;  // Guardamos el color aquí
    this.isActive = false;  // Por defecto la luz está apagada
    this.rays = [];
    this.createRays();  // Crear rayos para la luz
  }

  createRays() {
    // Crear rayos en 360 grados, separados por 10 grados
    for (let angle = 0; angle < 360; angle += 10) {
      this.rays.push(new Ray(this.pos, radians(angle), this.color));  // Pasamos el color de la luz a cada rayo
    }
  }

  show() {
    // Si está activa, dibujamos los rayos de color
    if (this.isActive) {
      for (let ray of this.rays) {
        ray.show(true);  // Rayos activos (color original)
      }
    } else {
      // Si está apagada, dibujamos rayos grises
      for (let ray of this.rays) {
        ray.show(false);  // Rayos grises cuando la luz está apagada
      }
    }
  }

  activate() {
    this.isActive = true;  // Activa la luz
  }

  deactivate() {
    this.isActive = false;  // Desactiva la luz
  }
}

class Ray {
  constructor(pos, dir, color) {
    this.pos = pos;
    this.dir = p5.Vector.fromAngle(dir);
    this.color = color;  // Guardamos el color de la luz
  }

  show(active = true) {
    // Dibujar rayos con el color adecuado
    if (active) {
      stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], 100);  // Color de la luz activa
    } else {
      stroke(50);  // Color gris si la luz está apagada
    }
    push();
    translate(this.pos.x, this.pos.y);
    line(0, 0, this.dir.x * 100, this.dir.y * 100);  // Dibujar rayos más largos
    pop();
  }
}

// Clase para el coche
class Car {
  constructor(x, y) {
    this.pos = createVector(x, y);  // Posición inicial del coche
    this.speed = 2;  // Velocidad del coche
  }

  show() {
    // Dibujar el coche: cuerpo y ruedas
    fill(200, 0, 0);  // Cuerpo del coche en rojo
    rect(this.pos.x, this.pos.y, 80, 30);  // Cuerpo del coche

    fill(0);  // Ruedas en negro
    ellipse(this.pos.x + 15, this.pos.y + 25, 20, 20);  // Rueda izquierda
    ellipse(this.pos.x + 65, this.pos.y + 25, 20, 20);  // Rueda derecha
  }

  move() {
    // Mover el coche dependiendo de las teclas presionadas y si el semáforo está verde
    if (currentState === "green") {
    
      if (keyIsDown(LEFT_ARROW)) {
        this.pos.x -= this.speed;  // Mover hacia la izquierda
      }
      if (keyIsDown(RIGHT_ARROW)) {
        this.pos.x += this.speed;  // Mover hacia la derecha
      }
      if (keyIsDown(UP_ARROW)) {
        this.pos.y -= this.speed;  // Mover hacia arriba
      }
      if (keyIsDown(DOWN_ARROW)) {
        this.pos.y += this.speed;  // Mover hacia abajo
      }

      // Limitar el movimiento para que no se salga de la pantalla
      this.pos.x = constrain(this.pos.x, 0, width - 80);
      this.pos.y = constrain(this.pos.y, 0, height - 30);
    }
  }

  stop() {
    // Detener el coche
    //this.speed = 0;
  }
}
