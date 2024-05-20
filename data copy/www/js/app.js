new Vue({
    el: '#app',
    data: {
      direction: '0',
      power: false,
      speed: 0
    },
    methods: {
      controlDirection(dir) {
        switch (dir) {
          case 'up':
            this.direction = '1';
            break;
          case 'down':
            this.direction = '0';
            break;
          case 'left':
            this.direction = '10';
            break;
          case 'right':
            this.direction = '01';
            break;
          case 'stop':
          default:
            this.direction = '00';
            break;
        }
        this.updateStatus();
      },
      togglePower() {
        this.power = !this.power;
        this.updateStatus();
      },
      changeSpeed(event) {
        this.speed = event.target.value;
        this.updateStatus();
      },
      updateStatus() {
        const value = `${this.power ? 1 : 0}${this.direction}${parseInt(this.speed).toString(2).padStart(2, '0')}`;
        fetch(`/status?value=${value}`)
          .then(response => response.text())
          .then(status => {
            console.log('Current status:', status);
          });
      }
    }
  });
  