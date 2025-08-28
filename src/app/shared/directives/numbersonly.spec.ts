import { ElementRef } from '@angular/core';
import { Numbersonly } from './numbersonly';

describe('Numbersonly Directive', () => {
  let directive: Numbersonly;

  beforeEach(() => {
    const mockElementRef = new ElementRef(document.createElement('input'));

    directive = new Numbersonly(mockElementRef);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });
});
