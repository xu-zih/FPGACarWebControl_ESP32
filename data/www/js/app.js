new Vue({
    el: '#app',
    data: {
      direction: 'stop',
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
        let directionCode;
        switch (this.direction) {
          case 'up':
            directionCode = '1';
            break;
          case 'down':
            directionCode = '0';
            break;
          case 'left':
            directionCode = '10';
            break;
          case 'right':
            directionCode = '01';
            break;
          case 'stop':
          default:
            directionCode = '00';
            break;
        }
        const value = `${this.power ? 1 : 0}${directionCode}${parseInt(this.speed).toString(2).padStart(2, '0')}`;
        fetch(`/status?value=${value}`)
          .then(response => response.text())
          .then(status => {
            console.log('Current status:', status);
          });
      }
    }
  });
  