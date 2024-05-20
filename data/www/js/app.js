new Vue({
    el: '#app',
    data: {
      direction: 'up',
      directionud: '1',
      directionlr: '00',
      power: false,
      speed: 0
    },
    methods: {
      startControl(dir) {
        this.direction = dir;
        this.updateStatus();
      },
      stopControl() {
        this.direction = 'stop';
        this.updateStatus();
      },
      togglePower() {
        this.power = !this.power;
        this.updateStatus();
      },
      updateStatus() {
        if (!this.power) {
          this.speed = 0;
        }
        switch (this.direction) {
          case 'up':
            this.directionud = '0';
            break;
          case 'down':
            this.directionud = '1';
            break;
          case 'left':
            this.directionlr = '10';
            break;
          case 'right':
            this.directionlr = '01';
            break;
          case 'current':
            this.directionlr = '00';
            break;
          case 'stop':
            this.speed = 0;
            break;
          default:
            this.speed = 0;
            break;
        }
        const value = `${this.directionud}${this.directionlr}${parseInt(this.speed).toString(2).padStart(2, '0')}`;
        fetch(`/status?value=${value}`)
          .then(response => response.text())
          .then(status => {
            console.log('Current status:', status);
          });
      }
    }
  });
  