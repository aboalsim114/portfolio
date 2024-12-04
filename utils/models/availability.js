export class Availability {
  constructor(date, timeSlots) {
    this.date = date;
    this.timeSlots = timeSlots; // Array of available time slots
  }

  static fromJSON(json) {
    return new Availability(
      new Date(json.date),
      json.timeSlots
    );
  }

  toJSON() {
    return {
      date: this.date.toISOString().split('T')[0],
      timeSlots: this.timeSlots
    };
  }
} 