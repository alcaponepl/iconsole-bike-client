class Response {
  /**
   * @param {Buffer} data 
   */
  constructor(data) {
    this.magic = data[0];
    this.kind = data[1];
    this.clientId = data[2];
    this.meterId = data[3];
    this.params = data.slice(4, data.length - 5);
    this.checksum = data[data.length - 1];
  }

  /**
   * Get a one-byte numeric value.
   * 
   * @param {number} i index relative to data start.
   */
  getValue8(i) {
    if (i >= this.params.length) {
      return null;
    }

    return this.params[i] - 1;
  }

  /**
   * Don't look at me, that's just how the protocol works.
   * 
   * @param {number} i index relative to data start of most significant byte.
   */
  getValue16(i) {
    if (i >= this.params.length - 1) {
      return null;
    }

    return ((this.params[i] - 1) * 100) + (this.params[i+1] - 1);
  }

  /**
   * Prase parses the packet's data.
   */
  parse() {
    switch (this.kind) {
      case 0xa0: return {
        kind: "ack",
      };

      case 0xa1: return {
        kind: "maxLevel",
        maxLevel: this.getValue8(0),
      };

      case 0xa2: return {
        kind: "workoutState",
        workoutState: {
          minutes: this.getValue8(0),
          seconds: this.getValue8(1),
          calories: null,
          distance: null,
          speed: null,
        },
      };

      default: return {
        kind: "unknown:" + this.kind.toString(16),
        params: [...this.params],
      };
    }
  }
}


module.exports = {
  Response,
};