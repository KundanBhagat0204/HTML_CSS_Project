window.requestAnimFrame = function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60);
      }
    );
  }();
  
  function init(elemId) {
    const canvas = document.getElementById(elemId);
    const c = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    c.fillStyle = "rgba(30,30,30,1)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    
    return { c, canvas };
  }
  
  window.onload = function () {
    const { c, canvas } = init("canvas");
    let w = canvas.width, h = canvas.height;
    let mouse = { x: false, y: false };
    let last_mouse = {};
  
    function dist(x1, y1, x2, y2) {
      return Math.hypot(x2 - x1, y2 - y1);
    }
  
    class Segment {
      constructor(parent, length, angle, isFirst) {
        this.isFirst = isFirst;
        this.pos = isFirst ? { x: parent.x, y: parent.y } : { x: parent.nextPos.x, y: parent.nextPos.y };
        this.length = length;
        this.angle = angle;
        this.nextPos = {
          x: this.pos.x + this.length * Math.cos(this.angle),
          y: this.pos.y + this.length * Math.sin(this.angle)
        };
      }
  
      update(target) {
        this.angle = Math.atan2(target.y - this.pos.y, target.x - this.pos.x);
        this.pos.x = target.x + this.length * Math.cos(this.angle - Math.PI);
        this.pos.y = target.y + this.length * Math.sin(this.angle - Math.PI);
        this.nextPos.x = this.pos.x + this.length * Math.cos(this.angle);
        this.nextPos.y = this.pos.y + this.length * Math.sin(this.angle);
      }
  
      fallback(target) {
        this.pos = { ...target };
        this.nextPos.x = this.pos.x + this.length * Math.cos(this.angle);
        this.nextPos.y = this.pos.y + this.length * Math.sin(this.angle);
      }
  
      draw() {
        c.lineTo(this.nextPos.x, this.nextPos.y);
      }
    }
  
    class Tentacle {
      constructor(x, y, length, segmentsCount) {
        this.x = x;
        this.y = y;
        this.length = length;
        this.segmentsCount = segmentsCount;
        this.rand = Math.random();
        this.segments = [new Segment(this, length / segmentsCount, 0, true)];
  
        for (let i = 1; i < segmentsCount; i++) {
          this.segments.push(new Segment(this.segments[i - 1], length / segmentsCount, 0, false));
        }
      }
  
      move(lastTarget, target) {
        this.angle = Math.atan2(target.y - this.y, target.x - this.x);
        let dt = dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5;
        let adjustedTarget = {
          x: target.x - 0.8 * dt * Math.cos(this.angle),
          y: target.y - 0.8 * dt * Math.sin(this.angle)
        };
  
        this.segments[this.segmentsCount - 1].update(adjustedTarget);
        for (let i = this.segmentsCount - 2; i >= 0; i--) {
          this.segments[i].update(this.segments[i + 1].pos);
        }
  
        if (dist(this.x, this.y, target.x, target.y) <= this.length + dt) {
          this.segments[0].fallback({ x: this.x, y: this.y });
          for (let i = 1; i < this.segmentsCount; i++) {
            this.segments[i].fallback(this.segments[i - 1].nextPos);
          }
        }
      }
  
      draw(target) {
        if (dist(this.x, this.y, target.x, target.y) <= this.length) {
          c.globalCompositeOperation = "lighter";
          c.beginPath();
          c.lineTo(this.x, this.y);
          for (const segment of this.segments) {
            segment.draw();
          }
          c.strokeStyle = `hsl(${this.rand * 60 + 180},100%,${this.rand * 60 + 25}%)`;
          c.lineWidth = this.rand * 2;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.stroke();
          c.globalCompositeOperation = "source-over";
        }
      }
  
      drawBase(target) {
        c.beginPath();
        c.arc(this.x, this.y, this.rand * 2 + (dist(this.x, this.y, target.x, target.y) <= this.length ? 1 : 0), 0, 2 * Math.PI);
        c.fillStyle = dist(this.x, this.y, target.x, target.y) <= this.length ? "white" : "darkcyan";
        c.fill();
      }
    }
  
    const maxLen = 300, minLen = 50, segmentCount = 30, tentacleCount = 500;
    const tentacles = Array.from({ length: tentacleCount }, () => 
      new Tentacle(Math.random() * w, Math.random() * h, Math.random() * (maxLen - minLen) + minLen, segmentCount)
    );
  
    let target = { x: 0, y: 0 };
    let lastTarget = { x: 0, y: 0 };
    let t = 0, q = 10;
  
    function draw() {
      if (mouse.x !== false) {
        target.x += (mouse.x - target.x) / 10;
        target.y += (mouse.y - target.y) / 10;
      } else {
        target.x += (w / 2 + ((h / 2 - q) * Math.sqrt(2) * Math.cos(t)) / (Math.sin(t) ** 2 + 1) - target.x) / 10;
        target.y += (h / 2 + ((h / 2 - q) * Math.sqrt(2) * Math.cos(t) * Math.sin(t)) / (Math.sin(t) ** 2 + 1) - target.y) / 10;
        t += 0.01;
      }
  
      c.clearRect(0, 0, w, h);
      c.beginPath();
      c.arc(target.x, target.y, dist(lastTarget.x, lastTarget.y, target.x, target.y) + 5, 0, 2 * Math.PI);
      c.fillStyle = "hsl(210,100%,80%)";
      c.fill();
  
      for (const tentacle of tentacles) {
        tentacle.move(lastTarget, target);
        tentacle.drawBase(target);
      }
      for (const tentacle of tentacles) {
        tentacle.draw(target);
      }
  
      lastTarget.x = target.x;
      lastTarget.y = target.y;
      window.requestAnimFrame(draw);
    }
  
    canvas.addEventListener("mousemove", (e) => {
      last_mouse.x = mouse.x;
      last_mouse.y = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
  
    canvas.addEventListener("mouseleave", () => {
      mouse.x = false;
      mouse.y = false;
    });
  
    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });
  
    window.requestAnimFrame(draw);
  };
  