import { Component, signal } from "@angular/core";

@Component({
  selector: 'counter-root',
  templateUrl: './counter.html',
  styleUrl: './counter.css'
})
export class Counter {

  counter = 10;
  counterSignal = signal(10);

  increaseByOne(value: number) {
    this.counter += value;
    this.counterSignal.update(current => current + value);
  }
  decreaseByOne(value: number) {
    this.counter -= value;
    this.counterSignal.update(current => current - value);
  }
  reset(value: number) {
    this.counter = value;
    this.counterSignal.set(0);
  }
}
