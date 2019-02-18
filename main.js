(() => {
  const DEFAULT_AMOUNT_OF_DOORS = 3;
  const MAX_AMOUNT_OF_DOORS = 1000;

  new Vue({
    el: '#app',
    data: {
      doors: [],
      amountOfDoors: DEFAULT_AMOUNT_OF_DOORS
    },
    created() {
      const initialAmountOfDoors = getInitialDoorAmount();
      this.amountOfDoors = getInitialDoorAmount();
      this.doors = generateDoors(initialAmountOfDoors);
    },
    methods: {
      reset() {
        const amountOfDoors = getValidAmountOfDoors(this.amountOfDoors);

        if (amountOfDoors === this.amountOfDoors) {
          storeDoorAmount(this.amountOfDoors);
        }

        this.doors = generateDoors(amountOfDoors);
      },
      keepDoor() {
        this.doors = keepDoor(this.doors);
      },
      switchDoor() {
        this.doors = switchDoor(this.doors);
      },
      pickDoor(number) {
        this.doors = pickDoor(this.doors, number);
      }
    },
    computed: {
      hasPickedDoor() {
        return this.doors.some(door => door.isPicked);
      },
      hasFinished() {
        return this.doors.filter(door => door.isOpen).length === this.doors.length - 1;
      },
      hasWon() {
        return this.doors.some(door => door.isOpen && door.hasCar);
      },
      colSize() {
        return this.doors.length === 3 ? 4 : 3;
      }
    }
  });

  function getInitialDoorAmount() {
    return Number(localStorage.getItem('amountOfDoors') || 3);
  }

  function storeDoorAmount(amount) {
    localStorage.setItem('amountOfDoors', amount);
  }

  function getValidAmountOfDoors(amount) {
    if (amount > DEFAULT_AMOUNT_OF_DOORS && amount <= MAX_AMOUNT_OF_DOORS) {
      return amount;
    }

    return DEFAULT_AMOUNT_OF_DOORS;
  }

  function generateDoors(amount) {
    const carIndex = getRandomInt(0, amount - 1);
    const doors = [];

    for (let i = 0; i < amount; i++) {
      doors.push({
        number: i + 1,
        isOpen: false,
        isPicked: false,
        hasCar: i === carIndex
      });
    }

    return doors;
  }

  function switchDoor(doors) {
    return doors
      .map(door => {
        if (door.isPicked) {
          return { ...door, isPicked: false }
        }

        if (!door.isPicked && !door.isOpen) {
          return { ...door, isPicked: true, isOpen: true }
        }

        return door;
      });
  }

  function keepDoor(doors) {
    return doors.map(door => {
      if (door.isPicked) {
        return { ...door, isOpen: true }
      }

      return door;
    });
  }

  function pickDoor(doors, number) {
    const doorNotToReveal = getDoorNotToReveal(doors, number);

    return doors
      .map(door => {
        if (door.number === number) {
          return { ...door, isPicked: true };
        }

        if (door.number !== doorNotToReveal.number) {
          return { ...door, isOpen: true };
        }

        return door;
      });
  }

  function getDoorNotToReveal(doors, number) {
    const pickedDoor = doors.find(door => door.number == number);
    const remainingDoors = doors.filter(door => door.number !== number);

    if (!pickedDoor.hasCar) {
      return remainingDoors.find(door => door.hasCar);
    }

    const indexNotToReveal = getRandomInt(0, remainingDoors.length - 1);

    return remainingDoors.find((_, index) => index === indexNotToReveal);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
})();
